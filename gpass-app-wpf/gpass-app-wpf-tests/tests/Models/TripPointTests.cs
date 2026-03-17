using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class TripPointTests
{
    [Test]
    public void TripPoint_PropertiesCanBeSet()
    {
        var point = new TripPoint
        {
            id = 3,
            trip_id = 7,
            lat = "47.1234",
            lng = "19.5678",
            recorded_at = "2024-05-10T08:30:00Z"
        };

        Assert.That(point.id, Is.EqualTo(3));
        Assert.That(point.trip_id, Is.EqualTo(7));
        Assert.That(point.lat, Is.EqualTo("47.1234"));
        Assert.That(point.lng, Is.EqualTo("19.5678"));
        Assert.That(point.recorded_at, Is.EqualTo("2024-05-10T08:30:00Z"));
    }
}
