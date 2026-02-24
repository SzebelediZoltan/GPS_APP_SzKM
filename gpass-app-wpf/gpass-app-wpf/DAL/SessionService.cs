using System;

namespace gpass_app_wpf.DAL
{
    public static class SessionService
    {
        public static ApiService Api { get; private set; } = new ApiService("http://localhost:4000/api/");

        public static string Token    { get; set; }
        public static bool   IsAdmin  { get; set; }
        public static int    UserId   { get; set; }
        public static string Username { get; set; }

        public static void SetServer(string baseUrl)
        {
            Api = new ApiService(baseUrl);
        }
    }
}
