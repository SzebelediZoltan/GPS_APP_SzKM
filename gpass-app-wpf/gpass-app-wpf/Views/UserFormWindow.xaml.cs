using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;
using System.Windows.Controls;

namespace gpass_app_wpf.Views
{
    public partial class UserFormWindow : Window
    {
        public UserFormViewModel VM { get; }

        public UserFormWindow(User editUser = null)
        {
            InitializeComponent();
            VM = new UserFormViewModel(this, editUser);
            DataContext = VM;

            // PasswordBox -> ViewModel kötés codebehindból
            passwordBox.PasswordChanged += (_, _) => VM.Password = passwordBox.Password;
        }
    }
}
