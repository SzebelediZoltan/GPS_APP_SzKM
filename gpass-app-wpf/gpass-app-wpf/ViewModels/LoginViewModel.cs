using System;
using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.Views;
using System.Collections.ObjectModel;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class ServerOption
    {
        public string Label   { get; set; }
        public string BaseUrl { get; set; }
        public override string ToString() => Label;
    }

    public class LoginViewModel : BaseViewModel
    {
        public string UserIdentifier { get; set; }
        public string Password       { get; set; }

        // ── Szerver választó ───────────────────────────────────────────────────
        public ObservableCollection<ServerOption> Servers { get; } = new()
        {
            new ServerOption { Label = "Localhost (localhost:4000)", BaseUrl = "http://localhost:4000/api/" },
            new ServerOption { Label = "Éles szerver (gpass.site)",  BaseUrl = "https://gpass.site/api/"  },
        };

        private ServerOption _selectedServer;
        public ServerOption SelectedServer
        {
            get => _selectedServer;
            set { _selectedServer = value; OnPropertyChanged(); }
        }

        // ── Hibaüzenet ─────────────────────────────────────────────────────────
        private string _errorMessage;
        public string ErrorMessage
        {
            get => _errorMessage;
            set { _errorMessage = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasError)); }
        }
        public bool HasError => !string.IsNullOrEmpty(_errorMessage);

        // ── Betöltés jelző ─────────────────────────────────────────────────────
        private bool _loading;
        public bool Loading
        {
            get => _loading;
            set { _loading = value; OnPropertyChanged(); }
        }

        public RelayCommand LoginCommand { get; }

        public LoginViewModel()
        {
            SelectedServer = Servers[0];
            LoginCommand   = new RelayCommand(async _ => await Login(), _ => !Loading);
        }

        private async Task Login()
        {
            ErrorMessage = null;

            if (string.IsNullOrWhiteSpace(UserIdentifier) || string.IsNullOrWhiteSpace(Password))
            {
                ErrorMessage = "Add meg a felhasználónevet és a jelszót!";
                return;
            }

            Loading = true;

            // Szerver beállítása
            SessionService.SetServer(SelectedServer.BaseUrl);

            try
            {
                var token = await SessionService.Api.PostAsync<string>(
                    "auth/login",
                    new LoginRequest
                    {
                        userID   = UserIdentifier,
                        password = Password
                    });

                var handler = new JwtSecurityTokenHandler();
                var jwt     = handler.ReadJwtToken(token);

                var idClaim       = jwt.Claims.FirstOrDefault(c => c.Type == "userID");
                var usernameClaim  = jwt.Claims.FirstOrDefault(c => c.Type == "username");
                var isAdminClaim   = jwt.Claims.FirstOrDefault(c => c.Type == "isAdmin");

                if (isAdminClaim == null || isAdminClaim.Value.ToLower() != "true")
                {
                    ErrorMessage = "Nincs admin jogosultságod!";
                    return;
                }

                SessionService.Token    = token;
                SessionService.IsAdmin  = true;
                SessionService.UserId   = int.Parse(idClaim.Value);
                SessionService.Username = usernameClaim.Value;

                var home = new Home();
                home.Show();
                Application.Current.Windows[0].Close();
            }
            catch (System.Threading.Tasks.TaskCanceledException)
            {
                ErrorMessage = $"Kapcsolat időtúllépés — nem érhető el: {SelectedServer.Label}";
            }
            catch (System.Net.Http.HttpRequestException ex)
            {
                ErrorMessage = $"Nem sikerült csatlakozni:\n{SelectedServer.Label}";
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
            finally
            {
                Loading = false;
            }
        }
    }
}
