using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;

namespace gpass_app_wpf_tests.tests.ViewModels;

/// <summary>
/// Tesztek a UserDetailViewModel szinkron logikájához.
/// A konstruktor fire-and-forget LoadAll() hívást indít (API nélkül hibázik, de elnyeli),
/// ezért a szinkron property-k, konstansok és validációk biztonságosan tesztelhetők.
/// </summary>
[TestFixture]
[Apartment(ApartmentState.STA)]
public class UserDetailViewModelTests
{
    private static User MakeUser(int id = 1, string username = "alice",
                                  string email = "a@test.com", bool isAdmin = false)
        => new User { ID = id, username = username, email = email, isAdmin = isAdmin };

    // ── Title & UserInfo ──────────────────────────────────────────────────────

    [Test]
    public void Title_ContainsUsername()
    {
        var vm = new UserDetailViewModel(MakeUser(username: "bob"));
        Assert.That(vm.Title, Does.Contain("bob"));
    }

    [Test]
    public void UserInfo_ContainsId()
    {
        var vm = new UserDetailViewModel(MakeUser(id: 42));
        Assert.That(vm.UserInfo, Does.Contain("42"));
    }

    [Test]
    public void UserInfo_ContainsEmail()
    {
        var vm = new UserDetailViewModel(MakeUser(email: "z@z.hu"));
        Assert.That(vm.UserInfo, Does.Contain("z@z.hu"));
    }

    [Test]
    public void UserInfo_ShowsAdmin_WhenIsAdmin()
    {
        var vm = new UserDetailViewModel(MakeUser(isAdmin: true));
        Assert.That(vm.UserInfo, Does.Contain("Admin"));
    }

    [Test]
    public void UserInfo_ShowsUser_WhenNotAdmin()
    {
        var vm = new UserDetailViewModel(MakeUser(isAdmin: false));
        Assert.That(vm.UserInfo, Does.Contain("Felhasználó"));
    }

    // ── AllowedMarkerTypes ────────────────────────────────────────────────────

    [Test]
    public void AllowedMarkerTypes_ContainsExpectedValues()
    {
        var types = UserDetailViewModel.AllowedMarkerTypes;
        Assert.That(types, Contains.Item("danger"));
        Assert.That(types, Contains.Item("police"));
        Assert.That(types, Contains.Item("accident"));
        Assert.That(types, Contains.Item("traffic"));
        Assert.That(types, Contains.Item("roadblock"));
        Assert.That(types, Contains.Item("speedtrap"));
        Assert.That(types, Contains.Item("other"));
    }

    [Test]
    public void AllowedMarkerTypes_HasExactlySevenEntries()
    {
        Assert.That(UserDetailViewModel.AllowedMarkerTypes.Length, Is.EqualTo(7));
    }

    // ── HasErrors ─────────────────────────────────────────────────────────────

    [Test]
    public void HasErrors_FalseByDefault()
    {
        var vm = new UserDetailViewModel(MakeUser());
        // Alapértelmezetten null/üres az Errors
        Assert.That(vm.HasErrors, Is.False);
    }

