const { BadRequestError, NotFoundError } = require("../errors");

class UserService {
    constructor(db) {
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUsers(options = {}) {
        return await this.userRepository.getUsers(options);
    }

    async getUser(userID, options = {}) {
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID) a kérésből.");

        const user = await this.userRepository.getUser(userID, options);

        if (!user) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.",
            {
                data: userID
            });

        return user;
    }

    async getUserForAuth(userID, options = {}) {
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID) a kérésből.");

        const user = await this.userRepository.getUserForAuth(userID, options);

        if (!user) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.",
            {
                data: userID
            });

        return user;
    }

    async createUser(userData, options = {}) {
        if (!userData) throw new BadRequestError("Hiányzik a felhasználó adata (payload).", { data: userData });
        if (!userData.username) throw new BadRequestError("Hiányzik a felhasználónév (username).", { data: userData });
        if (!userData.password) throw new BadRequestError("Hiányzik a jelszó (password).", { data: userData });
        if (!userData.email) throw new BadRequestError("Hiányzik az email cím (email).", { data: userData });

        // Foglaltság ellenőrzés
        const usernameTaken = await this.userRepository.getUser(userData.username, options);
        if (usernameTaken) throw new BadRequestError("Ez a felhasználónév már foglalt.",
            {
                data: userData.username
            });

        const emailTaken = await this.userRepository.getUser(userData.email, options);
        if (emailTaken) throw new BadRequestError("Ez az email cím már foglalt.",
            {
                data: userData.email
            });

        return await this.userRepository.createUser(userData, options);
    }

    async searchUsers(query, options = {}) {
        if (!query) throw new BadRequestError("Hiányzik a keresési kifejezés (query).");

        return await this.userRepository.searchUsers(query, options);
    }

    async updateUser(userData, userID, options = {}) {
        if (!userData) throw new BadRequestError("Hiányzik a módosításhoz szükséges adat (payload).", { data: userData });
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID).", { data: userID });

        const exists = await this.userRepository.getUser(userID, options);
        if (!exists) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        // opcionális foglaltság ellenőrzés update-nél (csak ha változik)
        if (userData.username && userData.username !== exists.username) {
            const taken = await this.userRepository.getUser(userData.username, options);
            if (taken) throw new BadRequestError("Ez a felhasználónév már foglalt.", { data: userData.username });
        }

        if (userData.email && userData.email !== exists.email) {
            const taken = await this.userRepository.getUser(userData.email, options);
            if (taken) throw new BadRequestError("Ez az email cím már foglalt.", { data: userData.email });
        }

        const updated = await this.userRepository.updateUser(userData, userID, options);

        if (!updated) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        return updated;
    }

    async deleteUser(userID, options = {}) {
        if (!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID).", { data: userID });

        const exists = await this.userRepository.getUser(userID, options);
        if (!exists) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        const deletedCount = await this.userRepository.deleteUser(userID, options);

        if (!deletedCount) throw new NotFoundError("Nem található felhasználó ezzel az azonosítóval.", { data: userID });

        return deletedCount; // destroy() száma
    }

    async updateUserLocation(userID, latitude, longitude, options = {}) {

        if (!latitude || !longitude) {
            throw new Error("Hiányzó koordináták");
        }

        return await this.userRepository.updateLocation(
            userID,
            latitude,
            longitude,
            options
        );
    }

    async getUserLocation(userID, options = {}) {

        if(!userID) throw new BadRequestError("Hiányzik a felhasználó azonosító (userID).", { data: userID });

        return await this.userRepository.getUserLocation(userID, options);
    }

}

module.exports = UserService;
