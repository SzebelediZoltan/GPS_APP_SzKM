namespace gpass_app_wpf.Models
{
    public class ClanMemberUserInfo
    {
        public int ID { get; set; }
        public string username { get; set; }
        public string email { get; set; }
    }

    public class ClanMemberDetail
    {
        public int clan_id { get; set; }
        public int user_id { get; set; }
        public string joined_at { get; set; }
        public ClanMemberUserInfo user { get; set; }
        public int leader_id { get; set; }  // a klán vezető ID-ja (betöltéskor töltjük)

        public string display_name  => user?.username ?? $"#{user_id}";
        public string display_email => user?.email ?? "";
        public bool   is_leader     => user_id == leader_id;
        public string role_label    => is_leader ? "👑 Vezető" : "Tag";
    }
}
