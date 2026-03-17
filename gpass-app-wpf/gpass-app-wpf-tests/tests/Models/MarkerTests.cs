using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class MarkerTests
{
    [Test]
    public void Marker_PropertiesCanBeSet()
    {
        var marker = new Marker
        {
            id = 10,
            creator_id = 2,
            marker_type = "POI",
            score = 50,
            lat = "47.4979",
            lng = "19.0402",
            created_at = "2024-06-01T12:00:00Z"
        };

        Assert.That(marker.id, Is.EqualTo(10));
        Assert.That(marker.creator_id, Is.EqualTo(2));
        Assert.That(marker.marker_type, Is.EqualTo("POI"));
        Assert.That(marker.score, Is.EqualTo(50));
        Assert.That(marker.lat, Is.EqualTo("47.4979"));
        Assert.That(marker.lng, Is.EqualTo("19.0402"));
        Assert.That(marker.created_at, Is.EqualTo("2024-06-01T12:00:00Z"));
    }
}
