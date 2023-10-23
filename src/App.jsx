import React from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";

import Routes from "./Routes";

function App() {
  const pages = useRoutes(Routes);

  return <div>{pages}</div>;
}

export default App;
