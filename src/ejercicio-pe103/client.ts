import chalk from "chalk";
import net from "net";
import { RequestType } from "./types/request-type.js";
import { MessageEventEmitterClient } from "./message-event-emiter-client.js";

if (process.argv.length < 3) {
  console.log("Por favor, introduzca un comando con sus argumentos");
} else {
  const socket = net.connect({ port: 60301 });
  const client = new MessageEventEmitterClient(socket);
  const request: RequestType = {
    command: process.argv[2],
    args: process.argv.slice(3, process.argv.length),
  };
  socket.write(JSON.stringify(request) + "\n");

  client.on("message", (message) => {
    if (message.success) {
      console.log(chalk.white(`Resultado del comando:\n\n${message.result}`));
    } else {
      console.log(chalk.red("Ha ocurrido un error ejecutando el comando"));
    }
  });
}
