using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class CreateUserRequestTests
{
    [Test]
    public void Properties_CanBeSet()
    {
        var req = new CreateUserRequest
        {
            username = "newuser",
            email = "new@example.com",
            password = "secret123",
            isAdmin = true
        };
        Assert.That(req.username, Is.EqualTo("newuser"));
        Assert.That(req.email, Is.EqualTo("new@example.com"));
        Assert.That(req.password, Is.EqualTo("secret123"));
        Assert.That(req.isAdmin, Is.True);
    }

    [Test]
    public void IsAdmin_DefaultIsFalse()
    {
        var req = new CreateUserRequest();
        Assert.That(req.isAdmin, Is.False);
    }
}

[TestFixture]
public class UpdateUserRequestTests
{
    [Test]
    public void Properties_CanBeSet()
    {
        var req = new UpdateUserRequest
        {
            username = "updated",
            email = "updated@example.com",
            password = "newpass",
            isAdmin = false
        };
        Assert.That(req.username, Is.EqualTo("updated"));
        Assert.That(req.email, Is.EqualTo("updated@example.com"));
        Assert.That(req.password, Is.EqualTo("newpass"));
        Assert.That(req.isAdmin, Is.False);
    }
}