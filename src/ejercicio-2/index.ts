import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import { spawn } from "child_process";

yargs(hideBin(process.argv))
  .command(
    "pipe",
    "Ejecuta wc utilizando una pipe",
    {
      file: {
        description: "Fichero",
        type: "string",
        demandOption: true,
      },
      lines: {
        description: "Mostrar número de líneas",
      },
      words: {
        description: "Mostrar número de palabras",
      },
      characters: {
        description: "Mostrar número de caracteres",
      },
    },
    (argv) => {
      const wc_params: string[] = [];
      if (argv.lines) {
        wc_params.push("-l");
      }
      if (argv.words) {
        wc_params.push("-w");
      }
      if (argv.characters) {
        wc_params.push("-c");
      }
      wc_params.push(argv.file);

      const wc = spawn("wc", wc_params);
      wc.stdout.pipe(process.stdout);
      wc.stderr.pipe(process.stderr);
    }
  )
  .command(
    "no-pipe",
    "Ejecuta wc sin utilizar una pipe",
    {
      file: {
        description: "Fichero",
        type: "string",
        demandOption: true,
      },
      lines: {
        description: "Mostrar número de líneas",
      },
      words: {
        description: "Mostrar número de palabras",
      },
      characters: {
        description: "Mostrar número de caracteres",
      },
    },
    (argv) => {
      const wc = spawn("wc", [argv.file]);
      let wc_output = "";
      wc.stdout.on("data", (piece) => (wc_output += piece));

      wc.on("close", (error) => {
        if (error) {
          console.log(
            chalk.red("Ha ocurrido un error al ejecutar el comando wc\n")
          );
        } else {
          const wc_output_array = wc_output.split(/\s+/);
          let output = "";
          if (argv.lines) {
            output += `El fichero ${argv.file} tiene ${
              +wc_output_array[1] + 1
            } líneas\n`;
          }
          if (argv._) {
            console.log(argv.$0);
          }
          if (argv.words) {
            output += `El fichero ${argv.file} tiene ${wc_output_array[2]} palabras\n`;
          }
          if (argv.characters) {
            output += `El fichero ${argv.file} tiene ${wc_output_array[3]} caracteres\n`;
          }
          if (output === "") {
            output =
              `El fichero ${argv.file} tiene ${
                +wc_output_array[1] + 1
              } líneas\n` +
              `El fichero ${argv.file} tiene ${wc_output_array[2]} palabras\n` +
              `El fichero ${argv.file} tiene ${wc_output_array[3]} caracteres\n`;
          }
          console.log(chalk.white(output));
        }
      });
    }
  )
  .strict(true).argv;
