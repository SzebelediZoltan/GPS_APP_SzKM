using gpass_app_wpf.ViewModels;

namespace gpass_app_wpf_tests.tests.ViewModels;

/// <summary>
/// Egy minimális leszármazott, ami tesztelhetővé teszi a protected OnPropertyChanged-et.
/// </summary>
internal class TestableViewModel : BaseViewModel
{
    private string _value = "";
    public string Value
    {
        get => _value;
        set { _value = value; OnPropertyChanged(); }
    }

    public void FireExplicit(string name) => OnPropertyChanged(name);
}

[TestFixture]
public class BaseViewModelTests
{
    [Test]
    public void PropertyChanged_FiredWhenPropertySet()
    {
        var vm = new TestableViewModel();
        var fired = new List<string>();
        vm.PropertyChanged += (_, e) => fired.Add(e.PropertyName!);

        vm.Value = "hello";

        Assert.That(fired, Contains.Item("Value"));
    }

    [Test]
    public void PropertyChanged_FiresWithExplicitName()
    {
        var vm = new TestableViewModel();
        var fired = new List<string>();
        vm.PropertyChanged += (_, e) => fired.Add(e.PropertyName!);

        vm.FireExplicit("SomeProp");

        Assert.That(fired, Contains.Item("SomeProp"));
    }

    [Test]
    public void PropertyChanged_NotFired_WhenNoSubscriber()
    {
        // Nincs kivétel, ha nincs feliratkozott handler
        var vm = new TestableViewModel();
        Assert.DoesNotThrow(() => vm.Value = "x");
    }

    [Test]
    public void PropertyChanged_MultipleSubscribers_AllNotified()
    {
        var vm = new TestableViewModel();
        int count = 0;
        vm.PropertyChanged += (_, _) => count++;
        vm.PropertyChanged += (_, _) => count++;

        vm.Value = "test";

        Assert.That(count, Is.EqualTo(2));
    }
}