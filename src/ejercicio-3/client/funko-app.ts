import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Funko } from "../classes/funko.js";
import net from "net";
import { RequestType } from "../types/request-type.js";
import { MessageEventEmitterClient } from "./message-event-emitter-client.js";

const socket = net.connect({ port: 60301 });
const client = new MessageEventEmitterClient(socket);
let user: string;

/**
 * Process the messages from the server
 */
client.on("message", (message) => {
  if (message.type === "add") {
    if (message.success) {
      console.log(chalk.green(`Funko añadido a la colección de ${user}`));
    } else {
      console.log(
        chalk.red(
          `Ha ocurrido un error intentando añadir el Funko a la colección de ${user}`
        )
      );
    }
  } else if (message.type === "update") {
    if (message.success) {
      console.log(chalk.green(`Funko actualizado en la colección de ${user}`));
    } else {
      console.log(
        chalk.red(
          `Ha ocurrido un error intentando actualizar el Funko de la colección de ${user}`
        )
      );
    }
  } else if (message.type === "remove") {
    if (message.success) {
      console.log(chalk.green(`Funko eliminado de la colección de ${user}`));
    } else {
      console.log(
        chalk.red(
          `Ha ocurrido un error intentando eliminar el Funko de la colección de ${user}`
        )
      );
    }
  } else if (message.type === "read") {
    if (message.success) {
      printFunko(Funko.funkoFromJSON(message.funkos[0]));
    } else {
      console.log(
        chalk.red(
          `Ha ocurrido un error intentando leer el Funko de la colección de ${user}`
        )
      );
    }
  } else if (message.type === "list") {
    if (message.success) {
      for (let index = 0; index < message.funkos.length; index++) {
        printFunko(Funko.funkoFromJSON(message.funkos[index]));
        console.log(chalk.white("--------------------------------"));
      }
    } else {
      console.log(
        chalk.red(
          `Ha ocurrido un error intentando listar los Funkos de la colección de ${user}`
        )
      );
    }
  }
});

