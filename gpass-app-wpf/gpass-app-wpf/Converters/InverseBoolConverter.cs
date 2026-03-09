using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace gpass_app_wpf.Converters
{
    public class InverseBoolConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            bool b = value is bool bv && bv;
            if (targetType == typeof(Visibility))
                return b ? Visibility.Collapsed : Visibility.Visible;
            return !b;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
            => value is bool b ? !b : value;
    }
}
