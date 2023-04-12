import { Funko } from "../classes/funko.js";

export type RequestType = {
  type: "add" | "update" | "remove" | "read" | "list";
  user: string;
  id?: number;
  funko?: Funko;
};
