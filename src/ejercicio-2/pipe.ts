import { watchFile } from "fs";
import { spawn } from "child_process";

watchFile("helloworld.txt", (curr, prev) => {
  console.log(`File was ${prev.size} bytes before it was modified.`);
  console.log(`Now file is ${curr.size} bytes.`);

  const wc = spawn("wc", ["-l", "helloworld.txt"]);

  wc.stdout.pipe(process.stdout);
});
