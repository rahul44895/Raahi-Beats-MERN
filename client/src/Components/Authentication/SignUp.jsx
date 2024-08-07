import React, { useContext, useState } from "react";
import AuthenticationContext from "../../Context/Authentication/AuthenticationContext";

export default function SignUp() {
  const { signup } = useContext(AuthenticationContext);

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userAvatar: "",
  });
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(credentials);
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center flex-column">
      <h1>SignUp</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={credentials.username}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
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
            name="password"
            value={credentials.password}
            onChange={onChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Avatar
          </label>
          <input
            type="file"
            className="form-control"
            name="userAvatar"
            onChange={(e) => {
              let file = e.target.files[0];
              if (file) {
                // Check if the file is an allowed type
                if (!["image/jpeg", "image/png"].includes(file.type)) {
                  alert("Please upload a .jpg, .jpeg, or .png file.");
                  return;
                }
              }
              setCredentials({
                ...credentials,
                [e.target.name]: e.target.files[0],
              });
            }}
          />
        </div>
        <button type="submit" className="btn btn-outline-success">
          Submit
        </button>
      </form>
    </div>
  );
}
