import Error404 from "./Pages/Error/404";
import Home from "./Pages/Home";
import GetMedia from "./Pages/GetMedia";
import ShapeDraw from "./Pages/GetMedia/shapeDraw";
import EditMedia from "./Pages/EditMedia";

const Routes = [
  // {
  //   path: "/",
  //   element: <Home />,
  //   children: [
  //     {
  //       path: "/",
  //       element: <Home />,
  //     },
  //   ],
  // },
  {
    path: "/",
    element: <GetMedia />,
  },
  {
    path: "/shape",
    element: <ShapeDraw />,
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
