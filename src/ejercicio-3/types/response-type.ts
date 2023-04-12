import { Funko } from "../classes/funko.js";

export type ResponseType = {
  type: "add" | "update" | "remove" | "read" | "list";
  success: boolean;
  funkos?: Funko[];
};
