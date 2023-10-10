import Error404 from "./Pages/Error/404";
import Home from "./Pages/Home";
import GetMedia from "./Pages/GetMedia";
import EditMedia from "./Pages/EditMedia";

const Routes = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/getMedia",
    element: <GetMedia />,
  },
  {
    path: "/editMedia",
    element: <EditMedia />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export default Routes;
