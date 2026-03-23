using gpass_app_wpf.Models;
using gpass_app_wpf.ViewModels;

namespace gpass_app_wpf_tests.tests.ViewModels;

/// <summary>
/// Tesztek a ClanMembersViewModel szinkron logikájához.
/// A konstruktor fire-and-forget LoadMembers() hívást indít (API nélkül hibázik, de elnyeli),
/// ezért a szinkron property-k és validációk biztonságosan tesztelhetők.
/// </summary>
[TestFixture]
[Apartment(ApartmentState.STA)]
public class ClanMembersViewModelTests
{
    private static ClanWithMembers MakeClan(
        int id = 1, string name = "TestClan", string description = "Desc",
        int leaderId = 10, string leaderName = "Boss")
        => new ClanWithMembers
        {
            id = id,
            name = name,
            description = description,
            leader_id = leaderId,
            created_at = "2024-01-01T00:00:00Z",
            member_count = 2,
            leader = new ClanLeaderInfo { username = leaderName }
        };

    // ── Title ─────────────────────────────────────────────────────────────────

    [Test]
    public void Title_ContainsClanName()
    {
        var vm = new ClanMembersViewModel(MakeClan(name: "EliteClan"));
        Assert.That(vm.Title, Does.Contain("EliteClan"));
    }

    // ── ClanInfo ──────────────────────────────────────────────────────────────

    [Test]
    public void ClanInfo_ContainsClanId()
    {
        var vm = new ClanMembersViewModel(MakeClan(id: 42));
        Assert.That(vm.ClanInfo, Does.Contain("42"));
    }

    [Test]
    public void ClanInfo_ContainsLeaderName()
    {
        var vm = new ClanMembersViewModel(MakeClan(leaderName: "VezérPista"));
        Assert.That(vm.ClanInfo, Does.Contain("VezérPista"));
    }

    // ── Prefill-elt mezők ─────────────────────────────────────────────────────

    [Test]
    public void ClanName_InitializedFromClan()
    {
        var vm = new ClanMembersViewModel(MakeClan(name: "AlphaClan"));
        Assert.That(vm.ClanName, Is.EqualTo("AlphaClan"));
    }

    [Test]
    public void ClanDescription_InitializedFromClan()
    {
        var vm = new ClanMembersViewModel(MakeClan(description: "Leírás"));
        Assert.That(vm.ClanDescription, Is.EqualTo("Leírás"));
    }

    // ── Klán név validáció ────────────────────────────────────────────────────

    [Test]
    public void ClanNameError_SetWhenEmpty()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanName = "";
        Assert.That(vm.HasClanNameError, Is.True);
    }

    [Test]
    public void ClanNameError_SetWhenTooShort()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanName = "ab"; // 2 karakter
        Assert.That(vm.HasClanNameError, Is.True);
        Assert.That(vm.ClanNameError, Does.Contain("3"));
    }

    [Test]
    public void ClanNameError_SetWhenTooLong()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanName = new string('z', 41);
        Assert.That(vm.HasClanNameError, Is.True);
        Assert.That(vm.ClanNameError, Does.Contain("40"));
    }

    [Test]
    public void ClanNameError_ClearedWhenValid()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanName = "";          // hibás
        vm.ClanName = "ValidName"; // helyes
        Assert.That(vm.HasClanNameError, Is.False);
    }

    // ── Leírás validáció ──────────────────────────────────────────────────────

    [Test]
    public void ClanDescriptionError_SetWhenOver200Chars()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanDescription = new string('x', 201);
        Assert.That(vm.HasClanDescriptionError, Is.True);
        Assert.That(vm.ClanDescriptionError, Does.Contain("200"));
    }

    [Test]
    public void ClanDescriptionError_NotSet_WhenExactly200Chars()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanDescription = new string('x', 200);
        Assert.That(vm.HasClanDescriptionError, Is.False);
    }

    [Test]
    public void ClanDescriptionError_NotSet_WhenEmpty()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanDescription = "";
        Assert.That(vm.HasClanDescriptionError, Is.False);
    }

    // ── NameSaveResult ────────────────────────────────────────────────────────

    [Test]
    public void NameSaveResult_DefaultIsNull()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        Assert.That(vm.HasNameSaveResult, Is.False);
    }

    [Test]
    public void NameSaveIsError_TrueWhenResultStartsWithWarning()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.NameSaveResult = "⚠ Valami hiba";
        Assert.That(vm.NameSaveIsError, Is.True);
    }

    [Test]
    public void NameSaveIsError_FalseWhenResultIsSuccess()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.NameSaveResult = "✔ Sikeresen mentve!";
        Assert.That(vm.NameSaveIsError, Is.False);
    }

    // ── UserToAdd ─────────────────────────────────────────────────────────────

    [Test]
    public void HasUserToAdd_FalseByDefault()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        Assert.That(vm.HasUserToAdd, Is.False);
    }

    [Test]
    public void UserToAddText_EmptyByDefault()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        Assert.That(vm.UserToAddText, Is.EqualTo(""));
    }

    [Test]
    public void HasUserToAdd_TrueWhenUserSet()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.UserToAdd = new User { ID = 3, username = "newguy", email = "n@g.com" };
        Assert.That(vm.HasUserToAdd, Is.True);
    }

    [Test]
    public void UserToAddText_ContainsUsernameAndEmail()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.UserToAdd = new User { ID = 3, username = "newguy", email = "n@g.com" };
        Assert.That(vm.UserToAddText, Does.Contain("newguy"));
        Assert.That(vm.UserToAddText, Does.Contain("n@g.com"));
    }

    // ── ErrorMessage ──────────────────────────────────────────────────────────

    [Test]
    public void HasError_FalseByDefault()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        Assert.That(vm.HasError, Is.False);
    }

    [Test]
    public void DismissErrorCommand_ClearsError()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ErrorMessage = "Hiba";
        vm.DismissErrorCommand.Execute(null);
        Assert.That(vm.HasError, Is.False);
    }

    // ── SaveNameCommand CanExecute ─────────────────────────────────────────────

    [Test]
    public void SaveNameCommand_CanExecute_WhenNoErrors()
    {
        var vm = new ClanMembersViewModel(MakeClan(name: "Valid"));
        // Nincs hiba, nincs mentés folyamatban
        Assert.That(vm.SaveNameCommand.CanExecute(null), Is.True);
    }

    [Test]
    public void SaveNameCommand_CannotExecute_WhenNameHasError()
    {
        var vm = new ClanMembersViewModel(MakeClan());
        vm.ClanName = ""; // hibás
        Assert.That(vm.SaveNameCommand.CanExecute(null), Is.False);
    }
}