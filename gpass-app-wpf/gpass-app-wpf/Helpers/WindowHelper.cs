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

        public static bool ShowConfirm(
            string message,
            string title    = "Megerősítés",
            string yesText  = "Igen",
            string noText   = "Mégse",
            string icon     = "⚠",
            bool   isDanger = false)
        {
            var dlg = new gpass_app_wpf.Views.ConfirmDialog(message, title, yesText, noText, icon, isDanger)
            {
                Owner = GetActiveWindow()
            };
            dlg.ShowDialog();
            return dlg.Result;
        }
    }
}