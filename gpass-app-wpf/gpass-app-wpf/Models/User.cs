using System;
using System.Collections.Generic;
using System.Text;

namespace gpass_app_wpf.Models
{
    public class User
    {
        public int ID { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public bool isAdmin { get; set; }
    }
}
