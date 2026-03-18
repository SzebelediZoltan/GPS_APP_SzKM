const { validationResult } = require("express-validator");
const { BadRequestError } = require("../errors");

// Összefogja az express-validator szabályokat egy middleware-láncba.
// Ha bármelyik szabály megbukik, a hibákat egységes BadRequestError-ba csomagolja
// és átadja a központi hibakezelőnek — a controller-nek nem kell foglalkoznia a validációval.
// (ValidationError-t szándékosan nem használjuk, mert az 403-as státuszkódot ad vissza,
// ami "Forbidden"-t jelent — bemeneti hibánál a helyes kód a 400 Bad Request.)
const validate = (rules) => [
    ...rules,
    (req, res, next) =>
    {
        const errors = validationResult(req);

        if (!errors.isEmpty())
        {
            return next(new BadRequestError(
                "Érvénytelen vagy hiányzó adatok a kérésben.",
                {
                    details: errors.array().map(e => ({
                        field: e.path,
                        message: e.msg,
                    })),
                }
            ));
        }

        next();
    },
];

module.exports = validate;
