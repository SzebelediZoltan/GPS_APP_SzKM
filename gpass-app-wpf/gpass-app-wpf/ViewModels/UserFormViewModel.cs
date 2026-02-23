using gpass_app_wpf.Models;
using System;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class UserFormViewModel : BaseViewModel
    {
        public bool IsEditMode { get; }
        public string Title => IsEditMode ? "Felhasználó szerkesztése" : "Új felhasználó";

        private string _username;
        public string Username
        {
            get => _username;
            set { _username = value; OnPropertyChanged(); }
        }

        private string _email;
        public string Email
        {
            get => _email;
            set { _email = value; OnPropertyChanged(); }
        }

        private string _password;
        public string Password
        {
            get => _password;
            set { _password = value; OnPropertyChanged(); }
        }

        private bool _isAdmin;
        public bool IsAdmin
        {
            get => _isAdmin;
            set { _isAdmin = value; OnPropertyChanged(); }
        }

        public bool Confirmed { get; private set; } = false;

        public RelayCommand SaveCommand { get; }
        public RelayCommand CancelCommand { get; }

        private readonly Window _window;

        public UserFormViewModel(Window window, User editUser = null)
        {
            _window = window;
            IsEditMode = editUser != null;

            if (IsEditMode)
            {
                Username = editUser.username;
                Email = editUser.email;
                IsAdmin = editUser.isAdmin;
            }

            SaveCommand = new RelayCommand(_ => Save());
            CancelCommand = new RelayCommand(_ => _window.Close());
        }

        private void Save()
        {
            if (string.IsNullOrWhiteSpace(Username))
            {
                MessageBox.Show("A felhasználónév megadása kötelező!", "Hiányzó adat",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (string.IsNullOrWhiteSpace(Email))
            {
                MessageBox.Show("Az email cím megadása kötelező!", "Hiányzó adat",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!IsEditMode && string.IsNullOrWhiteSpace(Password))
            {
                MessageBox.Show("A jelszó megadása kötelező új felhasználónál!", "Hiányzó adat",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            Confirmed = true;
            _window.Close();
        }
    }
}
