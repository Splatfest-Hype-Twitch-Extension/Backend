import express, { NextFunction, Request, Response, Router } from "express";
import LongpullClient from "../classes/client";
import Channel from "../classes/channel";

const router = express.Router();

let channels: Array<Channel> = [];

function eventsHandler(req: Request, res: Response, next: NextFunction) {
  const channelid: string = req.params.channelid;

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);

  const clientId = Date.now().toString();

  const newClient = new LongpullClient(clientId, res);

  if (!channels.some(channel => channel.channelid === channelid)) {
    var newChannel = new Channel(channelid);
    newChannel.addClient(newClient);
    channels.push(newChannel);

    const data = `data: ${JSON.stringify({ counter: 0 })}\n\n`;
    res.write(data);
  } else {
    var channel = channels.find(channel => channel.channelid === channelid);
    if (!channel) return;

    const data = `data: ${JSON.stringify({ counter: channel.counter })}\n\n`;
    res.write(data);

    channel.addClient(newClient);
  }

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);

    var channel = channels.find(channel => channel.channelid === channelid);
    if (!channel) return;
    channel.removeClient(clientId);

    if (channel.clients.length === 0) {
      channels = channels.filter(channel => channel.channelid !== channelid);
    }
  });
}

router.get("/subscribe", eventsHandler);

router.post("/click", (req: Request, res: Response) => {
  const channelid: string = req.params.channelid;
  var clickcount = req.body.clickcount;

  if (!clickcount || isNaN(clickcount)) {
    res.status(400).send("Invalid request");
    return;
  }

  if (clickcount < 0) {
    res.status(400).send("clickcount should be positive");
    return;
  }

  var channel = channels.find(channel => channel.channelid === channelid);
  if (!channel) return res.status(404).send("Channel not found");

  res.status(200).send();

  channel.click(clickcount);

  channel.clients.forEach(client => {
    client.response.write(`data: ${JSON.stringify({ counter: channel?.counter })}\n\n`);
  });
});

router.post("/reset", (req: Request, res: Response) => {
  var clickcount = req.body.clickcount;
  const channelid: string = req.params.channelid;

  if (!clickcount || isNaN(clickcount)) {
    res.status(400).send("Invalid request");
    return;
  }

  if (clickcount < 0) {
    res.status(400).send("clickcount should be positive");
    return;
  }

  var channel = channels.find(channel => channel.channelid === channelid);
  if (!channel) return res.status(404).send("Channel not found");

  res.status(200).send();

  channel.reset();

  channel.clients.forEach(client => {
    client.response.write(`data: ${JSON.stringify({ counter: channel?.counter })}\n\n`);
  });
});

export default router;
