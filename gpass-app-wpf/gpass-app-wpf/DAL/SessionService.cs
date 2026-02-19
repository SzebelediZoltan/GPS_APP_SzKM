using System;
using System.Collections.Generic;
using System.Text;

namespace gpass_app_wpf.DAL
{
    public static class SessionService
    {
        public static ApiService Api { get; } = new ApiService();

        public static string Token { get; set; }
        public static bool IsAdmin { get; set; }
        public static int UserId { get; set; }
        public static string Username { get; set; }
    }
}

