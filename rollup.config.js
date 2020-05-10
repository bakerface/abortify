import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";
import externals from "rollup-plugin-node-externals";
import { main, module } from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    { format: "cjs", file: main },
    { format: "es", file: module },
  ],
  external: externals(),
  plugins: [
    resolve(),
    commonjs(),
    ts()
  ],
};
