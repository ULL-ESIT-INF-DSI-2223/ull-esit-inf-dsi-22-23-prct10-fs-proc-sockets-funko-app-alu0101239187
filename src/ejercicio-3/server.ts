import net from "net";
import fs from "fs";
import { FunkoTypes } from "./enums/funko_types.js";
import { FunkoGenres } from "./enums/funko_genres.js";
import { Funko } from "./classes/funko.js";
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
      if (message.type === "add") {
        fs.readFile(
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
            fs.readFile(
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
                    funkos: [funkoFromJSON(JSON.parse(data.toString()))],
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
              const funkos: Funko[] = [];
              for (const file of files) {
                fs.readFile(
                  `funko_collections/${message.user}/${file}`,
                  (_, data) => {
                    funkos.push(funkoFromJSON(JSON.parse(data.toString())));
                  }
                );
              }
              const response: ResponseType = {
                type: "read",
                success: true,
                funkos: funkos,
              };
              console.log(response.funkos);
              connection.write(JSON.stringify(response) + "\n");
              connection.end();
            }
          }
        );
      }
    });

    connection.on("close", () => {
      console.log("Cliente desconectado");
    });
  })
  .listen(60301, () => {
    console.log("Servidor iniciado");
  });

export function funkoFromJSON(data: any): Funko {
  let type: FunkoTypes;
  switch (data._type.toLowerCase()) {
    case "pop!":
      type = FunkoTypes.POP;
      break;
    case "pop! rides":
      type = FunkoTypes.POP_RIDES;
      break;
    case "vynil soda":
      type = FunkoTypes.VYNIL_SODA;
      break;
    case "vynil gold":
      type = FunkoTypes.VYNIL_GOLD;
      break;
    default:
      throw new Error(
        "El tipo del Funko debe ser Pop!, Pop! Rides, Vynil Soda o Vynil Gold"
      );
  }
  let genre: FunkoGenres;
  switch (data._genre.toLowerCase()) {
    case "animación":
      genre = FunkoGenres.ANIMATION;
      break;
    case "anime":
      genre = FunkoGenres.ANIME;
      break;
    case "películas y tv":
      genre = FunkoGenres.MOVIES_AND_TV;
      break;
    case "música":
      genre = FunkoGenres.MUSIC;
      break;
    case "deportes":
      genre = FunkoGenres.SPORTS;
      break;
    case "videojuegos":
      genre = FunkoGenres.VIDEOGAMES;
      break;
    default:
      throw new Error(
        "El género del Funko debe ser Animación, Anime, Películas y TV, Música, Deportes o Videojuegos"
      );
  }
  return new Funko(
    data._id,
    data._name,
    data._description,
    type,
    genre,
    data._franchise,
    data._number,
    data._exclusive,
    data._characteristics,
    data._value
  );
}
