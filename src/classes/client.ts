import express, { Response } from "express";

export default class Client {
  public id: string;
  public response: Response;

  constructor(id: string, response: Response) {
    this.id = id;
    this.response = response;
  }
}
