import { Database } from "bun:sqlite";
import fs from "node:fs";

if (!fs.existsSync("./data")) {
	fs.mkdirSync("./data");
}

export const db = new Database("./data/mydb.sqlite", { create: true });
