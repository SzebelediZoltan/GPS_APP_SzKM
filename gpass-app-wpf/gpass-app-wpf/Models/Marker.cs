namespace gpass_app_wpf.Models
{
    public class Marker
    {
        public int id { get; set; }
        public int creator_id { get; set; }
        public string marker_type { get; set; }
        public int score { get; set; }
        public string lat { get; set; }
        public string lng { get; set; }
        public string created_at { get; set; }
    }
}
