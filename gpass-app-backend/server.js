require("dotenv").config({ path: "",quiet: true });

const app = require("./app");

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {});
