using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

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
            ThemeService.Apply();
            UpdateBackground();
            ThemeService.ThemeChanged += UpdateBackground;

            // PasswordBox -> ViewModel kötés codebehindból
            passwordBox.PasswordChanged += (_, _) => VM.Password = passwordBox.Password;
        }

        private void UpdateBackground()
            => Dispatcher.Invoke(() => Background = (Brush)FindResource("AppBackground"));
    }
}
