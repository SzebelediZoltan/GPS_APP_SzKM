namespace gpass_app_wpf.Models
{
    public class ClanLeaderInfo
    {
        public string username { get; set; }
    }

    public class ClanWithMembers
    {
        public int id { get; set; }
        public string name { get; set; }
        public int leader_id { get; set; }
        public string created_at { get; set; }
        public ClanLeaderInfo leader { get; set; }

        public string leader_name => leader?.username ?? $"#{leader_id}";
    }
}
