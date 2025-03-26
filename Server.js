const express = require("express");
const auth = require("./auth/auth");
const ServersPORT = process.env.PORT || 3008;
const app = express();
const http = require("http");
const server = http.createServer(app);
const endpoints = require("./routes/routes");
const cors = require("cors");
const connectToDB = require("./db/db");
const dotenv = require("dotenv");
const socketSetup = require("./websocket/websocket");
const errorHandler = require("./middleware/errorHandler");
const colors = require("./helpers/colorCodes");


dotenv.config({ path: __dirname + "/.env" });

const dbConnectionURI = process.env.DB_CONNECTION_STRING;//
app.use(cors());
app.use(cors({ origin: 'https://snaptext.netlify.app/' }));
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(auth);
app.all("*", endpoints);
app.use(errorHandler);

const serverStart = async (dataBaseConnectionUri) => {
  await connectToDB(dataBaseConnectionUri);
  socketSetup(server);

  server.listen(ServersPORT, () => {
    console.log(colors.yellow,`Your Server & Socket is Running on ${ServersPORT}`);
  });
};

serverStart(dbConnectionURI);
