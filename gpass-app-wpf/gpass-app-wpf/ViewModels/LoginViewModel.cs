using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.Views;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
        private readonly ApiService _api;

        public string UserIdentifier { get; set; }
        public string Password { get; set; }

        public RelayCommand LoginCommand { get; }

        public LoginViewModel()
        {
            _api = SessionService.Api;
            LoginCommand = new RelayCommand(async _ => await Login());
        }

        private async Task Login()
        {
            try
            {
                var token = await _api.PostAsync<string>(
                    "auth/login",
                    new LoginRequest
                    {
                        userID = UserIdentifier,
                        password = Password
                    });

                var handler = new JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(token);

                var idClaim = jwt.Claims.FirstOrDefault(c => c.Type == "userID");
                var usernameClaim = jwt.Claims.FirstOrDefault(c => c.Type == "username");
                var isAdminClaim = jwt.Claims.FirstOrDefault(c => c.Type == "isAdmin");

                if (isAdminClaim == null || isAdminClaim.Value.ToLower() != "true")
                {
                    MessageBox.Show("Nincs admin jogosultságod!", "Hozzáférés megtagadva",
                        MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                SessionService.Token = token;
                SessionService.IsAdmin = true;
                SessionService.UserId = int.Parse(idClaim.Value);
                SessionService.Username = usernameClaim.Value;

                var home = new Home();
                home.Show();

                Application.Current.Windows[0].Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Bejelentkezési hiba: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
