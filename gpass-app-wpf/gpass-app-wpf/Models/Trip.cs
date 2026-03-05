namespace gpass_app_wpf.Models
{
    public class Trip
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public string? name { get; set; }
        public string? trip_name { get; set; }
        public string? title { get; set; }
        public string created_at { get; set; }

        public string DisplayName =>
            !string.IsNullOrEmpty(name)      ? name :
            !string.IsNullOrEmpty(trip_name) ? trip_name :
            !string.IsNullOrEmpty(title)     ? title :
            $"#{id}";
    }
}
