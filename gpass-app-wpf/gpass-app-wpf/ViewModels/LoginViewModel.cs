using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using System.Windows;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace gpass_app_wpf.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
        private readonly ApiService _api;

        public string Username { get; set; }
        public string Password { get; set; }

        public RelayCommand LoginCommand { get; }

        public LoginViewModel()
        {
            _api = new ApiService();
            LoginCommand = new RelayCommand(async _ => await Login());
        }

        private async Task Login()
        {
            try
            {
                var token = await _api.PostAsync<string>(
                    "api/auth/login",
                    new LoginRequest
                    {
                        userID = Username,
                        password = Password
                    });

                var handler = new JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(token);

                var isAdminClaim = jwt.Claims.FirstOrDefault(c => c.Type == "isAdmin");

                if (isAdminClaim != null && isAdminClaim.Value == "true")
                {
                    MessageBox.Show("Admin vagy, beléphetsz!");

                    // Itt lehet Home ablak megnyitás
                    // new Home().Show();
                    // Application.Current.Windows[0].Close();
                }
                else
                {
                    MessageBox.Show("Nem vagy admin, nincs hozzáférésed!");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
