import webpack from "webpack";
import path from "path";

export default [
  {
    name: "client",
    mode: "production",
    context: path.resolve(),
    entry: {
      javascript: ["./src/index.js"],
    },
    output: {
      filename: "./js/bundle.js",
      path: path.resolve("dist"),
    },
  },
];
