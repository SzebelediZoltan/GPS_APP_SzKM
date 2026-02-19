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
            _ = LoadAll();
        }

        private async Task LoadAll()
        {
            Loading = true;
            await Task.WhenAll(LoadTrips(), LoadMarkers(), LoadFriends(), LoadClans());
            // TripPoints a tripek után töltődnek (trip ID-k kellenek)
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
                var list = await _api.GetAsync<List<FriendWith>>($"friends-with/accepted/{_user.ID}");
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Friends.Clear();
                    foreach (var f in list) Friends.Add(f);
                });
            }
            catch (Exception ex) { AppendError("Barátok", ex.Message); }
        }

        private async Task LoadClans()
        {
            try
            {
                var list = await _api.GetAsync<List<ClanMember>>($"clan-members/by-user/{_user.ID}");
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Clans.Clear();
                    foreach (var c in list) Clans.Add(c);
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

        private void AppendError(string section, string msg)
        {
            Application.Current.Dispatcher.Invoke(() =>
            {
                Errors += $"[{section}]: {msg}\n";
            });
        }
    }
}
