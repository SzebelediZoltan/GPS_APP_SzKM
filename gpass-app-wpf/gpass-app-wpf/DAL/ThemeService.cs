using System;
using System.Windows;

namespace gpass_app_wpf.DAL
{
    public static class ThemeService
    {
        public static bool IsDark { get; private set; } = false;

        public static event Action ThemeChanged;

        public static void Toggle()
        {
            IsDark = !IsDark;
            Apply();
            ThemeChanged?.Invoke();
        }

        public static void Apply()
        {
            var dict = new ResourceDictionary
            {
                Source = new Uri(
                    IsDark
                        ? "pack://application:,,,/Themes/Dark.xaml"
                        : "pack://application:,,,/Themes/Light.xaml",
                    UriKind.Absolute)
            };

            var app = Application.Current.Resources;
            // Csere: ha már van téma, cseréljük ki, egyébként adjuk hozzá
            for (int i = 0; i < app.MergedDictionaries.Count; i++)
            {
                var src = app.MergedDictionaries[i].Source?.ToString() ?? "";
                if (src.Contains("/Themes/"))
                {
                    app.MergedDictionaries[i] = dict;
                    return;
                }
            }
            app.MergedDictionaries.Add(dict);
        }
    }
}
