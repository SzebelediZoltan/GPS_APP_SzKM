using gpass_app_wpf.DAL;
using gpass_app_wpf.ViewModels;
using System.Windows;

namespace gpass_app_wpf.Views
{
    public partial class Home : Window
    {
        public Home()
        {
            InitializeComponent();
            DataContext = new HomeViewModel();
            ThemeService.Apply();
            UpdateToggleBtn();
            ThemeService.ThemeChanged += UpdateToggleBtn;
        }

        private void ThemeToggle_Click(object sender, RoutedEventArgs e)
        {
            ThemeService.Toggle();
        }

        private void UpdateToggleBtn()
        {
            Dispatcher.Invoke(() =>
            {
                themeToggleBtn.Content = ThemeService.IsDark ? "☀" : "🌙";
                Background = (System.Windows.Media.Brush)FindResource("AppBackground");
            });
        }
    }
}
