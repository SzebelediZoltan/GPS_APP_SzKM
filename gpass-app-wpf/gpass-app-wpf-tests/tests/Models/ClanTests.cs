using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class ClanTests
{
    [Test]
    public void Clan_PropertiesCanBeSet()
    {
        var clan = new Clan
        {
            id = 42,
            name = "TestClan",
            leader_id = 5,
            created_at = "2024-01-01T00:00:00Z"
        };

        Assert.That(clan.id, Is.EqualTo(42));
        Assert.That(clan.name, Is.EqualTo("TestClan"));
        Assert.That(clan.leader_id, Is.EqualTo(5));
        Assert.That(clan.created_at, Is.EqualTo("2024-01-01T00:00:00Z"));
    }
}
