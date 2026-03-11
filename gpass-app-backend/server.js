require("dotenv").config({ path: "", quiet: true });

const http = require("http");
const app = require("./app");
const { initMapSocket } = require("./socket/mapSocket");

const PORT = process.env.PORT ?? 8000;

const httpServer = http.createServer(app);

initMapSocket(httpServer, [
  "http://localhost:3000",
  "http://localhost:4173",
  "http://gpass.site",
  "https://gpass.site",
]);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
