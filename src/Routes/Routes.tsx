
import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root/Root";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import DashBoard from "../pages/DashBoard/DashBoard";
import AddUser from "../pages/AddUser/AddUser";
import AddBook from "../pages/AddBook/AddBook";
import Books from "../pages/Books/Books";
import Users from "../pages/Users/Users";
import AssignBook from "../pages/AssignBook/AssignBook";
import ReturnBook from "../pages/ReturnBook/ReturnBook";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  
  // 🔓 PUBLIC ROUTE (Login)
  {
    path: "/login",
    Component: Login,
  },

  // 🔒 PROTECTED ROUTES
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: "dashboard",
        element: <DashBoard />,
      },
      {
        path: "add-user",
        element: <AddUser />,
      },
      {
        path: "add-book",
        element: <AddBook />,
      },
      {
        path: "books",
        element: <Books />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "assign-book",
        element: <AssignBook />,
      },
      {
        path: "return-book",
        element: <ReturnBook />,
      },
    ],
  },
]);