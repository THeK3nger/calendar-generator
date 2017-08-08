requirejs.config({
    paths: {
      app: "app",
      jquery: "https://code.jquery.com/jquery-3.1.1.min",
      d3: "https://d3js.org/d3.v4.min"
    }
});

// Load the main app module to start the app
requirejs(["app"]);