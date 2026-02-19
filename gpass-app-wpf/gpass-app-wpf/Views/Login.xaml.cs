using gpass_app_wpf.ViewModels;
using System.Windows;

namespace gpass_app_wpf.Views
{
    public partial class Login : Window
    {
        public Login()
        {
            InitializeComponent();

            var vm = new LoginViewModel();
            DataContext = vm;

            passwordBox.PasswordChanged += (s, e) =>
            {
                vm.Password = passwordBox.Password;
            };
        }
    }

}
