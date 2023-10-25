import React from "react";
import Error404 from "./Pages/Error/404";
import Record from "./Pages/Record";
import EditMedia from "./Pages/EditMedia";

const Routes = [
  {
    path: "/",
    element: <Record />,
  },
  {
    path: "/editMedia",
    element: <EditMedia />,
  },
];

export default Routes;
