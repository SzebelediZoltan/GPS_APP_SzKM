using System.Globalization;
using System.Windows;
using gpass_app_wpf.Converters;

namespace gpass_app_wpf_tests.tests.Converters;

[TestFixture]
[Apartment(ApartmentState.STA)]
public class IntToVisibilityConverterTests
{
    private readonly IntToVisibilityConverter _converter = new();

    [Test]
    public void Convert_PositiveInt_ReturnsVisible()
    {
        var result = _converter.Convert(1, typeof(Visibility), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(Visibility.Visible));
    }

    [Test]
    public void Convert_Zero_ReturnsCollapsed()
    {
        var result = _converter.Convert(0, typeof(Visibility), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(Visibility.Collapsed));
    }

    [Test]
    public void Convert_NegativeInt_ReturnsCollapsed()
    {
        var result = _converter.Convert(-5, typeof(Visibility), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(Visibility.Collapsed));
    }

    [Test]
    public void Convert_NonInt_ReturnsCollapsed()
    {
        var result = _converter.Convert("text", typeof(Visibility), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(Visibility.Collapsed));
    }

    [Test]
    public void Convert_LargeInt_ReturnsVisible()
    {
        var result = _converter.Convert(999, typeof(Visibility), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(Visibility.Visible));
    }

    [Test]
    public void ConvertBack_ThrowsNotImplementedException()
    {
        Assert.Throws<NotImplementedException>(() =>
            _converter.ConvertBack(Visibility.Visible, typeof(int), null!, CultureInfo.InvariantCulture));
    }
}
