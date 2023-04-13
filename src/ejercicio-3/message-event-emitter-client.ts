import { EventEmitter } from "events";

export class MessageEventEmitterClient extends EventEmitter {
  /**
   * Constructor of the class MessageEventEmitterClient. Emits a *message* event when it catches a whole message from the server.
   * @param connection Connection to the server
   */
  constructor(connection: EventEmitter) {
    super();

    let wholeData = "";
    connection.on("data", (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf("\n");
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit("message", JSON.parse(message));
        messageLimit = wholeData.indexOf("\n");
      }
    });
  }
}
