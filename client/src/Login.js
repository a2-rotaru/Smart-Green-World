import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import lettuce from "./images/lettuce.jpg";
import "./CSS/Login.css";

const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Redirect user to home page
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history]);

  //Login function
  const login = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("/login", {
          username: username,
          password: password,
        })
        .then((response) => {
          localStorage.setItem("authToken", response.data.accessToken);
          localStorage.setItem("username", username);
          history.push("/");
        });
    } catch (error) {
      console.log(error);
      setMessage(" Wrong username or password!");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="container">
      <img src={lettuce} alt="Background image" className="background-image" />
      <form className="form" onSubmit={login}>
        <div className="header">
          <h1>Welcome to Smart Green World!</h1>
          <h2>Login </h2>
        </div>
        <div className="body">
          {message && <span className="error-message">{message}</span>}

          <label className="usernameLogin">Username</label>
          <input
            className="username-input"
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
          <label className="passwordLogin">Password</label>
          <input
            className="password-input"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />

          <div className="loginButton">
            <input type="submit" value="Login" />
          </div>
          <div className="link">
            <Link to="/registration">Register</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
