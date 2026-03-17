using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class TripTests
{
    [Test]
    public void DisplayName_UsesNameFirst()
    {
        var trip = new Trip { id = 1, name = "MyTrip", trip_name = "Other", title = "Title" };
        Assert.That(trip.DisplayName, Is.EqualTo("MyTrip"));
    }

    [Test]
    public void DisplayName_FallsBackToTripName_WhenNameIsNull()
    {
        var trip = new Trip { id = 1, name = null, trip_name = "TripName", title = "Title" };
        Assert.That(trip.DisplayName, Is.EqualTo("TripName"));
    }

    [Test]
    public void DisplayName_FallsBackToTitle_WhenNameAndTripNameAreNull()
    {
        var trip = new Trip { id = 1, name = null, trip_name = null, title = "MyTitle" };
        Assert.That(trip.DisplayName, Is.EqualTo("MyTitle"));
    }

    [Test]
    public void DisplayName_FallsBackToId_WhenAllNamesAreNull()
    {
        var trip = new Trip { id = 99, name = null, trip_name = null, title = null };
        Assert.That(trip.DisplayName, Is.EqualTo("#99"));
    }

    [Test]
    public void DisplayName_FallsBackToId_WhenAllNamesAreEmpty()
    {
        var trip = new Trip { id = 7, name = "", trip_name = "", title = "" };
        Assert.That(trip.DisplayName, Is.EqualTo("#7"));
    }

    [Test]
    public void DisplayName_WhitespaceOnlyNameIsUsedAsIs()
    {
        // string.IsNullOrEmpty("  ") == false, ezért a whitespace-only name megjelenik
        var trip = new Trip { id = 3, name = "  ", trip_name = "Other" };
        Assert.That(trip.DisplayName, Is.EqualTo("  "));
    }
}
