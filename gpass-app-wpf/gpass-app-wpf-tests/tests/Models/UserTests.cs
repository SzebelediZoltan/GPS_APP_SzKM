using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class UserTests
{
    [Test]
    public void User_PropertiesCanBeSet()
    {
        var user = new User
        {
            ID = 1,
            username = "testuser",
            email = "test@example.com",
            isAdmin = true
        };

        Assert.That(user.ID, Is.EqualTo(1));
        Assert.That(user.username, Is.EqualTo("testuser"));
        Assert.That(user.email, Is.EqualTo("test@example.com"));
        Assert.That(user.isAdmin, Is.True);
    }

    [Test]
    public void User_DefaultIsAdminIsFalse()
    {
        var user = new User();
        Assert.That(user.isAdmin, Is.False);
    }
}
