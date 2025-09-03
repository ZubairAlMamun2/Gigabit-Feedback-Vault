import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../component/Home";
import SubmitFeedback from "../component/SubmitFeedback";
import Authlayout from "../layout/Authlayout";
import Login from "../component/Login";
import Register from "../component/Register";
import Error from "../component/Error";
import AdminPanel from "../component/AdminPanel";
import Dashboard from "../component/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/submitfeedback",
    element: <SubmitFeedback />,
  },
  {
    path: "/adminpanel",
    element: <AdminPanel />,
  },
  {
    path: "/auth",
    element: <Authlayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
]);

export default router;
