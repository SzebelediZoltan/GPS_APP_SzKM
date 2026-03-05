using System.Linq;
using System.Windows;

namespace gpass_app_wpf.Helpers
{
    public static class WindowHelper
    {
        public static Window GetActiveWindow()
        {
            return Application.Current.Windows
                .OfType<Window>()
                .FirstOrDefault(w => w.IsActive);
        }
    }
}