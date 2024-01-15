import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { rootRouter } from "./routers";
import { httpRequestLogger } from "./handlers/request.handler";
import { errorHandler } from "./handlers/error.handler";
import { passport } from "./plugins/passport";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(passport.initialize());

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use(httpRequestLogger());

app.use("/api", rootRouter);

app.use(errorHandler);

http.createServer(app).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
