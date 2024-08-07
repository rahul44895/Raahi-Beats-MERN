import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthenticationContext } from "../../Context/Authentication/AuthenticationState";
import "./AuthenticationStyle.css";

export default function LoginPage() {
  const [navbarHeight, setnavbarHeight] = useState(0);
  useEffect(() => {
    if (document.querySelector(".navbar")) {
      setnavbarHeight(document.querySelector(".navbar").offsetHeight);
    }
  }, [navbarHeight]);

  const { login } = useContext(AuthenticationContext);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };
  const main = useRef();

  return (
    <div className="authContainer" ref={main}>
      <div style={{ height: `${navbarHeight}px`, width: "100vw" }}></div>

      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          height: `calc(${main.current?.offsetHeight}px - ${navbarHeight}px)`,
        }}
      >
        <h1>Login</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              value={credentials.email}
              onChange={onChange}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              value={credentials.password}
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-outline-success">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
