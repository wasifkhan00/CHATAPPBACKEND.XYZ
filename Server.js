const express = require("express");
const auth = require("./auth/auth");
const ServersPORT = process.env.PORT || 3008;
const app = express();
const http = require("http");
const server = http.createServer(app);
const routes = require("./routes/routes");
const cors = require("cors");
const connectToDB = require("./db/db");
const dotenv = require("dotenv");
const socketSetup = require("./websocket/websocket");
const errorHandler = require("./middleware/errorHandler");
const colors = require("./helpers/colorCodes");
const helmet = require("helmet");
const { sendOTPEmail } = require("./helpers/emailHelper");
const generateOTP = require("./helpers/generateEmailOTP");

app.use(helmet());



app.disable("x-powered-by");

dotenv.config({ path: __dirname + "/.env" });

const dbConnectionURI = process.env.DB_CONNECTION_STRING; //
const corsOptions = {
  origin: "https://snaptext.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", routes);
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use(errorHandler);

const serverStart = async (dataBaseConnectionUri) => {
  await connectToDB(dataBaseConnectionUri);
  socketSetup(server);

  server.listen(ServersPORT, () => {
    console.log(
      colors.yellow,
      `Your Server & Socket is Running on ${ServersPORT}`
    );
  });
};

serverStart(dbConnectionURI);
