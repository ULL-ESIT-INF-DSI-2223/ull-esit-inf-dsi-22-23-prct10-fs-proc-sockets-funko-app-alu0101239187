import net from "net";
import fs from "fs";
import { Funko } from "../classes/funko.js";
import { ResponseType } from "../types/response-type.js";
import { exit } from "process";

// Creates the collections directory in case it doesn't exists
// Is synchronous because it must be done before starting the server
try {
  fs.accessSync(`funko_collections`);
} catch (access_error) {
  try {
    fs.mkdirSync(`funko_collections`);
  } catch (mkdir_error) {
    console.log("Ha ocurrido un error creando la carpeta de las colecciones");
    exit();
  }
}

net
  .createServer({ allowHalfOpen: true }, (connection) => {
    // Gets messages from the client
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
      whole_data = "";
    });

    // Process messages from the client
    connection.on("request", (message) => {
      console.log("Cliente conectado");

      if (message.type === "add") {
        fs.access(
          `funko_collections/${message.user}/${message.funko._id}.json`,
          (error) => {
            if (error) {
              fs.access(`funko_collections/${message.user}`, function (error) {
                if (error) {
                  fs.mkdir(`funko_collections/${message.user}`, (error) => {
                    if (error) {
                      const response: ResponseType = {
                        type: "add",
                        success: false,
                      };
                      connection.write(JSON.stringify(response) + "\n");
                      connection.end();
                    } else {
                      fs.writeFile(
                        `funko_collections/${message.user}/${message.funko._id}.json`,
                        JSON.stringify(message.funko, null, 2),
                        (error) => {
                          if (error) {
                            const response: ResponseType = {
                              type: "add",
                              success: false,
                            };
                            connection.write(JSON.stringify(response) + "\n");
                            connection.end();
                          } else {
                            const response: ResponseType = {
                              type: "add",
                              success: true,
                            };
                            connection.write(JSON.stringify(response) + "\n");
                            connection.end();
                          }
                        }
                      );
                    }
                  });
                } else {
                  fs.writeFile(
                    `funko_collections/${message.user}/${message.funko._id}.json`,
                    JSON.stringify(message.funko, null, 2),
                    (error) => {
                      if (error) {
                        const response: ResponseType = {
                          type: "add",
                          success: false,
                        };
                        connection.write(JSON.stringify(response) + "\n");
                        connection.end();
                      } else {
                        const response: ResponseType = {
                          type: "add",
                          success: true,
                        };
                        connection.write(JSON.stringify(response) + "\n");
                        connection.end();
                      }
                    }
                  );
                }
              });
            } else {
              const response: ResponseType = {
                type: "add",
                success: false,
              };
              connection.write(JSON.stringify(response) + "\n");
              connection.end();
            }
          }
        );
      } else if (message.type === "update") {
        fs.access(`funko_collections/${message.user}`, function (error) {
          if (error) {
            const response: ResponseType = {
              type: "update",
              success: false,
            };
            connection.write(JSON.stringify(response) + "\n");
            connection.end();
          } else {
            fs.access(
              `funko_collections/${message.user}/${message.funko._id}.json`,
              (error) => {
                if (error) {
                  const response: ResponseType = {
                    type: "update",
                    success: false,
                  };
                  connection.write(JSON.stringify(response) + "\n");
                  connection.end();
                } else {
                  fs.writeFile(
                    `funko_collections/${message.user}/${message.funko._id}.json`,
                    JSON.stringify(message.funko, null, 2),
                    (error) => {
                      if (error) {
                        const response: ResponseType = {
                          type: "add",
                          success: false,
                        };
                        connection.write(JSON.stringify(response) + "\n");
                        connection.end();
                      } else {
                        const response: ResponseType = {
                          type: "add",
                          success: true,
                        };
                        connection.write(JSON.stringify(response) + "\n");
                        connection.end();
                      }
                    }
                  );
                }
              }
            );
          }
        });
      } else if (message.type === "remove") {
        fs.access(`funko_collections/${message.user}`, function (error) {
          if (error) {
            const response: ResponseType = {
              type: "remove",
              success: false,
            };
            connection.write(JSON.stringify(response) + "\n");
            connection.end();
          } else {
            fs.unlink(
              `funko_collections/${message.user}/${message.id}.json`,
              (error) => {
                if (error) {
                  const response: ResponseType = {
                    type: "remove",
                    success: false,
                  };
                  connection.write(JSON.stringify(response) + "\n");
                  connection.end();
                } else {
                  const response: ResponseType = {
                    type: "remove",
                    success: true,
                  };
                  connection.write(JSON.stringify(response) + "\n");
                  connection.end();
                }
              }
            );
          }
        });
      } else if (message.type === "read") {
        fs.access(`funko_collections/${message.user}`, function (error) {
          if (error) {
            const response: ResponseType = {
              type: "read",
              success: false,
            };
            connection.write(JSON.stringify(response) + "\n");
            connection.end();
          } else {
            fs.readFile(
              `funko_collections/${message.user}/${message.id}.json`,
              (error, data) => {
                if (error) {
                  const response: ResponseType = {
                    type: "read",
                    success: false,
                  };
                  connection.write(JSON.stringify(response) + "\n");
                  connection.end();
                } else {
                  const response: ResponseType = {
                    type: "read",
                    success: true,
                    funkos: [Funko.funkoFromJSON(JSON.parse(data.toString()))],
                  };
                  connection.write(JSON.stringify(response) + "\n");
                  connection.end();
                }
              }
            );
          }
        });
      } else if (message.type === "list") {
        fs.readdir(
          `funko_collections/${message.user}`,
          function (error, files) {
            if (error) {
              const response: ResponseType = {
                type: "list",
                success: false,
              };
              connection.write(JSON.stringify(response) + "\n");
              connection.end();
            } else {
              files.forEach((file, index) => {
                fs.readFile(
                  `funko_collections/${message.user}/${file}`,
                  (_, data) => {
                    connection.emit(
                      "read_funko",
                      Funko.funkoFromJSON(JSON.parse(data.toString()))
                    );
                    if (index === files.length - 1) {
                      connection.emit("send_funkos");
                    }
                  }
                );
              });
            }
          }
        );
      }
    });

    // Saves a Funko in an array to send them
    let funkos: Funko[] = [];
    connection.on("read_funko", (funko) => {
      funkos.push(funko);
    });

    // Sends the Funko array to the client
    connection.on("send_funkos", () => {
      const response: ResponseType = {
        type: "list",
        success: true,
        funkos: funkos,
      };
      connection.write(JSON.stringify(response) + "\n");
      connection.end();
      funkos = [];
    });

    // Shows a message whenever a client disconnects
    connection.on("close", () => {
      console.log("Cliente desconectado");
    });
  })
  .listen(60301, () => {
    console.log("Servidor iniciado");
  });
