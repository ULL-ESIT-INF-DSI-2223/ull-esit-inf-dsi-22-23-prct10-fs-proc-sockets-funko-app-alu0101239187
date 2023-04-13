import "mocha";
import { expect } from "chai";
import { EventEmitter } from "events";
import { MessageEventEmitterClient } from "../../src/ejercicio-pe103/message-event-emiter-client.js";

describe("MessageEventEmitterClient", () => {
  it("If message is successful it has the result", (done) => {
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

  it("If message is not successful it doesn't have the result", (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on("message", (message) => {
      expect(message).to.be.eql({
        success: false,
      });
      done();
    });

    socket.emit("data", '{"success": false}');
    socket.emit("data", "\n");
  });
});
