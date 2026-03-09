using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;
using System.Windows.Media;

namespace gpass_app_wpf.Views
{
    public partial class UserDetailWindow : Window
    {
        public UserDetailWindow(User user)
        {
            InitializeComponent();
            DataContext = new UserDetailViewModel(user);
            ThemeService.Apply();
            UpdateBackground();
            ThemeService.ThemeChanged += UpdateBackground;
        }

        private void UpdateBackground()
            => Dispatcher.Invoke(() => Background = (Brush)FindResource("AppBackground"));
    }
}
