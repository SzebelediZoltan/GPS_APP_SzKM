using gpass_app_wpf.ViewModels;

namespace gpass_app_wpf_tests.ViewModels;

[TestFixture]
[Apartment(ApartmentState.STA)]
public class LoginViewModelTests
{
    [Test]
    public void DefaultServer_IsLocalhost()
    {
        var vm = new LoginViewModel();
        Assert.That(vm.SelectedServer.BaseUrl, Does.Contain("localhost"));
    }

    [Test]
    public void IsLocalhostSelected_TrueByDefault()
    {
        var vm = new LoginViewModel();
        Assert.That(vm.IsLocalhostSelected, Is.True);
        Assert.That(vm.IsGpassSelected, Is.False);
    }

    [Test]
    public void SelectServerCommand_SwitchesToGpass()
    {
        var vm = new LoginViewModel();
        vm.SelectServerCommand.Execute("gpass");
        Assert.That(vm.IsGpassSelected, Is.True);
        Assert.That(vm.IsLocalhostSelected, Is.False);
    }

    [Test]
    public void SelectServerCommand_SwitchesBackToLocalhost()
    {
        var vm = new LoginViewModel();
        vm.SelectServerCommand.Execute("gpass");
        vm.SelectServerCommand.Execute("localhost");
        Assert.That(vm.IsLocalhostSelected, Is.True);
    }

    [Test]
    public void SelectServerCommand_ClearsErrorMessage()
    {
        var vm = new LoginViewModel();
        vm.ErrorMessage = "Korábbi hiba";
        vm.SelectServerCommand.Execute("gpass");
        Assert.That(vm.ErrorMessage, Is.Null);
    }

    [Test]
    public void HasError_FalseWhenNoError()
    {
        var vm = new LoginViewModel();
        Assert.That(vm.HasError, Is.False);
    }

    [Test]
    public void HasError_TrueWhenErrorSet()
    {
        var vm = new LoginViewModel();
        vm.ErrorMessage = "Valami hiba";
        Assert.That(vm.HasError, Is.True);
    }

    [Test]
    public void HasError_FalseAfterErrorCleared()
    {
        var vm = new LoginViewModel();
        vm.ErrorMessage = "Hiba";
        vm.ErrorMessage = null;
        Assert.That(vm.HasError, Is.False);
    }

    [Test]
    public void Servers_ContainsTwoOptions()
    {
        var vm = new LoginViewModel();
        Assert.That(vm.Servers.Count, Is.EqualTo(2));
    }

    [Test]
    public void Loading_DefaultIsFalse()
    {
        var vm = new LoginViewModel();
        Assert.That(vm.Loading, Is.False);
    }

    [Test]
    public void LoginCommand_CannotExecuteWhileLoading()
    {
        var vm = new LoginViewModel();
        vm.Loading = true;
        Assert.That(vm.LoginCommand.CanExecute(null), Is.False);
    }

    [Test]
    public void LoginCommand_CanExecuteWhenNotLoading()
    {
        var vm = new LoginViewModel();
        Assert.That(vm.LoginCommand.CanExecute(null), Is.True);
    }

    [Test]
    public void PropertyChanged_FiredForErrorMessage()
    {
        var vm = new LoginViewModel();
        var changedProps = new List<string>();
        vm.PropertyChanged += (_, e) => changedProps.Add(e.PropertyName!);

        vm.ErrorMessage = "Teszt hiba";

        Assert.That(changedProps, Contains.Item("ErrorMessage"));
        Assert.That(changedProps, Contains.Item("HasError"));
    }

    [Test]
    public void PropertyChanged_FiredForLoading()
    {
        var vm = new LoginViewModel();
        var changedProps = new List<string>();
        vm.PropertyChanged += (_, e) => changedProps.Add(e.PropertyName!);

        vm.Loading = true;

        Assert.That(changedProps, Contains.Item("Loading"));
    }
}
