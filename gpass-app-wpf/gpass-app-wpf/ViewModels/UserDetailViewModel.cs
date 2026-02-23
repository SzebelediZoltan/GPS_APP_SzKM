using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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

        public ObservableCollection<Trip>       Trips      { get; } = new();
        public ObservableCollection<Marker>     Markers    { get; } = new();
        public ObservableCollection<FriendWith> Friends    { get; } = new();
        public ObservableCollection<ClanMember> Clans      { get; } = new();
        public ObservableCollection<TripPoint>  TripPoints { get; } = new();

        // Kijelölések szerkesztéshez
        private Trip       _selectedTrip;
        private Marker     _selectedMarker;
        private FriendWith _selectedFriend;

        public Trip SelectedTrip
        {
            get => _selectedTrip;
            set { _selectedTrip = value; OnPropertyChanged(); }
        }
        public Marker SelectedMarker
        {
            get => _selectedMarker;
            set { _selectedMarker = value; OnPropertyChanged(); }
        }
        public FriendWith SelectedFriend
        {
            get => _selectedFriend;
            set { _selectedFriend = value; OnPropertyChanged(); }
        }

        // Parancsok
        public RelayCommand DeleteTripCommand    { get; }
        public RelayCommand DeleteMarkerCommand  { get; }
        public RelayCommand ToggleFriendCommand  { get; }
        public RelayCommand DeleteFriendCommand  { get; }

        private string _errors = "";
        public string Errors
        {
            get => _errors;
            set { _errors = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasErrors)); }
        }
        public bool HasErrors => !string.IsNullOrEmpty(_errors);

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

            DeleteTripCommand   = new RelayCommand(async _ => await DeleteTrip(),   _ => SelectedTrip   != null);
            DeleteMarkerCommand = new RelayCommand(async _ => await DeleteMarker(), _ => SelectedMarker != null);
            ToggleFriendCommand = new RelayCommand(async _ => await ToggleFriend(), _ => SelectedFriend != null);
            DeleteFriendCommand = new RelayCommand(async _ => await DeleteFriend(), _ => SelectedFriend != null);

            _ = LoadAll();
        }

        private async Task LoadAll()
        {
            Loading = true;
            Errors = "";
            await Task.WhenAll(LoadTrips(), LoadMarkers(), LoadFriends(), LoadClans());
            await LoadTripPoints();
            Loading = false;
        }

        private async Task LoadTrips()
        {
            try
            {
                var list = await _api.GetAsync<List<Trip>>($"trips/by-user/{_user.ID}");
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Trips.Clear();
                    foreach (var t in list) Trips.Add(t);
                });
            }
            catch (Exception ex) { AppendError("Tripek", ex.Message); }
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
                var memberships = await _api.GetAsync<List<ClanMember>>($"clan-members/by-user/{_user.ID}");

                foreach (var m in memberships)
                    m.clan_name = m.clan?.name ?? $"#{m.clan_id}";

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Clans.Clear();
                    foreach (var c in memberships) Clans.Add(c);
                });
            }
            catch (Exception ex) { AppendError("Clánok", ex.Message); }
        }

        private async Task LoadTripPoints()
        {
            try
            {
                var allPoints = new List<TripPoint>();
                foreach (var trip in Trips)
                {
                    var points = await _api.GetAsync<List<TripPoint>>($"trip-points/by-trip/{trip.id}");
                    allPoints.AddRange(points);
                }
                Application.Current.Dispatcher.Invoke(() =>
                {
                    TripPoints.Clear();
                    foreach (var p in allPoints) TripPoints.Add(p);
                });
            }
            catch (Exception ex) { AppendError("Trip pontok", ex.Message); }
        }

        // ── TRIP DELETE ───────────────────────────────────────────────────────
        private async Task DeleteTrip()
        {
            if (SelectedTrip == null) return;
            var r = MessageBox.Show($"Biztosan törlöd a Trip #{SelectedTrip.trip_number} tripet?",
                "Törlés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;
            try
            {
                await _api.DeleteAsync($"trips/{SelectedTrip.id}");
                await LoadTrips();
                await LoadTripPoints();
            }
            catch (Exception ex) { MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error); }
        }

        // ── MARKER DELETE ─────────────────────────────────────────────────────
        private async Task DeleteMarker()
        {
            if (SelectedMarker == null) return;
            var r = MessageBox.Show($"Biztosan törlöd a markert? (#{SelectedMarker.id} – {SelectedMarker.marker_type})",
                "Törlés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;
            try
            {
                await _api.DeleteAsync($"markers/{SelectedMarker.id}");
                await LoadMarkers();
            }
            catch (Exception ex) { MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error); }
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
            catch (Exception ex) { MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error); }
        }

        // ── FRIEND DELETE ─────────────────────────────────────────────────────
        private async Task DeleteFriend()
        {
            if (SelectedFriend == null) return;
            var r = MessageBox.Show($"Biztosan törlöd a barát kapcsolatot? (#{SelectedFriend.id})",
                "Törlés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;
            try
            {
                await _api.DeleteAsync($"friends-with/{SelectedFriend.id}");
                await LoadFriends();
            }
            catch (Exception ex) { MessageBox.Show(ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error); }
        }

        private void AppendError(string section, string msg)
        {
            Application.Current.Dispatcher.Invoke(() => Errors += $"[{section}]: {msg}\n");
        }
    }
}
