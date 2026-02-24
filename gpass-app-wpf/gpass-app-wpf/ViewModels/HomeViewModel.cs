using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.Views;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class HomeViewModel : BaseViewModel
    {
        private readonly ApiService _api;

        public string WelcomeText { get; set; }

        public RelayCommand LogoutCommand     { get; }
        public RelayCommand AddUserCommand    { get; }
        public RelayCommand EditUserCommand   { get; }
        public RelayCommand DeleteUserCommand { get; }
        public RelayCommand ViewDetailCommand { get; }

        public ObservableCollection<User> Users { get; set; } = new();

        public ClanViewModel ClanVM { get; } = new();

        private User _selectedUser;
        public User SelectedUser
        {
            get => _selectedUser;
            set { _selectedUser = value; OnPropertyChanged(); }
        }

        // ── User keresés ──────────────────────────────────────────────────────
        private string _userSearch = "";
        public string UserSearch
        {
            get => _userSearch;
            set { _userSearch = value; OnPropertyChanged(); DebounceUserSearch(); }
        }

        private CancellationTokenSource _userSearchCts;
        private async void DebounceUserSearch()
        {
            _userSearchCts?.Cancel();
            _userSearchCts = new CancellationTokenSource();
            var token = _userSearchCts.Token;
            try
            {
                await Task.Delay(350, token);
                if (!token.IsCancellationRequested)
                    await LoadUsers();
            }
            catch (TaskCanceledException) { }
        }

        public HomeViewModel()
        {
            _api = SessionService.Api;
            WelcomeText = $"Üdv, {SessionService.Username}!";

            LogoutCommand     = new RelayCommand(async _ => await Logout());
            AddUserCommand    = new RelayCommand(async _ => await AddUser());
            EditUserCommand   = new RelayCommand(async _ => await EditUser(),   _ => SelectedUser != null);
            DeleteUserCommand = new RelayCommand(async _ => await DeleteUser(), _ => SelectedUser != null);
            ViewDetailCommand = new RelayCommand(_ => ViewDetail(),             _ => SelectedUser != null);

            _ = LoadUsers();
        }

        // ── LOGOUT ────────────────────────────────────────────────────────────
        private async Task Logout()
        {
            try
            {
                await _api.DeleteAsync("auth/logout");
                SessionService.Token    = null;
                SessionService.IsAdmin  = false;
                SessionService.UserId   = 0;
                SessionService.Username = null;

                var login = new Login();
                login.Show();
                Application.Current.Windows[0].Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Kijelentkezési hiba: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ── READ ──────────────────────────────────────────────────────────────
        public async Task LoadUsers()
        {
            try
            {
                var endpoint = string.IsNullOrWhiteSpace(UserSearch)
                    ? "users"
                    : $"users/search?query={Uri.EscapeDataString(UserSearch.Trim())}";

                var users = await _api.GetAsync<List<User>>(endpoint);
                Users.Clear();
                foreach (var u in users) Users.Add(u);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a felhasználók betöltésekor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ── CREATE ────────────────────────────────────────────────────────────
        private async Task AddUser()
        {
            var dialog = new UserFormWindow();
            dialog.Owner = Application.Current.MainWindow;
            dialog.ShowDialog();

            if (dialog.VM.Confirmed)
                await LoadUsers();
        }

        // ── UPDATE ────────────────────────────────────────────────────────────
        private async Task EditUser()
        {
            if (SelectedUser == null) return;

            var dialog = new UserFormWindow(SelectedUser);
            dialog.Owner = Application.Current.MainWindow;
            dialog.ShowDialog();

            if (dialog.VM.Confirmed)
                await LoadUsers();
        }

        // ── DELETE ────────────────────────────────────────────────────────────
        private async Task DeleteUser()
        {
            if (SelectedUser == null) return;

            var result = MessageBox.Show(
                $"Biztosan törölni akarod?\n\n{SelectedUser.username} ({SelectedUser.email})",
                "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Warning);

            if (result != MessageBoxResult.Yes) return;

            try
            {
                await _api.DeleteAsync($"users/{SelectedUser.ID}");
                await LoadUsers();
                SelectedUser = null;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a törléskor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ── DETAIL ────────────────────────────────────────────────────────────
        private void ViewDetail()
        {
            if (SelectedUser == null) return;

            var w = new UserDetailWindow(SelectedUser);
            w.Owner = Application.Current.MainWindow;
            w.ShowDialog();
        }
    }
}
