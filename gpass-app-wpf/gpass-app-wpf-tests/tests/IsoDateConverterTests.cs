using System.Globalization;
using gpass_app_wpf.Converters;

namespace gpass_app_wpf_tests.Converters;

[TestFixture]
public class IsoDateConverterTests
{
    private readonly IsoDateConverter _converter = new();

    [Test]
    public void Convert_ValidIsoString_ReturnsFormattedLocalTime()
    {
        var result = _converter.Convert("2024-06-15T10:30:00Z", typeof(string), null!, CultureInfo.InvariantCulture);

        Assert.That(result, Is.InstanceOf<string>());
        var str = (string)result;

        // Elvárt formátum: "yyyy-MM-dd HH:mm" → 16 karakter
        Assert.That(str.Length, Is.EqualTo(16));
        Assert.That(str[4],  Is.EqualTo('-'));
        Assert.That(str[7],  Is.EqualTo('-'));
        Assert.That(str[10], Is.EqualTo(' '));
        Assert.That(str[13], Is.EqualTo(':'));
    }

    [Test]
    public void Convert_InvalidString_ReturnsOriginalValue()
    {
        var result = _converter.Convert("not-a-date", typeof(string), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo("not-a-date"));
    }

    [Test]
    public void Convert_NonStringValue_ReturnsOriginalValue()
    {
        var result = _converter.Convert(42, typeof(string), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.EqualTo(42));
    }

    [Test]
    public void Convert_NullValue_ReturnsNull()
    {
        var result = _converter.Convert(null!, typeof(string), null!, CultureInfo.InvariantCulture);
        Assert.That(result, Is.Null);
    }

    [Test]
    public void ConvertBack_ThrowsNotImplementedException()
    {
        Assert.Throws<NotImplementedException>(() =>
            _converter.ConvertBack("2024-01-01", typeof(string), null!, CultureInfo.InvariantCulture));
    }
}
