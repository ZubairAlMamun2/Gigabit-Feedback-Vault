import React from "react";
import {
  createBrowserRouter
} from "react-router-dom";
import Home from "../component/Home";
import MyFeedback from "../component/MyFeedback";
import SubmitFeedback from "../component/SubmitFeedback";
import Adminanel from "../component/Adminanel";
import Authlayout from "../layout/Authlayout";
import Login from "../component/Login";
import Register from "../component/Register";
import Error from "../component/Error";

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