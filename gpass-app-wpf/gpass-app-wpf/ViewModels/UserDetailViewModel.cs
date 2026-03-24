using gpass_app_wpf.Helpers;
using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace gpass_app_wpf.ViewModels
{
    public class UserDetailViewModel : BaseViewModel
    {
        private readonly ApiService _api;
        private readonly User _user;

        public string Title    => $"{_user.username} – részletek";
        public string UserInfo => $"#{_user.ID}  •  {_user.email}  •  {(_user.isAdmin ? "Admin" : "Felhasználó")}";

        public ObservableCollection<Marker>     Markers    { get; } = new();
        public ObservableCollection<FriendWith> Friends    { get; } = new();
        public ObservableCollection<ClanMember> Clans      { get; } = new();

        // Kijelölések szerkesztéshez
        private Marker     _selectedMarker;
        private FriendWith _selectedFriend;

        
        public Marker SelectedMarker
        {
            get => _selectedMarker;
            set
            {
                _selectedMarker = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(HasSelectedMarker));
                if (value != null)
                {
                    EditMarkerType  = value.marker_type;
                    EditMarkerScore = value.score.ToString();
                    MarkerEditError  = null;
                    MarkerEditResult = null;
                }
            }
        }
        public FriendWith SelectedFriend
        {
            get => _selectedFriend;
            set { _selectedFriend = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasSelectedFriend)); }
        }
        public bool HasSelectedFriend => _selectedFriend != null;

        // Parancsok

        public RelayCommand DismissErrorsCommand { get; }
        public RelayCommand DeleteMarkerCommand  { get; }
        public RelayCommand EditMarkerCommand    { get; }
        public RelayCommand ToggleFriendCommand  { get; }
        public RelayCommand DeleteFriendCommand  { get; }


        // ── Marker szerkesztés ────────────────────────────────────────────────
        private string _editMarkerType;
        public string EditMarkerType
        {
            get => _editMarkerType;
            set { _editMarkerType = value; OnPropertyChanged(); ValidateMarkerEdit(); }
        }

        private string _editMarkerScore;
        public string EditMarkerScore
        {
            get => _editMarkerScore;
            set { _editMarkerScore = value; OnPropertyChanged(); ValidateMarkerEdit(); }
        }

        private string _markerEditError;
        public string MarkerEditError
        {
            get => _markerEditError;
            set { _markerEditError = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasMarkerEditError)); }
        }
        public bool HasMarkerEditError => !string.IsNullOrEmpty(_markerEditError);

        private string _markerEditResult;
        public string MarkerEditResult
        {
            get => _markerEditResult;
            set { _markerEditResult = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasMarkerEditResult)); }
        }
        public bool HasMarkerEditResult => !string.IsNullOrEmpty(_markerEditResult);

        private bool _markerSaving;
        public bool MarkerSaving
        {
            get => _markerSaving;
            set { _markerSaving = value; OnPropertyChanged(); }
        }

        public bool HasSelectedMarker => _selectedMarker != null;

        private string _errors = "";
        public string Errors
        {
            get => _errors;
            set { _errors = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasErrors)); }
        }
        public bool HasErrors => !string.IsNullOrEmpty(_errors);
        public void ClearErrors() => Errors = null;

        private bool _loading;
        public bool Loading
        {
            get => _loading;
            set { _loading = value; OnPropertyChanged(); }
        }

        public UserDetailViewModel(User user)
        {
            _user = user;
            _api  = SessionService.Api;

            DismissErrorsCommand = new RelayCommand(_ => Errors = null);
            EditMarkerCommand   = new RelayCommand(async _ => await EditMarker(),   _ => SelectedMarker != null && !MarkerSaving && !HasMarkerEditError);
            DeleteMarkerCommand = new RelayCommand(async _ => await DeleteMarker(), _ => SelectedMarker != null);
            ToggleFriendCommand = new RelayCommand(async _ => await ToggleFriend(), _ => SelectedFriend != null);
            DeleteFriendCommand = new RelayCommand(async _ => await DeleteFriend(), _ => SelectedFriend != null);

            _ = LoadAll();
        }

        private async Task LoadAll()
        {
            Loading = true;
            Errors = null;
            await Task.WhenAll( LoadMarkers(), LoadFriends(), LoadClans());
            Loading = false;
        }

        private async Task LoadMarkers()
        {
            try
            {
                var list = await _api.GetAsync<List<Marker>>($"markers/creator/{_user.ID}");
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Markers.Clear();
                    foreach (var m in list) Markers.Add(m);
                });
            }
            catch (Exception ex) { AppendError("Markerek", ex.Message); }
        }

        private async Task LoadFriends()
        {
            try
            {
                var accepted = await _api.GetAsync<List<FriendWith>>($"friends-with/accepted/{_user.ID}");
                foreach (var f in accepted) f.status = "accepted";

                var pending = await _api.GetAsync<List<FriendWith>>($"friends-with/pending/{_user.ID}");
                foreach (var f in pending) f.status = "sent";

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Friends.Clear();
                    foreach (var f in accepted) Friends.Add(f);
                    foreach (var f in pending)  Friends.Add(f);
                });
            }
            catch (Exception ex) { AppendError("Barátok", ex.Message); }
        }

        private async Task LoadClans()
        {
            try
            {
                // Az összes klán neve - ebből keressük ki a neveket clan_id alapján
                var allClans = await _api.GetAsync<List<ClanWithMembers>>("clans");
                var clanMap = allClans.ToDictionary(c => c.id, c => c.name);

                var result = new List<ClanMember>();

                // Tagságok (ahol tag a user)
                var memberships = await _api.GetAsync<List<ClanMember>>($"clan-members/by-user/{_user.ID}");
                foreach (var m in memberships)
                {
                    m.clan_name = clanMap.TryGetValue(m.clan_id, out var n) ? n : $"#{m.clan_id}";
                    result.Add(m);
                }

                // Leader klánok (ahol vezető, de nem szerepel clan_members-ben)
                foreach (var c in allClans)
                {
                    if (c.leader_id == _user.ID && !result.Any(m => m.clan_id == c.id))
                    {
                        result.Add(new ClanMember
                        {
                            clan_id   = c.id,
                            user_id   = _user.ID,
                            joined_at = c.created_at,
                            clan_name = c.name
                        });
                    }
                }

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Clans.Clear();
                    foreach (var c in result) Clans.Add(c);
                });
            }
            catch (Exception ex) { AppendError("Clánok", ex.Message); }
        }



        // ── MARKER VALIDATE ──────────────────────────────────────────────────
        public static readonly string[] AllowedMarkerTypes =
        {
            "danger", "police", "accident", "traffic", "roadblock", "speedtrap", "other"
        };

        private void ValidateMarkerEdit()
        {
            if (string.IsNullOrWhiteSpace(EditMarkerType))
                MarkerEditError = "A típus kiválasztása kötelező!";
            else if (!AllowedMarkerTypes.Contains(EditMarkerType))
                MarkerEditError = "Érvénytelen marker típus!";
            else if (!int.TryParse(EditMarkerScore, out int s) || s < 0)
                MarkerEditError = "A pont értéke nem negatív \negész szám kell legyen!";
            else
                MarkerEditError = null;
        }

        // ── MARKER EDIT ───────────────────────────────────────────────────────
        private async Task EditMarker()
        {
            if (SelectedMarker == null) return;
            if (!int.TryParse(EditMarkerScore, out int score)) return;

            MarkerSaving     = true;
            MarkerEditResult = null;
            try
            {
                await _api.PutAsync<Marker>($"markers/{SelectedMarker.id}", new
                {
                    marker_type = EditMarkerType.Trim(),
                    score       = score
                });

                SelectedMarker.marker_type = EditMarkerType.Trim();
                SelectedMarker.score       = score;
                MarkerEditResult = "✔ Sikeresen mentve!";
                await LoadMarkers();
            }
            catch (Exception ex)
            {
                MarkerEditResult = $"⚠ {ex.Message}";
            }
            finally { MarkerSaving = false; }
        }

        // ── MARKER DELETE ─────────────────────────────────────────────────────
        private async Task DeleteMarker()
        {
            if (SelectedMarker == null) return;
            if (!WindowHelper.ShowConfirm(
                $"Biztosan törlöd a markert?\n#{SelectedMarker.id} – {SelectedMarker.marker_type}",
                "Marker törlése", isDanger: true)) return;
            try
            {
                await _api.DeleteAsync($"markers/{SelectedMarker.id}");
                await LoadMarkers();
            }
            catch (Exception ex) { AppendError("Marker törlés", ex.Message); }
        }

        // ── FRIEND TOGGLE (sent <-> accepted) ────────────────────────────────
        private async Task ToggleFriend()
        {
            if (SelectedFriend == null) return;
            var newStatus = SelectedFriend.status == "accepted" ? "sent" : "accepted";
            try
            {
                await _api.PutAsync<FriendWith>($"friends-with/{SelectedFriend.id}", new { status = newStatus });
                await LoadFriends();
            }
            catch (Exception ex) { AppendError("Barát státusz", ex.Message); }
        }

        // ── FRIEND DELETE ─────────────────────────────────────────────────────
        private async Task DeleteFriend()
        {
            if (SelectedFriend == null) return;
            if (!WindowHelper.ShowConfirm(
                $"Biztosan törlöd a barát kapcsolatot? (#{SelectedFriend.id})",
                "Barát törlése", isDanger: true)) return;
            try
            {
                await _api.DeleteAsync($"friends-with/{SelectedFriend.id}");
                await LoadFriends();
            }
            catch (Exception ex) { AppendError("Barát törlés", ex.Message); }
        }

        private void AppendError(string section, string msg)
        {
            Application.Current.Dispatcher.Invoke(() => Errors = (Errors ?? "") + $"[{section}]: {msg}\n");
        }
    }
}
