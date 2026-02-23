using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.Views;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
        private async Task LoadUsers()
        {
            try
            {
                var users = await _api.GetAsync<List<User>>("users");
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

            if (!dialog.VM.Confirmed) return;

            try
            {
                await _api.PostAsync<User>("users", new CreateUserRequest
                {
                    username = dialog.VM.Username,
                    email    = dialog.VM.Email,
                    password = dialog.VM.Password
                });
                await LoadUsers();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a létrehozáskor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ── UPDATE ────────────────────────────────────────────────────────────
        private async Task EditUser()
        {
            if (SelectedUser == null) return;

            var dialog = new UserFormWindow(SelectedUser);
            dialog.Owner = Application.Current.MainWindow;
            dialog.ShowDialog();

            if (!dialog.VM.Confirmed) return;

            try
            {
                var payload = new Dictionary<string, object>
                {
                    ["username"] = dialog.VM.Username,
                    ["email"]    = dialog.VM.Email,
                    ["isAdmin"]  = dialog.VM.IsAdmin
                };
                if (!string.IsNullOrWhiteSpace(dialog.VM.Password))
                    payload["password"] = dialog.VM.Password;

                await _api.PutAsync<User>($"users/{SelectedUser.ID}", payload);
                await LoadUsers();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a szerkesztéskor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
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
