using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class FriendWithTests
{
    [Test]
    public void Properties_CanBeSet()
    {
        var fw = new FriendWith
        {
            id = 100,
            sender_id = 1,
            receiver_id = 2,
            status = "accepted",
            created_at = "2024-05-01T10:00:00Z"
        };
        Assert.That(fw.id, Is.EqualTo(100));
        Assert.That(fw.sender_id, Is.EqualTo(1));
        Assert.That(fw.receiver_id, Is.EqualTo(2));
        Assert.That(fw.status, Is.EqualTo("accepted"));
        Assert.That(fw.created_at, Is.EqualTo("2024-05-01T10:00:00Z"));
    }

    [Test]
    public void Status_CanBeMutated()
    {
        var fw = new FriendWith { status = "sent" };
        fw.status = "accepted";
        Assert.That(fw.status, Is.EqualTo("accepted"));
    }
}