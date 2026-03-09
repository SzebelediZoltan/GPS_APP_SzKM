using gpass_app_wpf.Helpers;
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

        // ── Klán neve/leírás szerkesztés ──────────────────────────────────────
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
        public bool NameSaveIsError   => _nameSaveResult?.StartsWith("⚠") == true;

        // ── Tagok ──────────────────────────────────────────────────────────────
        public ObservableCollection<ClanMemberDetail> Members { get; } = new();

        private ClanMemberDetail _selectedMember;
        public ClanMemberDetail SelectedMember
        {
            get => _selectedMember;
            set { _selectedMember = value; OnPropertyChanged(); }
        }

        // ── Globális hiba ──────────────────────────────────────────────────────
        private string _errorMessage;
        public string ErrorMessage
        {
            get => _errorMessage;
            set { _errorMessage = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasError)); }
        }
        public bool HasError => !string.IsNullOrEmpty(_errorMessage);

        public RelayCommand SaveNameCommand     { get; }
        public RelayCommand DismissErrorCommand { get; }
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

            DismissErrorCommand  = new RelayCommand(_ => ErrorMessage = null);
            SaveNameCommand      = new RelayCommand(async _ => await SaveName(),      _ => !NameSaving && !HasClanNameError && !HasClanDescriptionError);
            RemoveMemberCommand  = new RelayCommand(async _ => await RemoveMember(),  _ => SelectedMember != null && !SelectedMember.is_leader);
            ChangeLeaderCommand  = new RelayCommand(async _ => await ChangeLeader(),  _ => SelectedMember != null && !SelectedMember.is_leader);
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
        // A backend NEM engedi hogy a leader clan_member legyen,
        // ezért a leadert manuálisan adjuk hozzá a listához az API-tól kapott tagok elé.
        public async Task LoadMembers()
        {
            Loading = true;
            try
            {
                // Csak az igazi tagok (leader nélkül)
                var memberships = await _api.GetAsync<List<ClanMember>>($"clan-members/by-clan/{_clan.id}");

                // Felhasználói adatok betöltése
                var users = new Dictionary<int, User>();
                try
                {
                    var userList = await _api.GetAsync<List<User>>("users");
                    foreach (var u in userList) users[u.ID] = u;
                }
                catch { }

                var details = new List<ClanMemberDetail>();

                // Leader mindig az első, manuálisan hozzáadva
                var leaderDetail = new ClanMemberDetail
                {
                    clan_id   = _clan.id,
                    user_id   = _clan.leader_id,
                    joined_at = _clan.created_at,
                    leader_id = _clan.leader_id
                };
                if (users.TryGetValue(_clan.leader_id, out var leaderUser))
                    leaderDetail.user = new ClanMemberUserInfo { ID = leaderUser.ID, username = leaderUser.username, email = leaderUser.email };
                else
                    leaderDetail.user = new ClanMemberUserInfo { ID = _clan.leader_id, username = _clan.leader_name, email = "" };
                details.Add(leaderDetail);

                // Többi tag
                foreach (var m in memberships)
                {
                    if (m.user_id == _clan.leader_id) continue; // ne duplikáljuk
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
                Application.Current.Dispatcher.Invoke(() =>
                    ErrorMessage = $"Hiba a tagok betöltésekor: {ex.Message}");
            }
            Loading = false;
        }

        // ── Vezető váltás ──────────────────────────────────────────────────────
        // 1. Régi leader → tag lesz (addMember)
        // 2. Új leader → ki kell venni a tagok közül (removeMember)
        // 3. PUT /clans/{id} { leader_id: newLeader.user_id }
        private async Task ChangeLeader()
        {
            if (SelectedMember == null || SelectedMember.is_leader) return;

            var newLeader = SelectedMember;
            var oldLeaderId = _clan.leader_id;

            if (!WindowHelper.ShowConfirm(
                $"Biztosan átadod a vezető szerepét {newLeader.display_name}-nak?",
                "Vezető váltás", yesText: "Átadom", icon: "👑")) return;

            try
            {
                // 1. Új leader kivesszük a tagok közül (még mielőtt leader lenne)
                try
                {
                    await _api.DeleteAsync($"clan-members/{_clan.id}/{newLeader.user_id}");
                }
                catch { /* ha nincs a tagok közt, nem baj */ }

                // 2. Klán frissítése: új leader (most már nem a régi a leader)
                await _api.PatchAsync<object>($"clans/{_clan.id}/leader", new { leader_id = newLeader.user_id });

                // 3. Régi leader bekerül tagnak (most már nem leader, a backend engedi)
                try
                {
                    await _api.PostAsync<object>("clan-members", new { clan_id = _clan.id, user_id = oldLeaderId });
                }
                catch { /* ha valamiért nem sikerül, nem kritikus */ }

                // Helyi állapot frissítése
                _clan.leader_id = newLeader.user_id;
                _clan.leader = new ClanLeaderInfo { username = newLeader.display_name };
                ClanInfo = $"ID: {_clan.id}  •  Vezető: {newLeader.display_name}";

                await LoadMembers();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a vezető váltáskor: {ex.Message}";
            }
        }

        // ── Tag keresés debounce ───────────────────────────────────────────────
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

        // ── Tag hozzáadás ──────────────────────────────────────────────────────
        private async Task AddMember()
        {
            if (UserToAdd == null) return;

            if (UserToAdd.ID == _clan.leader_id)
            {
                ErrorMessage = "A klán vezetője már automatikusan szerepel a listában.";
                return;
            }

            bool alreadyMember = Members.Any(m => m.user_id == UserToAdd.ID);
            if (alreadyMember)
            {
                ErrorMessage = $"{UserToAdd.username} már tagja a klánnak.";
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
                ErrorMessage = $"Hiba a tag hozzáadásakor: {ex.Message}";
            }
        }

        // ── Tag eltávolítás ────────────────────────────────────────────────────
        private async Task RemoveMember()
        {
            if (SelectedMember == null) return;

            if (SelectedMember.is_leader)
            {
                ErrorMessage = "A klán vezetőjét nem lehet eltávolítani. Először adj meg új vezetőt.";
                return;
            }

            if (!WindowHelper.ShowConfirm(
                $"Biztosan eltávolítod {SelectedMember.display_name}-t a klánból?",
                "Tag eltávolítása", isDanger: true)) return;

            try
            {
                await _api.DeleteAsync($"clan-members/{_clan.id}/{SelectedMember.user_id}");
                await LoadMembers();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba az eltávolításkor: {ex.Message}";
            }
        }
    }
}
