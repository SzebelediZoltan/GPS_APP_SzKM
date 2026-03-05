using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class ClanMembersViewModel : BaseViewModel
    {
        private readonly ApiService _api;
        private readonly ClanWithMembers _clan;

        public string Title => $"🛡 {_clan.name} – szerkesztés";

        private string _clanInfo;
        public string ClanInfo
        {
            get => _clanInfo;
            set { _clanInfo = value; OnPropertyChanged(); }
        }

        // ── Klán neve szerkesztés ──────────────────────────────────────────────
        private string _clanName;
        public string ClanName
        {
            get => _clanName;
            set { _clanName = value; OnPropertyChanged(); ValidateClanName(); }
        }

        private string _clanDescription;
        public string ClanDescription
        {
            get => _clanDescription;
            set { _clanDescription = value; OnPropertyChanged(); ValidateClanDescription(); }
        }

        private string _clanDescriptionError;
        public string ClanDescriptionError
        {
            get => _clanDescriptionError;
            set { _clanDescriptionError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasClanDescriptionError)); }
        }
        public bool HasClanDescriptionError => !string.IsNullOrEmpty(_clanDescriptionError);

        private string _clanNameError;
        public string ClanNameError
        {
            get => _clanNameError;
            set { _clanNameError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasClanNameError)); }
        }
        public bool HasClanNameError => !string.IsNullOrEmpty(_clanNameError);

        private bool _nameSaving;
        public bool NameSaving
        {
            get => _nameSaving;
            set { _nameSaving = value; OnPropertyChanged(); }
        }

        private string _nameSaveResult;
        public string NameSaveResult
        {
            get => _nameSaveResult;
            set { _nameSaveResult = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasNameSaveResult)); }
        }
        public bool HasNameSaveResult => !string.IsNullOrEmpty(_nameSaveResult);

        // ── Tagok ──────────────────────────────────────────────────────────────
        public ObservableCollection<ClanMemberDetail> Members { get; } = new();

        private ClanMemberDetail _selectedMember;
        public ClanMemberDetail SelectedMember
        {
            get => _selectedMember;
            set { _selectedMember = value; OnPropertyChanged(); }
        }

        public RelayCommand SaveNameCommand     { get; }
        public RelayCommand RemoveMemberCommand { get; }
        public RelayCommand ChangeLeaderCommand { get; }
        public RelayCommand AddMemberCommand    { get; }
        public RelayCommand SelectAddUserCommand { get; }

        // ── Tag hozzáadás keresés ──────────────────────────────────────────────
        private string _addSearch = "";
        public string AddSearch
        {
            get => _addSearch;
            set { _addSearch = value; OnPropertyChanged(); DebounceAddSearch(); }
        }

        public ObservableCollection<User> AddSearchResults { get; } = new();

        private bool _addSearching;
        public bool AddSearching
        {
            get => _addSearching;
            set { _addSearching = value; OnPropertyChanged(); }
        }

        private User _userToAdd;
        public User UserToAdd
        {
            get => _userToAdd;
            set
            {
                _userToAdd = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(HasUserToAdd));
                OnPropertyChanged(nameof(UserToAddText));
            }
        }

        public bool HasUserToAdd => _userToAdd != null;
        public string UserToAddText => _userToAdd != null
            ? $"{_userToAdd.username}  ({_userToAdd.email})"
            : "";

        private CancellationTokenSource _addSearchCts;

        private bool _loading;
        public bool Loading { get => _loading; set { _loading = value; OnPropertyChanged(); } }

        public ClanMembersViewModel(ClanWithMembers clan)
        {
            _clan    = clan;
            _api     = SessionService.Api;
            ClanName        = clan.name;
            ClanDescription = clan.description;
            ClanInfo = $"ID: {_clan.id}  •  Vezető: {_clan.leader_name}";

            SaveNameCommand      = new RelayCommand(async _ => await SaveName(),      _ => !NameSaving && !HasClanNameError && !HasClanDescriptionError);
            RemoveMemberCommand  = new RelayCommand(async _ => await RemoveMember(),  _ => SelectedMember != null);
            ChangeLeaderCommand  = new RelayCommand(async _ => await ChangeLeader(),  _ => SelectedMember != null && SelectedMember.user_id != _clan.leader_id);
            AddMemberCommand     = new RelayCommand(async _ => await AddMember(),     _ => HasUserToAdd);
            SelectAddUserCommand = new RelayCommand(u => { UserToAdd = u as User; AddSearchResults.Clear(); _addSearch = ""; OnPropertyChanged(nameof(AddSearch)); });

            _ = LoadMembers();
        }

        // ── Validáció ──────────────────────────────────────────────────────────
        private void ValidateClanDescription()
        {
            if (ClanDescription != null && ClanDescription.Length > 200)
                ClanDescriptionError = "A leírás legfeljebb 200 karakter lehet!";
            else
                ClanDescriptionError = null;
        }

        private void ValidateClanName()
        {
            if (string.IsNullOrWhiteSpace(ClanName))
                ClanNameError = "A klán neve nem lehet üres!";
            else if (ClanName.Trim().Length < 3)
                ClanNameError = "Legalább 3 karakter szükséges!";
            else if (ClanName.Trim().Length > 40)
                ClanNameError = "Legfeljebb 40 karakter lehet!";
            else
                ClanNameError = null;
        }

        // ── Név mentése ────────────────────────────────────────────────────────
        private async Task SaveName()
        {
            if (HasClanNameError || HasClanDescriptionError) return;

            bool nameChanged = ClanName.Trim() != _clan.name;
            bool descChanged = (ClanDescription?.Trim() ?? "") != (_clan.description ?? "");

            if (!nameChanged && !descChanged)
            {
                NameSaveResult = "ℹ Nem történt változás.";
                return;
            }

            NameSaving = true;
            NameSaveResult = null;
            try
            {
                await _api.PutAsync<object>($"clans/{_clan.id}", new
                {
                    name        = ClanName.Trim(),
                    description = string.IsNullOrWhiteSpace(ClanDescription) ? null : ClanDescription.Trim()
                });
                _clan.name        = ClanName.Trim();
                _clan.description = ClanDescription?.Trim();
                OnPropertyChanged(nameof(Title));
                ClanInfo = $"ID: {_clan.id}  •  Vezető: {_clan.leader_name}";
                NameSaveResult = "✔ Név sikeresen mentve!";
            }
            catch (Exception ex)
            {
                NameSaveResult = $"⚠ {ex.Message}";
            }
            finally { NameSaving = false; }
        }

        // ── Tagok betöltése ────────────────────────────────────────────────────
        public async Task LoadMembers()
        {
            Loading = true;
            try
            {
                var memberships = await _api.GetAsync<List<ClanMember>>($"clan-members/by-clan/{_clan.id}");

                // Ha a vezető nincs a tagok közt, adjuk hozzá automatikusan
                bool leaderIsMember = memberships.Any(m => m.user_id == _clan.leader_id);
                if (!leaderIsMember)
                {
                    try
                    {
                        await _api.PostAsync<object>("clan-members", new { clan_id = _clan.id, user_id = _clan.leader_id });
                        memberships = await _api.GetAsync<List<ClanMember>>($"clan-members/by-clan/{_clan.id}");
                    }
                    catch { }
                }

                var users = new Dictionary<int, User>();
                try
                {
                    var userList = await _api.GetAsync<List<User>>("users");
                    foreach (var u in userList) users[u.ID] = u;
                }
                catch { }

                var details = new List<ClanMemberDetail>();
                foreach (var m in memberships)
                {
                    var detail = new ClanMemberDetail
                    {
                        clan_id   = m.clan_id,
                        user_id   = m.user_id,
                        joined_at = m.joined_at,
                        leader_id = _clan.leader_id
                    };
                    if (users.TryGetValue(m.user_id, out var u))
                        detail.user = new ClanMemberUserInfo { ID = u.ID, username = u.username, email = u.email };
                    details.Add(detail);
                }

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Members.Clear();
                    foreach (var d in details) Members.Add(d);
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a tagok betöltésekor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
            Loading = false;
        }

        // ── Vezető váltás ──────────────────────────────────────────────────────
        private async Task ChangeLeader()
        {
            if (SelectedMember == null || SelectedMember.user_id == _clan.leader_id) return;

            var newLeader = SelectedMember;
            var r = MessageBox.Show(
                $"Biztosan átadod a vezető szerepét {newLeader.display_name}-nak?",
                "Vezető váltás", MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (r != MessageBoxResult.Yes) return;

            try
            {
                await _api.PutAsync<object>($"clans/{_clan.id}", new { leader_id = newLeader.user_id });

                bool alreadyMember = Members.Any(m => m.user_id == newLeader.user_id);
                if (!alreadyMember)
                {
                    try { await _api.PostAsync<object>("clan-members", new { clan_id = _clan.id, user_id = newLeader.user_id }); }
                    catch { }
                }

                _clan.leader_id = newLeader.user_id;
                _clan.leader = new ClanLeaderInfo { username = newLeader.display_name };
                ClanInfo = $"ID: {_clan.id}  •  Vezető: {_clan.leader_name}";

                await LoadMembers();

                MessageBox.Show($"Az új vezető: {newLeader.display_name}", "Sikeres",
                    MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a vezető váltáskor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ── Tag eltávolítás ────────────────────────────────────────────────────
#pragma warning disable CS1998
        private async void DebounceAddSearch()
#pragma warning restore CS1998
        {
            _addSearchCts?.Cancel();
            _addSearchCts = new CancellationTokenSource();
            var token = _addSearchCts.Token;

            AddSearchResults.Clear();

            if (string.IsNullOrWhiteSpace(AddSearch)) return;

            UserToAdd = null;

            try
            {
                await Task.Delay(300, token);
                if (!token.IsCancellationRequested)
                    await DoAddSearch(token);
            }
            catch (TaskCanceledException) { }
        }

        private async Task DoAddSearch(CancellationToken token)
        {
            AddSearching = true;
            try
            {
                var results = await _api.GetAsync<List<User>>(
                    $"users/search?query={Uri.EscapeDataString(AddSearch.Trim())}");

                if (!token.IsCancellationRequested)
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        AddSearchResults.Clear();
                        if (results != null)
                            foreach (var u in results) AddSearchResults.Add(u);
                    });
            }
            catch { }
            finally { AddSearching = false; }
        }

        private async Task AddMember()
        {
            if (UserToAdd == null) return;

            bool alreadyMember = Members.Any(m => m.user_id == UserToAdd.ID);
            if (alreadyMember)
            {
                MessageBox.Show($"{UserToAdd.username} már tagja a klánnak.",
                    "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                await _api.PostAsync<object>("clan-members", new { clan_id = _clan.id, user_id = UserToAdd.ID });
                UserToAdd = null;
                AddSearch = "";
                await LoadMembers();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a tag hozzáadásakor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async Task RemoveMember()
        {
            if (SelectedMember == null) return;

            if (SelectedMember.user_id == _clan.leader_id)
            {
                MessageBox.Show("A klán vezetőjét nem lehet eltávolítani. Először adj meg új vezetőt.",
                    "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var r = MessageBox.Show(
                $"Biztosan eltávolítod {SelectedMember.display_name}-t a klánból?",
                "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;

            try
            {
                await _api.DeleteAsync($"clan-members/{_clan.id}/{SelectedMember.user_id}");
                await LoadMembers();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba az eltávolításkor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
