import Error404 from "./Pages/Error/404";
import Home from "./Pages/Home";
import Record from "./Pages/Record";
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
    element: <Record />,
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
