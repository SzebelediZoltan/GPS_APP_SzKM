using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;
using System.Windows;

namespace gpass_app_wpf_tests.tests.ViewModels;

[TestFixture]
[Apartment(ApartmentState.STA)]
public class UserFormViewModelTests
{
    private Window _window = null!;

    [SetUp]
    public void SetUp() => _window = new Window();

    [TearDown]
    public void TearDown() => _window.Close();

    // ── Módok ─────────────────────────────────────────────────────────────────

    [Test]
    public void IsEditMode_FalseWhenNoEditUser()
    {
        var vm = new UserFormViewModel(_window);
        Assert.That(vm.IsEditMode, Is.False);
    }

    [Test]
    public void IsEditMode_TrueWhenEditUserProvided()
    {
        var user = new User { ID = 1, username = "alice", email = "a@b.com", isAdmin = false };
        var vm = new UserFormViewModel(_window, user);
        Assert.That(vm.IsEditMode, Is.True);
    }

    [Test]
    public void Title_IsNewUser_WhenCreateMode()
    {
        var vm = new UserFormViewModel(_window);
        Assert.That(vm.Title, Is.EqualTo("Új felhasználó"));
    }

    [Test]
    public void Title_IsEditUser_WhenEditMode()
    {
        var user = new User { ID = 1, username = "bob", email = "b@b.com" };
        var vm = new UserFormViewModel(_window, user);
        Assert.That(vm.Title, Is.EqualTo("Felhasználó szerkesztése"));
    }

    [Test]
    public void Confirmed_DefaultIsFalse()
    {
        var vm = new UserFormViewModel(_window);
        Assert.That(vm.Confirmed, Is.False);
    }

    // ── Edit mode mezők prefill ────────────────────────────────────────────────

    [Test]
    public void EditMode_PreFillsFields()
    {
        var user = new User { ID = 5, username = "charlie", email = "c@c.com", isAdmin = true };
        var vm = new UserFormViewModel(_window, user);
        Assert.That(vm.Username, Is.EqualTo("charlie"));
        Assert.That(vm.Email, Is.EqualTo("c@c.com"));
        Assert.That(vm.IsAdmin, Is.True);
    }

    // ── Username validáció ────────────────────────────────────────────────────

    [Test]
    public void UsernameError_SetWhenEmpty()
    {
        var vm = new UserFormViewModel(_window);
        vm.Username = "";
        Assert.That(vm.HasUsernameError, Is.True);
        Assert.That(vm.UsernameError, Is.Not.Empty);
    }

    [Test]
    public void UsernameError_SetWhenWhitespaceOnly()
    {
        var vm = new UserFormViewModel(_window);
        vm.Username = "   ";
        Assert.That(vm.HasUsernameError, Is.True);
    }

    [Test]
    public void UsernameError_ClearedWhenValid()
    {
        var vm = new UserFormViewModel(_window);
        vm.Username = "";          // hibás
        vm.Username = "validuser"; // helyes
        Assert.That(vm.HasUsernameError, Is.False);
    }

    // ── Email validáció ───────────────────────────────────────────────────────

    [Test]
    public void EmailError_SetWhenEmpty()
    {
        var vm = new UserFormViewModel(_window);
        vm.Email = "";
        Assert.That(vm.HasEmailError, Is.True);
    }

    [Test]
    public void EmailError_SetWhenInvalidFormat()
    {
        var vm = new UserFormViewModel(_window);
        vm.Email = "notanemail";
        Assert.That(vm.HasEmailError, Is.True);
    }

    [TestCase("user@example.com")]
    [TestCase("x@y.hu")]
    [TestCase("a.b-c@test.domain.org")]
    public void EmailError_ClearedWhenValidFormat(string validEmail)
    {
        var vm = new UserFormViewModel(_window);
        vm.Email = validEmail;
        Assert.That(vm.HasEmailError, Is.False);
    }

    // ── Password validáció ────────────────────────────────────────────────────

    [Test]
    public void PasswordError_SetWhenEmptyInCreateMode()
    {
        var vm = new UserFormViewModel(_window); // create mode
        vm.Password = "";
        Assert.That(vm.HasPasswordError, Is.True);
    }

    [Test]
    public void PasswordError_NotSet_WhenEmptyInEditMode()
    {
        var user = new User { ID = 1, username = "x", email = "x@x.com" };
        var vm = new UserFormViewModel(_window, user);
        vm.Password = ""; // editnél üres jelszó megengedett
        Assert.That(vm.HasPasswordError, Is.False);
    }

    [Test]
    public void PasswordError_ClearedWhenFilled()
    {
        var vm = new UserFormViewModel(_window);
        vm.Password = "";         // hibás
        vm.Password = "secure99"; // helyes
        Assert.That(vm.HasPasswordError, Is.False);
    }

    // ── PropertyChanged ───────────────────────────────────────────────────────

    [Test]
    public void PropertyChanged_FiredForUsername()
    {
        var vm = new UserFormViewModel(_window);
        var props = new List<string>();
        vm.PropertyChanged += (_, e) => props.Add(e.PropertyName!);

        vm.Username = "test";

        Assert.That(props, Contains.Item("Username"));
        Assert.That(props, Contains.Item("UsernameError"));
        Assert.That(props, Contains.Item("HasUsernameError"));
    }

    [Test]
    public void PropertyChanged_FiredForEmail()
    {
        var vm = new UserFormViewModel(_window);
        var props = new List<string>();
        vm.PropertyChanged += (_, e) => props.Add(e.PropertyName!);

        vm.Email = "bad";

        Assert.That(props, Contains.Item("Email"));
        Assert.That(props, Contains.Item("EmailError"));
        Assert.That(props, Contains.Item("HasEmailError"));
    }

    [Test]
    public void PropertyChanged_FiredForSaving()
    {
        var vm = new UserFormViewModel(_window);
        var props = new List<string>();
        vm.PropertyChanged += (_, e) => props.Add(e.PropertyName!);

        vm.Saving = true;

        Assert.That(props, Contains.Item("Saving"));
    }

    // ── HasError ──────────────────────────────────────────────────────────────

    [Test]
    public void HasError_FalseByDefault()
    {
        var vm = new UserFormViewModel(_window);
        Assert.That(vm.HasError, Is.False);
    }

    [Test]
    public void HasError_TrueWhenErrorMessageSet()
    {
        var vm = new UserFormViewModel(_window);
        vm.ErrorMessage = "Backend hiba";
        Assert.That(vm.HasError, Is.True);
    }

    // ── Commands ──────────────────────────────────────────────────────────────

    [Test]
    public void SaveCommand_CanExecute_WhenNotSaving()
    {
        var vm = new UserFormViewModel(_window);
        Assert.That(vm.SaveCommand.CanExecute(null), Is.True);
    }

    [Test]
    public void SaveCommand_CannotExecute_WhenSaving()
    {
        var vm = new UserFormViewModel(_window);
        vm.Saving = true;
        Assert.That(vm.SaveCommand.CanExecute(null), Is.False);
    }
}