const { DbError } = require("../errors");

const { Op } = require("sequelize");

class UserRepository
{
    constructor(db)
    {
        this.User = db.User;

        this.sequelize = db.sequelize;
    }

    async getUsers()
    {
        try
        {
            return await this.User.scope(["public"]).findAll();
        }
        catch(error)
        {
            throw new DbError("Failed to fetch users", 
            {
                details: error.message,
            });
        }
    }

    async getUser(userID)
    {
        try
        {
            return await this.User.scope(["public"]).findOne(
            {
                where:
                {
                    [Op.or]: [ { ID: userID }, { name: userID }, { email: userID } ],
                }
            });
        }
        catch(error)
        {
            throw new DbError("Failed to fetch user", 
            {
                details: error.message,
                data: userID,
            });
        }
    }

    async createUser(userData)
    {
        try
        {
            return await this.User.create(userData);
        }
        catch(error)
        {
            throw new DbError("Failed to create user object", 
            {
               details: error.message,
               data: userData, 
            });
        }
    }

    async deleteUser(userID)
    {
        try
        {
            return await this.User.destroy(
            {
                where:
                {
                    [Op.or]: [ { ID: userID }, { name: userID }, { email: userID } ],
                }
            });
        }
        catch(error)
        {
            throw new DbError("Failed to delete user from database", { details: error.sqlMessage, data: { userID } });
        }
    }

    async updateUser(userData, userID = userData.ID)
    {
        try
        {
            return await this.User.update({ ...userData }, 
            {
                where:
                {
                    ID: userID,
                }
            })
        }
        catch(error)
        {
            throw new DbError("Failed to update user", { details: error.message, data: { userData } });
        }
    }
}

module.exports = UserRepository;