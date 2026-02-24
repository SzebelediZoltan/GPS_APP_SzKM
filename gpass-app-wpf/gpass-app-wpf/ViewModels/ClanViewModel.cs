using gpass_app_wpf.DAL;
using gpass_app_wpf.Models;
using gpass_app_wpf.Views;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

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

        // ── Klán keresés ──────────────────────────────────────────────────────
        private string _clanSearch = "";
        public string ClanSearch
        {
            get => _clanSearch;
            set { _clanSearch = value; OnPropertyChanged(); DenounceClanSearch(); }
        }

        private CancellationTokenSource _clanSearchCts;
        private async void DenounceClanSearch()
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

        public RelayCommand CreateClanCommand   { get; }
        public RelayCommand ViewMembersCommand  { get; }
        public RelayCommand EditClanCommand     { get; }
        public RelayCommand DeleteClanCommand   { get; }

        public ClanViewModel()
        {
            _api = SessionService.Api;

            CreateClanCommand  = new RelayCommand(async _ => await CreateClan());
            ViewMembersCommand = new RelayCommand(async _ => await ViewMembers(), _ => SelectedClan != null);
            EditClanCommand    = new RelayCommand(async _ => await EditClan(),     _ => SelectedClan != null);
            DeleteClanCommand  = new RelayCommand(async _ => await DeleteClan(),   _ => SelectedClan != null);

            _ = LoadClans();
        }

        public async Task LoadClans()
        {
            try
            {
                var endpoint = string.IsNullOrWhiteSpace(ClanSearch)
                    ? "clans"
                    : $"clans/search?query={Uri.EscapeDataString(ClanSearch.Trim())}";

                var raw = await _api.GetRawAsync(endpoint);
                var list = new List<ClanWithMembers>();
                var doc = System.Text.Json.JsonDocument.Parse(raw);
                foreach (var elem in doc.RootElement.EnumerateArray())
                {
                    var c = new ClanWithMembers();
                    foreach (var p in elem.EnumerateObject())
                    {
                        if (p.Name.Equals("id", StringComparison.OrdinalIgnoreCase) && p.Value.ValueKind == System.Text.Json.JsonValueKind.Number)
                            c.id = p.Value.GetInt32();
                        else if (p.Name.Equals("name", StringComparison.OrdinalIgnoreCase))
                            c.name = p.Value.GetString();
                        else if (p.Name.Equals("leader_id", StringComparison.OrdinalIgnoreCase) && p.Value.ValueKind == System.Text.Json.JsonValueKind.Number)
                            c.leader_id = p.Value.GetInt32();
                        else if (p.Name.Equals("created_at", StringComparison.OrdinalIgnoreCase))
                            c.created_at = p.Value.GetString();
                        else if (p.Name.Equals("leader", StringComparison.OrdinalIgnoreCase) && p.Value.ValueKind == System.Text.Json.JsonValueKind.Object)
                        {
                            foreach (var lp in p.Value.EnumerateObject())
                                if (lp.Name.Equals("username", StringComparison.OrdinalIgnoreCase))
                                    c.leader = new ClanLeaderInfo { username = lp.Value.GetString() };
                        }
                    }
                    if (c.id > 0) list.Add(c);
                }

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Clans.Clear();
                    foreach (var c in list) Clans.Add(c);
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a klánok betöltésekor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async Task CreateClan()
        {
            var dialog = new ClanFormWindow();
            dialog.Owner = Application.Current.MainWindow;
            dialog.ShowDialog();

            if (dialog.VM.Confirmed)
                await LoadClans();
        }

        private async Task ViewMembers()
        {
            if (SelectedClan == null) return;
            var w = new ClanMembersWindow(SelectedClan);
            w.Owner = Application.Current.MainWindow;
            w.ShowDialog();
            await LoadClans();
        }

        private async Task EditClan()
        {
            if (SelectedClan == null) return;

            var newName = Microsoft.VisualBasic.Interaction.InputBox(
                "Adj meg új nevet a klánnak:", "Klán szerkesztése", SelectedClan.name);

            if (string.IsNullOrWhiteSpace(newName) || newName == SelectedClan.name) return;

            try
            {
                await _api.PutAsync<ClanWithMembers>($"clans/{SelectedClan.id}", new { name = newName });
                await LoadClans();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a szerkesztéskor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async Task DeleteClan()
        {
            if (SelectedClan == null) return;

            var r = MessageBox.Show(
                $"Biztosan törlöd a \"{SelectedClan.name}\" klánt?",
                "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
            if (r != MessageBoxResult.Yes) return;

            try
            {
                await _api.DeleteAsync($"clans/{SelectedClan.id}");
                await LoadClans();
                SelectedClan = null;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a törléskor: {ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
