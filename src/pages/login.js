import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/css/login.css";
import axios from "axios";
import { backendUrl } from "../components/urlConnector";
import Avatar from "../static/images/avatar.svg";
import { Link } from "react-router-dom";
import Loader from "../components/loader";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("rememberMe", "false");
  }, []);
  const checkAccount = () => {
    setLoading(true)
    axios
      .get(backendUrl + "checkAccount", {
        params: {
          name: name,
          password: password,
        },
      })
      .then((result) => {
        setLoading(false);
        if (result.data) {
          console.log("user exists");
          localStorage.setItem("id", result.data._id);
          localStorage.setItem("userName", result.data.name);
          navigate("/home");
        } else {
          alert("user is not exist");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="login-container-outer">
      <div className="login-container">
        <h1 style={{ paddingBottom: 20 }}>Login page</h1>
        <img width={120} height={120} src={Avatar} />
        <input
          style={{ maxWidth: 500 }}
          className="form-control"
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Username"
        />
        <input
          style={{ maxWidth: 500 }}
          className="form-control"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <label htmlFor="checkbox">Remember Me</label>
          <input
            style={{ width: 20, height: 20 }}
            name="checkbox"
            type="checkbox"
            onClick={(e) => {
              localStorage.setItem("rememberMe", e.target.checked);
            }}
          />
        </div>
        <button
          style={{ width: "100%", maxWidth: 500 }}
          className="btn btn-med btn-primary"
          onClick={(e) => {
            // localStorage.setItem("token", "token");
            // navigate("/home");
            checkAccount();
          }}
        >
          Login
        </button>
        <p>
          Don't have an account? click <Link to="/register">Here</Link>
        </p>
      </div>
      {loading && <Loader />}
    </div>
  );
}

export default Login;
