module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "app.js",
    path: __dirname + "/dist",
    libraryTarget: "var",
    library: "CalendarGeneratorApp",
  },
  externals: {
    jquery: "jQuery",
    d3: "d3",
    react: "React",
    "react-dom": "ReactDOM",
  },
  devtool: "inline-source-map",
};