    [Test]
    public void ClearErrors_SetsErrorsToNull()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.Errors = "Valami hiba";
        vm.ClearErrors();
        Assert.That(vm.HasErrors, Is.False);
    }

    // ── HasSelectedTrip / HasSelectedMarker ───────────────────────────────────

    [Test]
    public void HasSelectedTrip_FalseByDefault()
    {
        var vm = new UserDetailViewModel(MakeUser());
        Assert.That(vm.HasSelectedTrip, Is.False);
    }

    [Test]
    public void HasSelectedMarker_FalseByDefault()
    {
        var vm = new UserDetailViewModel(MakeUser());
        Assert.That(vm.HasSelectedMarker, Is.False);
    }

    [Test]
    public void HasSelectedFriend_FalseByDefault()
    {
        var vm = new UserDetailViewModel(MakeUser());
        Assert.That(vm.HasSelectedFriend, Is.False);
    }

    // ── SelectedTrip setter – EditTripName prefill ────────────────────────────

    [Test]
    public void SelectedTrip_PreFillsEditTripName_UsingTripName()
    {
        var vm = new UserDetailViewModel(MakeUser());
        var trip = new Trip { id = 1, trip_name = "NyáriTúra", name = null };
        vm.SelectedTrip = trip;
        Assert.That(vm.EditTripName, Is.EqualTo("NyáriTúra"));
    }

    [Test]
    public void SelectedTrip_PreFillsEditTripName_UsingNameFallback()
    {
        var vm = new UserDetailViewModel(MakeUser());
        var trip = new Trip { id = 1, trip_name = null, name = "NameFallback" };
        vm.SelectedTrip = trip;
        Assert.That(vm.EditTripName, Is.EqualTo("NameFallback"));
    }

    [Test]
    public void SelectedTrip_ClearsTripEditError()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.TripEditError = "Régi hiba";
        vm.SelectedTrip = new Trip { id = 1, trip_name = "x" };
        Assert.That(vm.TripEditError, Is.Null);
    }

    // ── SelectedMarker setter – EditMarkerType/Score prefill ──────────────────

    [Test]
    public void SelectedMarker_PreFillsEditFields()
    {
        var vm = new UserDetailViewModel(MakeUser());
        var marker = new Marker { id = 5, marker_type = "police", score = 10 };
        vm.SelectedMarker = marker;
        Assert.That(vm.EditMarkerType, Is.EqualTo("police"));
        Assert.That(vm.EditMarkerScore, Is.EqualTo("10"));
    }

    // ── Trip névvalidáció (EditTripName setter) ────────────────────────────────

    [Test]
    public void TripEditError_SetWhenNameEmpty()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedTrip = new Trip { id = 1, trip_name = "start" };
        vm.EditTripName = "";
        Assert.That(vm.HasTripEditError, Is.True);
    }

    [Test]
    public void TripEditError_SetWhenNameHasSpecialChars()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedTrip = new Trip { id = 1, trip_name = "start" };
        vm.EditTripName = "rossz!@#"; // csak betű és szám engedélyezett
        Assert.That(vm.HasTripEditError, Is.True);
    }

    [TestCase("AlphaTrip")]
    [TestCase("trip123")]
    [TestCase("A")]
    public void TripEditError_ClearedForValidNames(string validName)
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedTrip = new Trip { id = 1, trip_name = "start" };
        vm.EditTripName = validName;
        Assert.That(vm.HasTripEditError, Is.False);
    }

    // ── Marker validáció (EditMarkerType/Score setter) ────────────────────────

    [Test]
    public void MarkerEditError_SetWhenTypeEmpty()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedMarker = new Marker { id = 1, marker_type = "police", score = 5 };
        vm.EditMarkerType = "";
        Assert.That(vm.HasMarkerEditError, Is.True);
    }

    [Test]
    public void MarkerEditError_SetWhenTypeInvalid()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedMarker = new Marker { id = 1, marker_type = "police", score = 5 };
        vm.EditMarkerType = "invalid_type";
        Assert.That(vm.HasMarkerEditError, Is.True);
    }

    [Test]
    public void MarkerEditError_SetWhenScoreNegative()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedMarker = new Marker { id = 1, marker_type = "police", score = 5 };
        vm.EditMarkerType = "police";
        vm.EditMarkerScore = "-1";
        Assert.That(vm.HasMarkerEditError, Is.True);
    }

    [Test]
    public void MarkerEditError_SetWhenScoreNotNumber()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedMarker = new Marker { id = 1, marker_type = "police", score = 5 };
        vm.EditMarkerType = "police";
        vm.EditMarkerScore = "abc";
        Assert.That(vm.HasMarkerEditError, Is.True);
    }

    [Test]
    public void MarkerEditError_ClearedWhenValidTypeAndScore()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedMarker = new Marker { id = 1, marker_type = "police", score = 5 };
        vm.EditMarkerType = "danger";
        vm.EditMarkerScore = "100";
        Assert.That(vm.HasMarkerEditError, Is.False);
    }

    // ── DismissErrors command ─────────────────────────────────────────────────

    [Test]
    public void DismissErrorsCommand_ClearsErrors()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.Errors = "Hiba";
        vm.DismissErrorsCommand.Execute(null);
        Assert.That(vm.HasErrors, Is.False);
    }

    // ── Command CanExecute ────────────────────────────────────────────────────

    [Test]
    public void DeleteTripCommand_CannotExecute_WhenNoTripSelected()
    {
        var vm = new UserDetailViewModel(MakeUser());
        Assert.That(vm.DeleteTripCommand.CanExecute(null), Is.False);
    }

    [Test]
    public void DeleteTripCommand_CanExecute_WhenTripSelected()
    {
        var vm = new UserDetailViewModel(MakeUser());
        vm.SelectedTrip = new Trip { id = 1, trip_name = "t" };
        Assert.That(vm.DeleteTripCommand.CanExecute(null), Is.True);
    }

    [Test]
    public void DeleteMarkerCommand_CannotExecute_WhenNoMarkerSelected()
    {
        var vm = new UserDetailViewModel(MakeUser());
        Assert.That(vm.DeleteMarkerCommand.CanExecute(null), Is.False);
    }
}