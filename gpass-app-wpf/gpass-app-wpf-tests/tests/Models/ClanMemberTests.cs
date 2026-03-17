using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class ClanMemberTests
{
    [Test]
    public void ClanMember_PropertiesCanBeSet()
    {
        var member = new ClanMember
        {
            clan_id = 1,
            user_id = 5,
            joined_at = "2024-03-01T00:00:00Z",
            clan_name = "Alpha"
        };

        Assert.That(member.clan_id, Is.EqualTo(1));
        Assert.That(member.user_id, Is.EqualTo(5));
        Assert.That(member.joined_at, Is.EqualTo("2024-03-01T00:00:00Z"));
        Assert.That(member.clan_name, Is.EqualTo("Alpha"));
    }

    [Test]
    public void ClanMemberClanInfo_NameCanBeSet()
    {
        var info = new ClanMemberClanInfo { name = "BetaClan" };
        Assert.That(info.name, Is.EqualTo("BetaClan"));
    }
}
