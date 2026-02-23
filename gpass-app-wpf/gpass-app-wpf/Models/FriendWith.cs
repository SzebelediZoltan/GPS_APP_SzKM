namespace gpass_app_wpf.Models
{
    public class FriendWith
    {
        public int id { get; set; }
        public int sender_id { get; set; }
        public int receiver_id { get; set; }
        public string status { get; set; }
        public string created_at { get; set; }
    }
}
