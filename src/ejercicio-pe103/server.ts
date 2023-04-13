import net from "net";
import { spawn } from "child_process";
import { ResponseType } from "./types/response-type.js";

net
  .createServer({ allowHalfOpen: true }, (connection) => {
    let whole_data = "";
    connection.on("data", (data_chunk) => {
      whole_data += data_chunk;
      let messageLimit = whole_data.indexOf("\n");
      let message = "";

      while (messageLimit !== -1) {
        message = whole_data.substring(0, messageLimit);
        whole_data = whole_data.substring(messageLimit + 1);
        messageLimit = whole_data.indexOf("\n");
      }
      connection.emit("request", JSON.parse(message));
    });

    connection.on("request", (message) => {
      console.log("Cliente conectado");

      const command = spawn(message.command, message.args);
      command.on("error", () => {
        const response: ResponseType = {
          success: false,
        };
        connection.write(JSON.stringify(response) + "\n");
        connection.end();
      });

      let command_output = "";
      command.stdout.on("data", (piece) => {
        command_output += piece;
      });
      command.on("close", () => {
        const response: ResponseType = {
          success: true,
          result: command_output,
        };
        connection.write(JSON.stringify(response) + "\n");
        connection.end();
      });
      command.stderr.on("data", () => {
        const response: ResponseType = {
          success: false,
        };
        connection.write(JSON.stringify(response) + "\n");
        connection.end();
      });
    });

    connection.on("close", () => {
      console.log("Cliente desconectado");
    });
  })
  .listen(60301, () => {
    console.log("Servidor iniciado");
  });
