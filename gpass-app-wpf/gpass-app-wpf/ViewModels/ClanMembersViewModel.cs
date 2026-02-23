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
    public class ClanMembersViewModel : BaseViewModel
    {
        private readonly ApiService _api;
        private readonly ClanWithMembers _clan;

        public string Title => $"🛡 {_clan.name} – tagok";

        private string _clanInfo;
        public string ClanInfo
        {
            get => _clanInfo;
            set { _clanInfo = value; OnPropertyChanged(); }
        }

        public ObservableCollection<ClanMemberDetail> Members { get; } = new();

        private ClanMemberDetail _selectedMember;
        public ClanMemberDetail SelectedMember
        {
            get => _selectedMember;
            set { _selectedMember = value; OnPropertyChanged(); }
        }

        public RelayCommand RemoveMemberCommand  { get; }
        public RelayCommand ChangeLeaderCommand  { get; }

        private bool _loading;
        public bool Loading { get => _loading; set { _loading = value; OnPropertyChanged(); } }

        public ClanMembersViewModel(ClanWithMembers clan)
        {
            _clan = clan;
            _api  = SessionService.Api;
            ClanInfo = $"ID: {_clan.id}  •  Vezető: {_clan.leader_name}";

            RemoveMemberCommand = new RelayCommand(async _ => await RemoveMember(), _ => SelectedMember != null);
            ChangeLeaderCommand = new RelayCommand(async _ => await ChangeLeader(), _ => SelectedMember != null && SelectedMember.user_id != _clan.leader_id);

            _ = LoadMembers();
        }

        public async Task LoadMembers()
        {
            Loading = true;
            try
            {
                var memberships = await _api.GetAsync<List<ClanMember>>($"clan-members/by-clan/{_clan.id}");

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
                // 1. Klán leader_id frissítése
                await _api.PutAsync<object>($"clans/{_clan.id}", new { leader_id = newLeader.user_id });

                // 2. Ha az új vezető még nem tagja, hozzáadjuk
                bool alreadyMember = Members.Any(m => m.user_id == newLeader.user_id);
                if (!alreadyMember)
                {
                    try { await _api.PostAsync<object>("clan-members", new { clan_id = _clan.id, user_id = newLeader.user_id }); }
                    catch { }
                }

                // 3. Frissítjük a lokális állapotot
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
