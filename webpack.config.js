const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const DEV_MODE = "development";
const PROD_MODE = "production";
const NONE = "none";

const mode = (() => {
  const nEnv = process.env.NODE_ENV;
  switch (nEnv) {
    case PROD_MODE:
    case DEV_MODE:
      return nEnv;
    default:
      return NONE;
  }
})();

const isDevMode = () => mode === DEV_MODE;

module.exports = {
  mode,
  entry: {
    app: "./src/index.tsx"
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(process.cwd(), "public", "index.html")
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  }
};