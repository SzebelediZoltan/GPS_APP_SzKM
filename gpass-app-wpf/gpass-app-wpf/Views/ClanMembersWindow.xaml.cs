using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace gpass_app_wpf.Views
{
    public partial class ClanMembersWindow : Window
    {
        private ClanMembersViewModel _vm;

        public ClanMembersWindow(ClanWithMembers clan)
        {
            InitializeComponent();
            _vm = new ClanMembersViewModel(clan);
            DataContext = _vm;
        }

        private void AddSearchListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (sender is ListBox lb && lb.SelectedItem is User user)
            {
                _vm.SelectAddUserCommand.Execute(user);
                lb.SelectedItem = null;
            }
        }
    }
}
