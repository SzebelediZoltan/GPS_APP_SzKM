using gpass_app_wpf.ViewModels;

namespace gpass_app_wpf_tests.tests.ViewModels;

[TestFixture]
[Apartment(ApartmentState.STA)]
public class ServerOptionTests
{
    [Test]
    public void ToString_ReturnsLabel()
    {
        var option = new ServerOption { Label = "Localhost", BaseUrl = "http://localhost/" };
        Assert.That(option.ToString(), Is.EqualTo("Localhost"));
    }

    [Test]
    public void ToString_NullLabelReturnsNull()
    {
        var option = new ServerOption { Label = null, BaseUrl = "http://localhost/" };
        Assert.That(option.ToString(), Is.Null);
    }
}

[TestFixture]
[Apartment(ApartmentState.STA)]
public class RelayCommandTests
{
    [Test]
    public void Execute_CallsAction()
    {
        bool executed = false;
        var cmd = new RelayCommand(_ => executed = true);
        cmd.Execute(null);
        Assert.That(executed, Is.True);
    }

    [Test]
    public void Execute_PassesParameter()
    {
        object? received = null;
        var cmd = new RelayCommand(p => received = p);
        cmd.Execute("hello");
        Assert.That(received, Is.EqualTo("hello"));
    }

    [Test]
    public void CanExecute_TrueByDefault()
    {
        var cmd = new RelayCommand(_ => { });
        Assert.That(cmd.CanExecute(null), Is.True);
    }

    [Test]
    public void CanExecute_RespectsCondition()
    {
        bool allowed = false;
        var cmd = new RelayCommand(_ => { }, _ => allowed);

        Assert.That(cmd.CanExecute(null), Is.False);
        allowed = true;
        Assert.That(cmd.CanExecute(null), Is.True);
    }

    [Test]
    public void CanExecute_PassesParameterToCondition()
    {
        var cmd = new RelayCommand(_ => { }, p => p is string s && s == "ok");
        Assert.That(cmd.CanExecute("ok"), Is.True);
        Assert.That(cmd.CanExecute("fail"), Is.False);
    }
}
