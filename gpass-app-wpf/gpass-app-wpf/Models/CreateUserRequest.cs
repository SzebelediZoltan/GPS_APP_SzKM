namespace gpass_app_wpf.Models
{
    public class CreateUserRequest
    {
        public string username { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public bool isAdmin { get; set; }
    }

    public class UpdateUserRequest
    {
        public string username { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public bool isAdmin { get; set; }
    }
}
