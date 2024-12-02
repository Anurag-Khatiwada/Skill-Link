import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [close, setClose] = useState(false);
  const [type, setType] = useState("password");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleClose = (e) => {
    e.preventDefault();
    setClose(!close);
    setType(close ? "password" : "text");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <h5>Please enter your Username and Password to sign in</h5>
        <label htmlFor="username">Username</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          placeholder="Enter your username"
        />
        <label htmlFor="password">Password</label>
        <div className="inputpass">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={type}
            name="password"
            placeholder="Enter your password"
          />
          <button onClick={handleClose} className="eyeopen">
            {!close && <img src="/public/img/eyeopen.svg" alt="Show password" />}
            {close && <img src="/public/img/eyeclose.svg" alt="Hide password" />}
          </button>
        </div>
        <button className="submit" type="submit">
          Login
        </button>
        {error && <div className="error">{error}</div>}
        <div className="create-account">
          Don't have an account? <a href="/register">Create Account</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
