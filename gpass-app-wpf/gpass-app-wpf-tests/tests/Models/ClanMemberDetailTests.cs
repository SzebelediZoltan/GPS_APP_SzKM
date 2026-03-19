using gpass_app_wpf.Models;

namespace gpass_app_wpf_tests.tests.Models;

[TestFixture]
public class ClanMemberDetailTests
{
    // ── display_name ──────────────────────────────────────────────────────────

    [Test]
    public void DisplayName_ReturnsUsername_WhenUserIsSet()
    {
        var detail = new ClanMemberDetail
        {
            user_id = 7,
            user = new ClanMemberUserInfo { ID = 7, username = "JohnDoe", email = "j@example.com" }
        };
        Assert.That(detail.display_name, Is.EqualTo("JohnDoe"));
    }

    [Test]
    public void DisplayName_FallsBackToUserId_WhenUserIsNull()
    {
        var detail = new ClanMemberDetail { user_id = 42, user = null };
        Assert.That(detail.display_name, Is.EqualTo("#42"));
    }

    // ── display_email ─────────────────────────────────────────────────────────

    [Test]
    public void DisplayEmail_ReturnsEmail_WhenUserIsSet()
    {
        var detail = new ClanMemberDetail
        {
            user = new ClanMemberUserInfo { ID = 1, username = "x", email = "x@test.hu" }
        };
        Assert.That(detail.display_email, Is.EqualTo("x@test.hu"));
    }

    [Test]
    public void DisplayEmail_ReturnsEmptyString_WhenUserIsNull()
    {
        var detail = new ClanMemberDetail { user = null };
        Assert.That(detail.display_email, Is.EqualTo(""));
    }

    // ── is_leader ─────────────────────────────────────────────────────────────

    [Test]
    public void IsLeader_True_WhenUserIdEqualsLeaderId()
    {
        var detail = new ClanMemberDetail { user_id = 5, leader_id = 5 };
        Assert.That(detail.is_leader, Is.True);
    }

    [Test]
    public void IsLeader_False_WhenUserIdDiffersFromLeaderId()
    {
        var detail = new ClanMemberDetail { user_id = 3, leader_id = 5 };
        Assert.That(detail.is_leader, Is.False);
    }

    // ── role_label ────────────────────────────────────────────────────────────

    [Test]
    public void RoleLabel_ReturnsLeaderLabel_WhenIsLeader()
    {
        var detail = new ClanMemberDetail { user_id = 1, leader_id = 1 };
        Assert.That(detail.role_label, Is.EqualTo("👑 Vezető"));
    }

    [Test]
    public void RoleLabel_ReturnsMemberLabel_WhenNotLeader()
    {
        var detail = new ClanMemberDetail { user_id = 2, leader_id = 1 };
        Assert.That(detail.role_label, Is.EqualTo("Tag"));
    }

    // ── alap property-k ───────────────────────────────────────────────────────

    [Test]
    public void Properties_CanBeSet()
    {
        var detail = new ClanMemberDetail
        {
            clan_id = 10,
            user_id = 20,
            joined_at = "2024-01-01T00:00:00Z",
            leader_id = 99
        };
        Assert.That(detail.clan_id, Is.EqualTo(10));
        Assert.That(detail.user_id, Is.EqualTo(20));
        Assert.That(detail.joined_at, Is.EqualTo("2024-01-01T00:00:00Z"));
        Assert.That(detail.leader_id, Is.EqualTo(99));
    }
}

[TestFixture]
public class ClanMemberUserInfoTests
{
    [Test]
    public void Properties_CanBeSet()
    {
        var info = new ClanMemberUserInfo { ID = 5, username = "alice", email = "alice@test.com" };
        Assert.That(info.ID, Is.EqualTo(5));
        Assert.That(info.username, Is.EqualTo("alice"));
        Assert.That(info.email, Is.EqualTo("alice@test.com"));
    }
}