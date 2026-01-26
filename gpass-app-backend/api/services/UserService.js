const { BadRequestError, NotFoundError } = require("../errors");

class UserService {
    constructor(db) {
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUsers() {
        return await this.userRepository.getUsers();
    }

    async getUser(userID) {
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID) a kérésből.");

        const user = await this.userRepository.getUser(userID);

        if (!user) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.",
            {
                data: userID
            });

        return user;
    }

    async getUserForAuth(userID) {
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID) a kérésből.");

        const user = await this.userRepository.getUserForAuth(userID);

        if (!user) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.",
            {
                data: userID
            });

        return user;
    }

    async createUser(userData) {
        if (!userData) throw new BadRequestError("Hiányzik a felhasználó adata (payload).", { data: userData });
        if (!userData.username) throw new BadRequestError("Hiányzik a felhasználónév (username).", { data: userData });
        if (!userData.password) throw new BadRequestError("Hiányzik a jelszó (password).", { data: userData });
        if (!userData.email) throw new BadRequestError("Hiányzik az email cím (email).", { data: userData });

        // Foglaltság ellenőrzés
        const usernameTaken = await this.userRepository.getUser(userData.username);
        if (usernameTaken) throw new BadRequestError("Ez a felhasználónév már foglalt.",
            {
                data: userData.username
            });

        const emailTaken = await this.userRepository.getUser(userData.email);
        if (emailTaken) throw new BadRequestError("Ez az email cím már foglalt.",
            {
                data: userData.email
            });

        return await this.userRepository.createUser(userData);
    }

    async searchUsers(query) {
        if (!query) throw new BadRequestError("Hiányzik a keresési kifejezés (query).");

        return await this.userRepository.searchUsers(query);
    }

    async updateUser(userData, userID) {
        if (!userData) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data: userData });
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID).", { data: userID });

        const exists = await this.userRepository.getUser(userID);
        if (!exists) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        // opcionális foglaltság ellenőrzés update-nél (csak ha változik)
        if (userData.username && userData.username !== exists.username) {
            const taken = await this.userRepository.getUser(userData.username);
            if (taken) throw new BadRequestError("Ez a felhasználónév már foglalt.", { data: userData.username });
        }

        if (userData.email && userData.email !== exists.email) {
            const taken = await this.userRepository.getUser(userData.email);
            if (taken) throw new BadRequestError("Ez az email cím már foglalt.", { data: userData.email });
        }

        const updated = await this.userRepository.updateUser(userData, userID);

        if (!updated) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        return updated;
    }

    async deleteUser(userID) {
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID).", { data: userID });

        const exists = await this.userRepository.getUser(userID);
        if (!exists) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        const deletedCount = await this.userRepository.deleteUser(userID);

        if (!deletedCount) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        return deletedCount; // destroy() száma
    }

}

module.exports = UserService;
