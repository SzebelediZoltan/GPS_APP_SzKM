using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.Views;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using gpass_app_wpf.Helpers;

namespace gpass_app_wpf.ViewModels
{
    public class ClanViewModel : BaseViewModel
    {
        private readonly ApiService _api;

        public ObservableCollection<ClanWithMembers> Clans { get; } = new();

        private ClanWithMembers _selectedClan;
        public ClanWithMembers SelectedClan
        {
            get => _selectedClan;
            set { _selectedClan = value; OnPropertyChanged(); }
        }

        private string _errorMessage;
        public string ErrorMessage
        {
            get => _errorMessage;
            set { _errorMessage = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasError)); }
        }
        public bool HasError => !string.IsNullOrEmpty(_errorMessage);

        // ── Klán keresés ──────────────────────────────────────────────────────
        private string _clanSearch = "";
        public string ClanSearch
        {
            get => _clanSearch;
            set { _clanSearch = value; OnPropertyChanged(); DenounceClanSearch(); }
        }

        private CancellationTokenSource _clanSearchCts;
#pragma warning disable CS1998
        private async void DenounceClanSearch()
#pragma warning restore CS1998
        {
            _clanSearchCts?.Cancel();
            _clanSearchCts = new CancellationTokenSource();
            var token = _clanSearchCts.Token;
            try
            {
                await Task.Delay(350, token);
                if (!token.IsCancellationRequested)
                    await LoadClans();
            }
            catch (TaskCanceledException) { }
        }

        public RelayCommand CreateClanCommand  { get; }
        public RelayCommand ViewMembersCommand { get; }
        public RelayCommand DeleteClanCommand  { get; }
        public RelayCommand DismissErrorCommand { get; }

        public ClanViewModel()
        {
            _api = SessionService.Api;

            CreateClanCommand  = new RelayCommand(async _ => await CreateClan());
            ViewMembersCommand = new RelayCommand(async _ => await ViewMembers(), _ => SelectedClan != null);
            DeleteClanCommand  = new RelayCommand(async _ => await DeleteClan(),   _ => SelectedClan != null);
            DismissErrorCommand = new RelayCommand(_ => ErrorMessage = null);

            _ = LoadClans();
        }

        public async Task LoadClans()
        {
            ErrorMessage = null;
            try
            {
                var endpoint = string.IsNullOrWhiteSpace(ClanSearch)
                    ? "clans"
                    : $"clans/search?query={Uri.EscapeDataString(ClanSearch.Trim())}";

                var list = await _api.GetAsync<List<ClanWithMembers>>(endpoint);

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Clans.Clear();
                    foreach (var c in list) Clans.Add(c);
                });
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a klánok betöltésekor: {ex.Message}";
            }
        }

        private async Task CreateClan()
        {
            var dialog = new ClanFormWindow();
            dialog.Owner = WindowHelper.GetActiveWindow();
            dialog.ShowDialog();

            if (dialog.VM.Confirmed)
                await LoadClans();
        }

        private async Task ViewMembers()
        {
            if (SelectedClan == null) return;

            var w = new ClanMembersWindow(SelectedClan);
            w.Owner = WindowHelper.GetActiveWindow();
            w.ShowDialog();

            await LoadClans();
        }

        private async Task DeleteClan()
        {
            if (SelectedClan == null) return;

            if (!WindowHelper.ShowConfirm(
                $"Biztosan törlöd a \"{SelectedClan.name}\" klánt?",
                "Klán törlése", isDanger: true)) return;

            try
            {
                await _api.DeleteAsync($"clans/{SelectedClan.id}");
                await LoadClans();
                SelectedClan = null;
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a törléskor: {ex.Message}";
            }
        }
    }
}
