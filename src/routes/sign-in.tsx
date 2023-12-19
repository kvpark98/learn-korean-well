import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Switcher, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";
import { Button, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import GoogleButton from "../components/google-btn";
import Alert from "react-bootstrap/Alert";

export default function SignIn() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regEmail =
      /^[A-Za-z0-9]{3,}([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]{3,}([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
    setEmail(value.replace(/\s/gi, ""));
    if (value) {
      if (!regEmail.test(value)) {
        setEmailErrorMessage("Not a valid email format.");
        setIsEmail(false);
      } else {
        setIsEmail(true);
      }
    } else {
      setEmailErrorMessage("Please enter your email.");
      setIsEmail(false);
    }
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value.replace(/\s/gi, ""));
    if (value !== "") {
      setIsPassword(true);
    } else {
      setPasswordErrorMessage("Please enter your password.");
      setIsPassword(false);
    }
  };

  const noSpace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Space") {
      event.preventDefault();
    }
  };

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === "") {
      setEmailErrorMessage("Please enter your email.");
      setIsEmail(false);
    }
    if (password === "") {
      setPasswordErrorMessage("Please enter your password.");
      setIsPassword(false);
    }

    if (isLoading || !isEmail || !isPassword) {
      return;
    }

    setError("");

    try {
      setIsLoading(true);

      // Log in
      await signInWithEmailAndPassword(auth, email, password);

      window.localStorage.removeItem("PasswordChanged?");
      window.localStorage.removeItem("verificationNeeded?");

      // Ridirect to the home page
      if (auth.currentUser?.emailVerified === true) {
        navigate("/");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.code);
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log("user : " + auth.currentUser);
  console.log("emailVerified : " + auth.currentUser?.emailVerified);

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Wrapper>
          <div className="w-100 mb-1 d-flex justify-content-center">
            <h1 className="fs-2">Sign in</h1>
          </div>
          {window.localStorage.getItem("PasswordChanged?") === "True" && (
            <Alert
              variant="success"
              className="d-flex align-itmes-center m-0 mt-3 w-100"
              dismissible
            >
              <p>New password set successfully.</p>
            </Alert>
          )}
          {window.localStorage.getItem("verificationNeeded?") === "True" && (
            <Alert
              variant="warning"
              className="d-flex align-itmes-center m-0 mt-3 w-100"
              dismissible
            >
              <p>
                Please go to your email and click the link for verification. If
                you verified it, you can ignore this message.
              </p>
            </Alert>
          )}
          {error && (
            <Alert
              variant="danger"
              className="d-flex align-itmes-center m-0 mt-3 w-100"
              dismissible
            >
              <p>
                <span>
                  {error === "auth/invalid-login-credentials" &&
                    "Incorrect email or password."}
                  {error === "auth/too-many-requests" &&
                    "Too many attempts. Please try again later."}
                  {error === "auth/account-exists-with-different-credential" &&
                    "Email is invalid or already taken."}
                </span>
              </p>
            </Alert>
          )}
          {auth.currentUser && auth.currentUser?.emailVerified === false && (
            <Alert
              variant="danger"
              className="d-flex align-itmes-center m-0 mt-3 w-100"
              dismissible
            >
              <p>
                <span>
                  Your email was not verified. Please go to your email and click
                  the link for verification.
                </span>
              </p>
            </Alert>
          )}
          <Alert variant="light" className="mt-3 py-4">
            <Form
              onSubmit={signIn}
              className="d-flex"
              style={{
                width: "340px",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <Form.Group controlId="email" className="mb-2">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  className="border-none mt-1 mb-1"
                  onChange={handleEmail}
                  onKeyDown={noSpace}
                  name="email"
                  value={email}
                  type="text"
                  maxLength={50}
                />
                {!isEmail && (
                  <div className="mt-2 text-danger">{emailErrorMessage}</div>
                )}
              </Form.Group>
              <Form.Group controlId="password">
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ height: "24px" }}
                >
                  <Form.Label>Password</Form.Label>
                  <Link
                    to="/send-sign-in-link"
                    className="p-0 mb-2 text-decoration-none"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Form.Control
                  className="border-none mt-1 mb-1"
                  onChange={handlePassword}
                  onKeyDown={noSpace}
                  name="password"
                  value={password}
                  type="password"
                  maxLength={20}
                />
                {!isPassword && (
                  <div className="mt-2 text-danger">{passwordErrorMessage}</div>
                )}
              </Form.Group>
              <Button type="submit" className="fw-bold">
                {isLoading ? "Loading..." : "Sign in"}
              </Button>
            </Form>
            <Switcher>
              <Link to="/sign-up">Create an account &rarr;</Link>
            </Switcher>
          </Alert>
          <div className="w-100 d-flex justify-content-between align-items-center">
            <span
              className="w-50 border border-secondary"
              style={{ height: 0 }}
            ></span>
            <span className="mx-3">OR</span>
            <span
              className="w-50 border border-secondary"
              style={{ height: 0 }}
            ></span>
          </div>
          <Alert variant="light" className="w-100 mt-3 py-4">
            <GoogleButton />
            <GithubButton />
          </Alert>
        </Wrapper>
      </div>
    </Container>
  );
}
