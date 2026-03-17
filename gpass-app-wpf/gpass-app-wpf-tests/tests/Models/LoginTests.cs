using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class LoginRequestTests
{
    [Test]
    public void LoginRequest_PropertiesCanBeSet()
    {
        var req = new LoginRequest { userID = "admin", password = "secret" };
        Assert.That(req.userID, Is.EqualTo("admin"));
        Assert.That(req.password, Is.EqualTo("secret"));
    }
}

[TestFixture]
public class LoginResponseTests
{
    [Test]
    public void LoginResponse_TokenCanBeSet()
    {
        var resp = new LoginResponse { token = "jwt.token.here" };
        Assert.That(resp.token, Is.EqualTo("jwt.token.here"));
    }
}
