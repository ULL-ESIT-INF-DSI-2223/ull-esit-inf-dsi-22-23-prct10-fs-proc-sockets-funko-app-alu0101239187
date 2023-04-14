import "mocha";
import { expect } from "chai";
import { EventEmitter } from "events";
import { MessageEventEmitterClient } from "../../../src/ejercicio-3/client/message-event-emitter-client.js";
import { ResponseType } from "../../../src/ejercicio-3/types/response-type.js";
import { Funko } from "../../../src/ejercicio-3/classes/funko.js";
import { FunkoTypes } from "../../../src/ejercicio-3/enums/funko_types.js";
import { FunkoGenres } from "../../../src/ejercicio-3/enums/funko_genres.js";

describe("MessageEventEmitterClient", () => {
  it("Message by parts", (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on("message", (message) => {
      expect(message).to.be.eql({
        success: true,
        result: "Lorem Ipsum",
      });
      done();
    });

    socket.emit("data", '{"success": true');
    socket.emit("data", ', "result": "Lorem Ipsum"}');
    socket.emit("data", "\n");
  });

  it("Message of type add", (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);
    const message: ResponseType = {
      type: "add",
      success: true,
    };

    client.on("message", (message) => {
      expect(message).to.be.eql({
        type: "add",
        success: true,
      });
      done();
    });

    socket.emit("data", JSON.stringify(message) + "\n");
  });

  it("Message of type update", (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);
    const message: ResponseType = {
      type: "update",
      success: false,
    };

    client.on("message", (message) => {
      expect(message).to.be.eql({
        type: "update",
        success: false,
      });
      done();
    });

    socket.emit("data", JSON.stringify(message) + "\n");
  });

  it("Message of type remove", (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);
    const message: ResponseType = {
      type: "remove",
      success: true,
    };

    client.on("message", (message) => {
      expect(message).to.be.eql({
        type: "remove",
        success: true,
      });
      done();
    });

    socket.emit("data", JSON.stringify(message) + "\n");
  });

  it("Message of type read", (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);
    const funko: Funko = new Funko(
      1,
      "Classic Sonic",
      "El mejor Funko de Sonic",
      FunkoTypes.VYNIL_GOLD,
      FunkoGenres.VIDEOGAMES,
      "Sonic The Hedgehog",
      1,
      true,
      "",
      50.99
    );
    const message: ResponseType = {
      type: "read",
      success: true,
      funkos: [funko],
    };

    client.on("message", (message) => {
      expect(message).to.be.eql({
        type: "read",
        success: true,
        funkos: [funko],
      });
      done();
    });

    socket.emit("data", JSON.stringify(message) + "\n");
  });

  it("Message of type list", (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);
    const message: ResponseType = {
      type: "list",
      success: false,
      funkos: [],
    };

    client.on("message", (message) => {
      expect(message).to.be.eql({
        type: "list",
        success: false,
        funkos: [],
      });
      done();
    });

    socket.emit("data", JSON.stringify(message) + "\n");
  });
});
