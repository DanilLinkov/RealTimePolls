import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeRoute from "./Routes/HomeRoute.jsx";
import PollRoute from "./Routes/PollRoute.jsx";
import CreateAPoll from "./Routes/CreateAPoll.jsx";

function App() {
  return (
    <Router>
      <Switch>
        <Route
          exact
          strict={false}
          sensitive={false}
          path="/createapoll"
          render={(props) => <CreateAPoll {...props} />}
        />
        <Route
          exact
          strict={false}
          sensitive={false}
          path="/poll/:id"
          render={(props) => <PollRoute {...props} />}
        />
        <Route
          strict={false}
          sensitive={false}
          path="/"
          render={(props) => <HomeRoute {...props} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
