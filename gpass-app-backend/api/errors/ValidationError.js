const AppError = require("./AppError");

// Bemeneti validációs hiba — pl. hiányzó kötelező mező, rossz formátum.
// 400 Bad Request a helyes HTTP kód, nem 403 Forbidden.
class ValidationError extends AppError
{
    constructor(message = "Validation error occured", options = {})
    {
        super(message, { statusCode: 400, ...options });
    }
}

module.exports = ValidationError;