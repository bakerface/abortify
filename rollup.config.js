import ts from "@wessberg/rollup-plugin-ts";
import { main, module } from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    { format: "cjs", file: main },
    { format: "es", file: module },
  ],
  plugins: [ts()],
};
