import path from "path";
import fs from "fs";

const contractPath = path.resolve(__dirname, "abi.json");
const contractJson = fs.readFileSync(contractPath);
console.log(contractJson.toJSON());
