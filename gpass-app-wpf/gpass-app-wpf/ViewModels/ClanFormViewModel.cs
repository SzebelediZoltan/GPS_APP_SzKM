using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class ClanFormViewModel : BaseViewModel
    {
        private readonly ApiService _api;
        private readonly Window _window;

        public bool Confirmed { get; private set; } = false;

        // ── Klán neve ──────────────────────────────────────────────────────────
        private string _name;
        public string Name
        {
            get => _name;
            set { _name = value; OnPropertyChanged(); ValidateName(); ClearGeneralError(); }
        }

        private string _nameError;
        public string NameError
        {
            get => _nameError;
            set { _nameError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasNameError)); }
        }
        public bool HasNameError => !string.IsNullOrEmpty(_nameError);

        // ── Vezető keresés ─────────────────────────────────────────────────────
        private string _leaderSearch = "";
        public string LeaderSearch
        {
            get => _leaderSearch;
            set { _leaderSearch = value; OnPropertyChanged(); DebounceSearch(); }
        }

        public ObservableCollection<User> SearchResults { get; } = new();

        private bool _searching;
        public bool Searching
        {
            get => _searching;
            set { _searching = value; OnPropertyChanged(); }
        }

        private User _selectedLeader;
        public User SelectedLeader
        {
            get => _selectedLeader;
            set
            {
                _selectedLeader = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(LeaderDisplayText));
                OnPropertyChanged(nameof(HasSelectedLeader));
                ValidateLeader();
                ClearGeneralError();
            }
        }

        public bool HasSelectedLeader => _selectedLeader != null;
        public string LeaderDisplayText => _selectedLeader != null
            ? $"{_selectedLeader.username}  ({_selectedLeader.email})"
            : "";

        private string _leaderError;
        public string LeaderError
        {
            get => _leaderError;
            set { _leaderError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasLeaderError)); }
        }
        public bool HasLeaderError => !string.IsNullOrEmpty(_leaderError);

        // ── Backend hiba ───────────────────────────────────────────────────────
        private string _errorMessage;
        public string ErrorMessage
        {
            get => _errorMessage;
            set { _errorMessage = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasError)); }
        }
        public bool HasError => !string.IsNullOrEmpty(_errorMessage);

        private bool _saving;
        public bool Saving
        {
            get => _saving;
            set { _saving = value; OnPropertyChanged(); }
        }

        // ── Parancsok ──────────────────────────────────────────────────────────
        public RelayCommand SelectLeaderCommand { get; }
        public RelayCommand SaveCommand         { get; }
        public RelayCommand CancelCommand       { get; }

        private CancellationTokenSource _searchCts;

        public ClanFormViewModel(Window window)
        {
            _window = window;
            _api    = SessionService.Api;

            SelectLeaderCommand = new RelayCommand(u => { SelectedLeader = u as User; SearchResults.Clear(); _leaderSearch = ""; OnPropertyChanged(nameof(LeaderSearch)); });
            SaveCommand         = new RelayCommand(async _ => await Save(), _ => !Saving);
            CancelCommand       = new RelayCommand(_ => _window.Close(),    _ => !Saving);
        }

        private void ClearGeneralError() => ErrorMessage = null;

        private void ValidateName()
        {
            if (string.IsNullOrWhiteSpace(Name))
                NameError = "A klán neve kötelező!";
            else if (Name.Trim().Length < 3)
                NameError = "A klán neve legalább 3 karakter legyen!";
            else if (Name.Trim().Length > 40)
                NameError = "A klán neve legfeljebb 40 karakter lehet!";
            else
                NameError = null;
        }

        private void ValidateLeader()
        {
            LeaderError = SelectedLeader == null ? "A vezető kiválasztása kötelező!" : null;
        }

        private bool Validate()
        {
            ValidateName();
            ValidateLeader();
            return !HasNameError && !HasLeaderError;
        }

        // ── Debounced search ───────────────────────────────────────────────────
        private async void DebounceSearch()
        {
            _searchCts?.Cancel();
            _searchCts = new CancellationTokenSource();
            var token = _searchCts.Token;

            SearchResults.Clear();

            if (string.IsNullOrWhiteSpace(LeaderSearch)) return;

            SelectedLeader = null;

            try
            {
                await Task.Delay(300, token);
                if (!token.IsCancellationRequested)
                    await DoSearch(token);
            }
            catch (TaskCanceledException) { }
        }

        private async Task DoSearch(CancellationToken token)
        {
            Searching = true;
            try
            {
                var results = await _api.GetAsync<List<User>>(
                    $"users/search?query={Uri.EscapeDataString(LeaderSearch.Trim())}");

                if (!token.IsCancellationRequested)
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        SearchResults.Clear();
                        if (results != null)
                            foreach (var u in results) SearchResults.Add(u);
                    });
            }
            catch (Exception ex)
            {
                if (!token.IsCancellationRequested)
                    ErrorMessage = $"Keresési hiba: {ex.Message}";
            }
            finally { Searching = false; }
        }

        // ── Mentés ─────────────────────────────────────────────────────────────
        private async Task Save()
        {
            if (!Validate()) return;

            Saving = true;
            ErrorMessage = null;
            try
            {
                await _api.PostAsync<object>("clans", new
                {
                    name      = Name.Trim(),
                    leader_id = SelectedLeader.ID
                });
                Confirmed = true;
                _window.Close();
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }
            finally { Saving = false; }
        }
    }
}
