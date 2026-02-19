using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;

namespace gpass_app_wpf.Views
{
    public partial class UserDetailWindow : Window
    {
        public UserDetailWindow(User user)
        {
            InitializeComponent();
            DataContext = new UserDetailViewModel(user);
        }
    }
}
