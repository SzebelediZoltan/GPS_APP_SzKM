using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace gpass_app_wpf.Views
{
    public partial class ClanFormWindow : Window
    {
        public ClanFormViewModel VM { get; }

        public ClanFormWindow()
        {
            InitializeComponent();
            VM = new ClanFormViewModel(this);
            DataContext = VM;
            ThemeService.Apply();
            UpdateBackground();
            ThemeService.ThemeChanged += UpdateBackground;
        }

        private void UpdateBackground()
            => Dispatcher.Invoke(() => Background = (Brush)FindResource("AppBackground"));

        private void LeaderSearchListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (sender is ListBox lb && lb.SelectedItem is User user)
            {
                VM.SelectLeaderCommand.Execute(user);
                lb.SelectedItem = null;
            }
        }
    }
}
