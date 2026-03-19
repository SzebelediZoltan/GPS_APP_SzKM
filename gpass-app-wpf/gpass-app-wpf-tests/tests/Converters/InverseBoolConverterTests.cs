using System.Globalization;
using System.Windows;
using gpass_app_wpf.Converters;

namespace gpass_app_wpf_tests.tests.Converters;

[TestFixture]
[Apartment(ApartmentState.STA)]
public class InverseBoolConverterTests
{
    private readonly InverseBoolConverter _converter = new();

    [Test]
    public void Convert_TrueToFalse()
    {
        var result = _converter.Convert(true, typeof(bool), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.False);
    }

    [Test]
    public void Convert_FalseToTrue()
    {
        var result = _converter.Convert(false, typeof(bool), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.True);
    }

    [Test]
    public void Convert_TrueToVisibility_ReturnsCollapsed()
    {
        var result = _converter.Convert(true, typeof(Visibility), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(Visibility.Collapsed));
    }

    [Test]
    public void Convert_FalseToVisibility_ReturnsVisible()
    {
        var result = _converter.Convert(false, typeof(Visibility), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(Visibility.Visible));
    }

    [Test]
    public void Convert_NonBoolValue_TreatedAsFalse()
    {
        var result = _converter.Convert("notabool", typeof(bool), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.True);
    }

    [Test]
    public void ConvertBack_TrueToFalse()
    {
        var result = _converter.ConvertBack(true, typeof(bool), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.False);
    }

    [Test]
    public void ConvertBack_FalseToTrue()
    {
        var result = _converter.ConvertBack(false, typeof(bool), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.True);
    }

    [Test]
    public void ConvertBack_NonBoolValue_ReturnsOriginalValue()
    {
        var result = _converter.ConvertBack("hello", typeof(bool), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo("hello"));
    }
}
