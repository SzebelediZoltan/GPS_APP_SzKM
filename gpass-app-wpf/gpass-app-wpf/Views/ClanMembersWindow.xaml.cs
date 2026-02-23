using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;

namespace gpass_app_wpf.Views
{
    public partial class ClanMembersWindow : Window
    {
        public ClanMembersWindow(ClanWithMembers clan)
        {
            InitializeComponent();
            DataContext = new ClanMembersViewModel(clan);
        }
    }
}
