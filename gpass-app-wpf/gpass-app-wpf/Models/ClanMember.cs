namespace gpass_app_wpf.Models
{
    public class ClanMemberClanInfo
    {
        public string name { get; set; }
    }

    public class ClanMember
    {
        public int clan_id { get; set; }
        public int user_id { get; set; }
        public string joined_at { get; set; }
        public ClanMemberClanInfo clan { get; set; }

        // Manuálisan töltjük fel a LoadClans-ban
        public string clan_name { get; set; }
    }
}
