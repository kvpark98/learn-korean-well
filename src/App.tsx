import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";
import "./App.module.css";
import Confirm from "./routes/confirm";
import ProtectedRouteLogin from "./components/protected-route-login";
import ProtectedRouteConfirm from "./components/protected-route-confirm";
import UpdatePassword from "./routes/update-password";
import ProtectedRouteUpdatePassword from "./components/protected-route-update-password";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedRouteLogin>
        <Login />
      </ProtectedRouteLogin>
    ),
  },
  {
    path: "/create-account",
    element: (
      <ProtectedRouteLogin>
        <CreateAccount />
      </ProtectedRouteLogin>
    ),
  },
  {
    path: "/confirm",
    element: (
      <ProtectedRouteConfirm>
        <Confirm />
      </ProtectedRouteConfirm>
    ),
  },
  {
    path: "/update-password",
    element: (
      <ProtectedRouteUpdatePassword>
        <UpdatePassword />
      </ProtectedRouteUpdatePassword>
    ),
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
