using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;

namespace gpass_app_wpf_tests.tests.ViewModels;

[TestFixture]
[Apartment(ApartmentState.STA)]
public class ClanFormViewModelTests
{
    private Window _window = null!;

    [SetUp]
    public void SetUp() => _window = new Window();

    [TearDown]
    public void TearDown() => _window.Close();

    // ── Alapállapot ───────────────────────────────────────────────────────────

    [Test]
    public void Confirmed_DefaultIsFalse()
    {
        var vm = new ClanFormViewModel(_window);
        Assert.That(vm.Confirmed, Is.False);
    }

    [Test]
    public void HasError_FalseByDefault()
    {
        var vm = new ClanFormViewModel(_window);
        Assert.That(vm.HasError, Is.False);
    }

    [Test]
    public void HasSelectedLeader_FalseByDefault()
    {
        var vm = new ClanFormViewModel(_window);
        Assert.That(vm.HasSelectedLeader, Is.False);
    }

    [Test]
    public void LeaderDisplayText_EmptyByDefault()
    {
        var vm = new ClanFormViewModel(_window);
        Assert.That(vm.LeaderDisplayText, Is.EqualTo(""));
    }

    // ── Klán név validáció ────────────────────────────────────────────────────

    [Test]
    public void NameError_SetWhenEmpty()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Name = "";
        Assert.That(vm.HasNameError, Is.True);
    }

    [Test]
    public void NameError_SetWhenTooShort()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Name = "ab"; // 2 karakter
        Assert.That(vm.HasNameError, Is.True);
        Assert.That(vm.NameError, Does.Contain("3"));
    }

    [Test]
    public void NameError_SetWhenTooLong()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Name = new string('x', 41); // 41 karakter
        Assert.That(vm.HasNameError, Is.True);
        Assert.That(vm.NameError, Does.Contain("40"));
    }

    [Test]
    public void NameError_ClearedWhenValid()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Name = ""; // hibás
        vm.Name = "AlphaSquad"; // helyes
        Assert.That(vm.HasNameError, Is.False);
    }

    [TestCase("abc")]
    [TestCase("Alpha")]
    [TestCase("Exactly40CharactersIsOkayForClanNames!!")]
    public void NameError_NotSet_ForValidNames(string name)
    {
        var vm = new ClanFormViewModel(_window);
        vm.Name = name;
        Assert.That(vm.HasNameError, Is.False);
    }

    // ── Leírás validáció ──────────────────────────────────────────────────────

    [Test]
    public void DescriptionError_SetWhenOver200Chars()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Description = new string('a', 201);
        Assert.That(vm.HasDescriptionError, Is.True);
        Assert.That(vm.DescriptionError, Does.Contain("200"));
    }

    [Test]
    public void DescriptionError_NotSet_WhenExactly200Chars()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Description = new string('a', 200);
        Assert.That(vm.HasDescriptionError, Is.False);
    }

    [Test]
    public void DescriptionError_NotSet_WhenEmpty()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Description = "";
        Assert.That(vm.HasDescriptionError, Is.False);
    }

    // ── Vezető validáció ──────────────────────────────────────────────────────

    [Test]
    public void HasSelectedLeader_TrueWhenLeaderSet()
    {
        var vm = new ClanFormViewModel(_window);
        var user = new User { ID = 1, username = "boss", email = "boss@x.com" };

        // SelectLeaderCommand állítja be a SelectedLeadert
        vm.SelectLeaderCommand.Execute(user);

        Assert.That(vm.HasSelectedLeader, Is.True);
    }

    [Test]
    public void LeaderDisplayText_ShowsUsernameAndEmail_WhenLeaderSet()
    {
        var vm = new ClanFormViewModel(_window);
        var user = new User { ID = 2, username = "alice", email = "alice@x.com" };
        vm.SelectLeaderCommand.Execute(user);
        Assert.That(vm.LeaderDisplayText, Does.Contain("alice"));
        Assert.That(vm.LeaderDisplayText, Does.Contain("alice@x.com"));
    }

    [Test]
    public void LeaderError_SetWhenLeaderIsNull()
    {
        var vm = new ClanFormViewModel(_window);
        // Nincs leader beállítva, a SelectedLeader null marad
        // Validáció a SelectedLeader setter-én keresztül → értsd: null-ra állítva
        vm.SelectedLeader = null!;
        Assert.That(vm.HasLeaderError, Is.True);
    }

    [Test]
    public void LeaderError_ClearedWhenLeaderSelected()
    {
        var vm = new ClanFormViewModel(_window);
        vm.SelectedLeader = null!;                              // hiba
        vm.SelectLeaderCommand.Execute(new User { ID = 5 });   // javítás
        Assert.That(vm.HasLeaderError, Is.False);
    }

    // ── SelectLeaderCommand ───────────────────────────────────────────────────

    [Test]
    public void SelectLeaderCommand_ClearsSearchResults()
    {
        var vm = new ClanFormViewModel(_window);
        // Egyből adjunk hozzá elemet a results-hoz (direkten, getter-en keresztül)
        vm.SearchResults.Add(new User { ID = 1, username = "x" });
        vm.SelectLeaderCommand.Execute(new User { ID = 2, username = "y" });
        Assert.That(vm.SearchResults, Is.Empty);
    }

    // ── ErrorMessage ──────────────────────────────────────────────────────────

    [Test]
    public void ErrorMessage_CanBeSetAndCleared()
    {
        var vm = new ClanFormViewModel(_window);
        vm.ErrorMessage = "Backend hiba";
        Assert.That(vm.HasError, Is.True);
        vm.DismissErrorCommand.Execute(null);
        Assert.That(vm.HasError, Is.False);
    }

    // ── Searching ─────────────────────────────────────────────────────────────

    [Test]
    public void Searching_DefaultIsFalse()
    {
        var vm = new ClanFormViewModel(_window);
        Assert.That(vm.Searching, Is.False);
    }

    // ── SaveCommand ───────────────────────────────────────────────────────────

    [Test]
    public void SaveCommand_CanExecute_WhenNotSaving()
    {
        var vm = new ClanFormViewModel(_window);
        Assert.That(vm.SaveCommand.CanExecute(null), Is.True);
    }

    [Test]
    public void SaveCommand_CannotExecute_WhenSaving()
    {
        var vm = new ClanFormViewModel(_window);
        vm.Saving = true;
        Assert.That(vm.SaveCommand.CanExecute(null), Is.False);
    }

    // ── PropertyChanged ───────────────────────────────────────────────────────

    [Test]
    public void PropertyChanged_FiredForName()
    {
        var vm = new ClanFormViewModel(_window);
        var props = new List<string>();
        vm.PropertyChanged += (_, e) => props.Add(e.PropertyName!);

        vm.Name = "TestName";

        Assert.That(props, Contains.Item("Name"));
        Assert.That(props, Contains.Item("NameError"));
        Assert.That(props, Contains.Item("HasNameError"));
    }

    [Test]
    public void PropertyChanged_FiredForDescription()
    {
        var vm = new ClanFormViewModel(_window);
        var props = new List<string>();
        vm.PropertyChanged += (_, e) => props.Add(e.PropertyName!);

        vm.Description = "Leírás";

        Assert.That(props, Contains.Item("Description"));
        Assert.That(props, Contains.Item("DescriptionError"));
        Assert.That(props, Contains.Item("HasDescriptionError"));
    }
}