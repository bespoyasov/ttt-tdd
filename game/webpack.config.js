import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

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
    plugins: [
      new HtmlWebpackPlugin({
        template: "./assets/index.html",
      }),
    ],
  },
];
