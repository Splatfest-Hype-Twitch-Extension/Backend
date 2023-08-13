import express, { NextFunction, Request, Response, Router } from "express";
import router from "./routes/router";
import cors from "cors";

const app = express();
const port = 80;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let channelWhitelist: Array<string> = ["179697954"];

app.use("/:channelid", (req: Request, res: Response, next: NextFunction) => {
  const channelid: string = req.params.channelid;

  if (!channelWhitelist.includes(channelid)) {
    res.status(404).send("Channel not found");
    return;
  }

  next();
});

app.use("/:channelid", router);

app.listen(port);
