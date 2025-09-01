import React from "react";
import {
  createBrowserRouter
} from "react-router-dom";
import Home from "../component/Home";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/myfeedback",
    element: <MyFeedback />,
  },
  {
    path: "/submitfeedback",
    element: <SubmitFeedback />,
  },
  {
    path: "/adminpanel",
    element: <Adminanel />,
  },
  {
        path: "/auth",
        element:<Authlayout />,
        children:[
          {
              path: "/auth/login",
              element: <Login />, 
          },
          {
              path: "/auth/register",
              element: <Register />, 
          },
         
        ]
      },
      {
        path: "*",
        element: <Error />,
      },
]);

export default router;