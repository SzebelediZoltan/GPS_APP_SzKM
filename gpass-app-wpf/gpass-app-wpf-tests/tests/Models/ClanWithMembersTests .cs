using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class ClanWithMembersTests
{
    // ── leader_name ───────────────────────────────────────────────────────────

    [Test]
    public void LeaderName_ReturnsUsername_WhenLeaderIsSet()
    {
        var clan = new ClanWithMembers
        {
            leader_id = 3,
            leader = new ClanLeaderInfo { username = "VezérPista" }
        };
        Assert.That(clan.leader_name, Is.EqualTo("VezérPista"));
    }

    [Test]
    public void LeaderName_FallsBackToLeaderId_WhenLeaderIsNull()
    {
        var clan = new ClanWithMembers { leader_id = 7, leader = null };
        Assert.That(clan.leader_name, Is.EqualTo("#7"));
    }

    // ── total_members ─────────────────────────────────────────────────────────

    [Test]
    public void TotalMembers_IsMemberCountPlusOne()
    {
        var clan = new ClanWithMembers { member_count = 4 };
        Assert.That(clan.total_members, Is.EqualTo(5));
    }

    [Test]
    public void TotalMembers_IsOneWhenMemberCountIsZero()
    {
        var clan = new ClanWithMembers { member_count = 0 };
        Assert.That(clan.total_members, Is.EqualTo(1));
    }

    // ── alap property-k ───────────────────────────────────────────────────────

    [Test]
    public void Properties_CanBeSet()
    {
        var clan = new ClanWithMembers
        {
            id = 1,
            name = "Alpha",
            description = "Első klán",
            leader_id = 10,
            created_at = "2024-01-01T00:00:00Z",
            member_count = 3
        };
        Assert.That(clan.id, Is.EqualTo(1));
        Assert.That(clan.name, Is.EqualTo("Alpha"));
        Assert.That(clan.description, Is.EqualTo("Első klán"));
        Assert.That(clan.leader_id, Is.EqualTo(10));
        Assert.That(clan.created_at, Is.EqualTo("2024-01-01T00:00:00Z"));
        Assert.That(clan.member_count, Is.EqualTo(3));
    }
}

[TestFixture]
public class ClanLeaderInfoTests
{
    [Test]
    public void Username_CanBeSet()
    {
        var info = new ClanLeaderInfo { username = "BossGuy" };
        Assert.That(info.username, Is.EqualTo("BossGuy"));
    }
}