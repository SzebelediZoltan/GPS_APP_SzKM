using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class UserFormViewModel : BaseViewModel
    {
        private readonly ApiService _api;
        private readonly User _editUser;
        private readonly Window _window;

        public bool IsEditMode => _editUser != null;
        public string Title    => IsEditMode ? "Felhasználó szerkesztése" : "Új felhasználó";

        public bool Confirmed { get; private set; } = false;

        // ── Mezők ──────────────────────────────────────────────────────────────
        private string _username;
        public string Username
        {
            get => _username;
            set { _username = value; OnPropertyChanged(); ValidateUsername(); ClearGeneralError(); }
        }

        private string _email;
        public string Email
        {
            get => _email;
            set { _email = value; OnPropertyChanged(); ValidateEmail(); ClearGeneralError(); }
        }

        private string _password;
        public string Password
        {
            get => _password;
            set { _password = value; OnPropertyChanged(); ValidatePassword(); ClearGeneralError(); }
        }

        private bool _isAdmin;
        public bool IsAdmin
        {
            get => _isAdmin;
            set { _isAdmin = value; OnPropertyChanged(); }
        }

        // ── Mezőnkénti hibaüzenetek ────────────────────────────────────────────
        private string _usernameError;
        public string UsernameError
        {
            get => _usernameError;
            set { _usernameError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasUsernameError)); }
        }
        public bool HasUsernameError => !string.IsNullOrEmpty(_usernameError);

        private string _emailError;
        public string EmailError
        {
            get => _emailError;
            set { _emailError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasEmailError)); }
        }
        public bool HasEmailError => !string.IsNullOrEmpty(_emailError);

        private string _passwordError;
        public string PasswordError
        {
            get => _passwordError;
            set { _passwordError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasPasswordError)); }
        }
        public bool HasPasswordError => !string.IsNullOrEmpty(_passwordError);

        // ── Általános hibaüzenet (backend hiba) ────────────────────────────────
        private string _errorMessage;
        public string ErrorMessage
        {
            get => _errorMessage;
            set { _errorMessage = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasError)); }
        }
        public bool HasError => !string.IsNullOrEmpty(_errorMessage);

        // ── Betöltés jelző ─────────────────────────────────────────────────────
        private bool _saving;
        public bool Saving
        {
            get => _saving;
            set { _saving = value; OnPropertyChanged(); }
        }

        // ── Parancsok ──────────────────────────────────────────────────────────
        public RelayCommand SaveCommand   { get; }
        public RelayCommand CancelCommand { get; }

        private static readonly Regex EmailRegex = new Regex(
            @"^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$",
            RegexOptions.Compiled);

        public UserFormViewModel(Window window, User editUser = null)
        {
            _window   = window;
            _editUser = editUser;
            _api      = SessionService.Api;

            if (IsEditMode)
            {
                Username = editUser.username;
                Email    = editUser.email;
                IsAdmin  = editUser.isAdmin;
            }

            SaveCommand   = new RelayCommand(async _ => await Save(), _ => !Saving);
            CancelCommand = new RelayCommand(_ => _window.Close(), _ => !Saving);
        }

        private void ClearGeneralError() => ErrorMessage = null;

        // ── Egyedi mező validációk (valós időben) ──────────────────────────────
        private void ValidateUsername()
        {
            if (string.IsNullOrWhiteSpace(Username))
                UsernameError = "A felhasználónév megadása kötelező!";
            else
                UsernameError = null;
        }

        private void ValidateEmail()
        {
            if (string.IsNullOrWhiteSpace(Email))
            {
                EmailError = "Az email cím megadása kötelező!";
                return;
            }

            if (!EmailRegex.IsMatch(Email))
            {
                EmailError = "Érvénytelen email formátum! (pl.: pelda@domain.hu)";
                return;
            }

            EmailError = null;
        }

        private void ValidatePassword()
        {
            if (!IsEditMode && string.IsNullOrWhiteSpace(Password))
                PasswordError = "A jelszó megadása kötelező új felhasználónál!";
            else
                PasswordError = null;
        }

        private bool Validate()
        {
            ValidateUsername();
            ValidateEmail();
            ValidatePassword();

            return !HasUsernameError && !HasEmailError && !HasPasswordError;
        }

        private async System.Threading.Tasks.Task Save()
        {
            if (!Validate()) return;

            Saving = true;
            ErrorMessage = null;

            try
            {
                if (!IsEditMode)
                {
                    await _api.PostAsync<User>("users", new CreateUserRequest
                    {
                        username = Username,
                        email    = Email,
                        password = Password,
                        isAdmin  = IsAdmin
                    });
                }
                else
                {
                    var payload = new Dictionary<string, object>
                    {
                        ["username"] = Username,
                        ["email"]    = Email,
                        ["isAdmin"]  = IsAdmin
                    };
                    if (!string.IsNullOrWhiteSpace(Password))
                        payload["password"] = Password;

                    await _api.PutAsync<User>($"users/{_editUser.ID}", payload);
                }

                Confirmed = true;
                _window.Close();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
            finally
            {
                Saving = false;
            }
        }
    }
}
