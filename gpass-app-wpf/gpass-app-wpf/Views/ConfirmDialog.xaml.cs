using gpass_app_wpf.DAL;
using System.Windows;
using System.Windows.Media;

namespace gpass_app_wpf.Views
{
    public partial class ConfirmDialog : Window
    {
        public bool Result { get; private set; } = false;

        public string Icon    { get; }
        public string Title   { get; }
        public string Message { get; }
        public string YesText { get; }
        public string NoText  { get; }
        public Brush  YesBackground { get; }

        public ConfirmDialog(
            string message,
            string title      = "Megerősítés",
            string yesText    = "Igen",
            string noText     = "Mégse",
            string icon       = "⚠",
            bool   isDanger   = false)
        {
            InitializeComponent();
            ThemeService.Apply();
            ThemeService.ThemeChanged += () => Dispatcher.Invoke(() =>
            {
                Background = (Brush)FindResource("AppBackground");
            });

            Icon          = icon;
            Title         = title;
            Message       = message;
            YesText       = yesText;
            NoText        = noText;
            YesBackground = isDanger
                ? new SolidColorBrush((Color)ColorConverter.ConvertFromString("#e74c3c"))
                : (Brush)Application.Current.FindResource("Accent");

            DataContext = this;
        }

        private void Yes_Click(object sender, RoutedEventArgs e)
        {
            Result = true;
            Close();
        }

        private void No_Click(object sender, RoutedEventArgs e)
        {
            Result = false;
            Close();
        }
    }
}
