namespace gpass_app_wpf.Models
{
    public class TripPoint
    {
        public int id { get; set; }
        public int trip_id { get; set; }
        public string lat { get; set; }
        public string lng { get; set; }
        public string recorded_at { get; set; }
    }
}