yargs(hideBin(process.argv))
  .command(
    "add",
    "Añade un Funko",
    {
      user: {
        description: "Usuario",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "ID",
        type: "number",
        demandOption: true,
      },
      name: {
        description: "Nombre",
        type: "string",
        demandOption: true,
      },
      description: {
        description: "Descripción",
        type: "string",
        demandOption: true,
      },
      type: {
        description: "Tipo",
        type: "string",
        demandOption: true,
      },
      genre: {
        description: "Género",
        type: "string",
        demandOption: true,
      },
      franchise: {
        description: "Franquicia",
        type: "string",
        demandOption: true,
      },
      number: {
        description: "Número",
        type: "number",
        demandOption: true,
      },
      exclusive: {
        description: "Exclusivo",
        type: "boolean",
        demandOption: true,
      },
      characteristics: {
        description: "Características especiales",
        type: "string",
      },
      value: {
        description: "Valor de mercado",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      user = argv.user;
      if (argv.characteristics !== undefined) {
        const params: string[] = [
          "" + argv.id,
          argv.name.replace(/[\n,]/g, ""),
          argv.description.replace(/[\n,]/g, ""),
          argv.type.replace(/[\n,]/g, ""),
          argv.genre.replace(/[\n,]/g, ""),
          argv.franchise.replace(/[\n,]/g, ""),
          "" + argv.number,
          "" + argv.exclusive,
          argv.characteristics.replace(/[\n,]/g, ""),
          "" + argv.value,
        ];
        const request: RequestType = {
          type: "add",
          user: user,
          funko: Funko.instanceFromParams(params),
        };
        socket.write(JSON.stringify(request) + "\n");
      } else {
        const params: string[] = [
          "" + argv.id,
          argv.name.replace(/[\n,]/g, ""),
          argv.description.replace(/[\n,]/g, ""),
          argv.type.replace(/[\n,]/g, ""),
          argv.genre.replace(/[\n,]/g, ""),
          argv.franchise.replace(/[\n,]/g, ""),
          "" + argv.number,
          "" + argv.exclusive,
          "",
          "" + argv.value,
        ];
        const request: RequestType = {
          type: "add",
          user: user,
          funko: Funko.instanceFromParams(params),
        };
        socket.write(JSON.stringify(request) + "\n");
      }
    }
  )
  .command(
    "update",
    "Actualiza un Funko",
    {
      user: {
        description: "Usuario",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "ID",
        type: "number",
        demandOption: true,
      },
      name: {
        description: "Nombre",
        type: "string",
        demandOption: true,
      },
      description: {
        description: "Descripción",
        type: "string",
        demandOption: true,
      },
      type: {
        description: "Tipo",
        type: "string",
        demandOption: true,
      },
      genre: {
        description: "Género",
        type: "string",
        demandOption: true,
      },
      franchise: {
        description: "Franquicia",
        type: "string",
        demandOption: true,
      },
      number: {
        description: "Número",
        type: "number",
        demandOption: true,
      },
      exclusive: {
        description: "Exclusivo",
        type: "boolean",
        demandOption: true,
      },
      characteristics: {
        description: "Características especiales",
        type: "string",
      },
      value: {
        description: "Valor de mercado",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      user = argv.user;
      if (argv.characteristics !== undefined) {
        const params: string[] = [
          "" + argv.id,
          argv.name.replace(/[\n,]/g, ""),
          argv.description.replace(/[\n,]/g, ""),
          argv.type.replace(/[\n,]/g, ""),
          argv.genre.replace(/[\n,]/g, ""),
          argv.franchise.replace(/[\n,]/g, ""),
          "" + argv.number,
          "" + argv.exclusive,
          argv.characteristics.replace(/[\n,]/g, ""),
          "" + argv.value,
        ];
        const request: RequestType = {
          type: "add",
          user: user,
          funko: Funko.instanceFromParams(params),
        };
        socket.write(JSON.stringify(request) + "\n");
      } else {
        const params: string[] = [
          "" + argv.id,
          argv.name.replace(/[\n,]/g, ""),
          argv.description.replace(/[\n,]/g, ""),
          argv.type.replace(/[\n,]/g, ""),
          argv.genre.replace(/[\n,]/g, ""),
          argv.franchise.replace(/[\n,]/g, ""),
          "" + argv.number,
          "" + argv.exclusive,
          "",
          "" + argv.value,
        ];
        const request: RequestType = {
          type: "update",
          user: user,
          funko: Funko.instanceFromParams(params),
        };
        socket.write(JSON.stringify(request) + "\n");
      }
    }
  )
  .command(
    "remove",
    "Elimina un Funko",
    {
      user: {
        description: "Usuario",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      user = argv.user;
      const request: RequestType = {
        type: "remove",
        user: user,
        id: argv.id,
      };
      socket.write(JSON.stringify(request) + "\n");
    }
  )
  .command(
    "read",
    "Muestra un Funko",
    {
      user: {
        description: "Usuario",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      user = argv.user;
      const request: RequestType = {
        type: "read",
        user: user,
        id: argv.id,
      };
      socket.write(JSON.stringify(request) + "\n");
    }
  )
  .command(
    "list",
    "Lista los Funkos del usuario",
    {
      user: {
        description: "Usuario",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      user = argv.user;
      const request: RequestType = {
        type: "list",
        user: user,
      };
      socket.write(JSON.stringify(request) + "\n");
    }
  )
  .strict(true)
  .help().argv;

/**
 * Shows the info of a Funko
 * @param funko Funko to show
 */
function printFunko(funko: Funko): void {
  console.log(
    chalk.white(
      `ID: ${funko.id}\nNombre: ${funko.name}\nDescripción: ${funko.description}\nTipo: ${funko.type}\nGénero: ${funko.genre}\nFranquicia: ${funko.franchise}\nNúmero identificativo: ${funko.number}`
    )
  );
  if (funko.exclusive) {
    console.log(chalk.green("Exclusivo"));
  } else {
    console.log(chalk.red("Común"));
  }
  console.log(
    chalk.white(`Características especiales: ${funko.characteristics}`)
  );

  if (funko.value < 15) {
    console.log(
      chalk.white(`Valor de mercado: `) + chalk.red(funko.value.toFixed(2))
    );
  } else if (funko.value < 25) {
    console.log(
      chalk.white(`Valor de mercado: `) + chalk.yellow(funko.value.toFixed(2))
    );
  } else if (funko.value < 40) {
    console.log(
      chalk.white(`Valor de mercado: `) + chalk.green(funko.value.toFixed(2))
    );
  } else {
    console.log(
      chalk.white(`Valor de mercado: `) + chalk.cyan(funko.value.toFixed(2))
    );
  }
}
