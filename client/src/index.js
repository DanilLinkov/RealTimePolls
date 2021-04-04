import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const themeLight = createMuiTheme({
  palette: {
    background: {
      default: "#5eaaa8",
    },
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={themeLight}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);
