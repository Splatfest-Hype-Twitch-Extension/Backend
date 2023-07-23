import Client from "./client";

export default class Channel {
  channelid: string;
  clients: Array<Client>;
  counter: number;

  constructor(channelid: string) {
    this.channelid = channelid;
    this.clients = [];
    this.counter = 0;
  }

  addClient(client: Client) {
    this.clients.push(client);
  }

  removeClient(clientId: string) {
    this.clients = this.clients.filter(client => client.id !== clientId);
  }

  click(clickcount: number) {
    this.counter += clickcount;

    this.clients.forEach(client => {
      client.response.write(`data: ${JSON.stringify({ counter: this.counter })}\n\n`);
    });
  }

  reset() {
    this.counter = 0;

    this.clients.forEach(client => {
      client.response.write(`data: ${JSON.stringify({ counter: this.counter })}\n\n`);
    });
  }
}
