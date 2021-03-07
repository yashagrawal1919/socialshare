import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Materialize from "materialize-css";
import useInput from "../../Hooks/useInput";
import { userContext } from "../../App";
function Login() {
  const [email, clearEmail, setEmail] = useInput("");
  const [password, clearPasssword, setPassword] = useInput("");
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    if (state) {
      history.push("/");
    }
  }, []);
  const logIn = async () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      Materialize.toast({
        html: "invalid email",
        classes: "#c62828 red darken-3",
      });
      return;
    }
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email,
        }),
      });
      const data = await res.json();
      console.log("data", data);
      if (data.error) {
        Materialize.toast({
          html: data.error,
          classes: "#c62828 red darken-3",
        });
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "USER", payload: data.user });
        Materialize.toast({
          html: "Login Successfull",
          classes: "#2e7d32 green darken-3",
        });
        clearEmail();
        clearPasssword();
        history.push("/");
      }
    } catch (e) {
      Materialize.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <div className="form-title">Login</div>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          placeholder="Password"
        />
        <button
          onClick={() => logIn()}
          style={{ margin: "15px 0", borderRadius: "5px" }}
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
        >
          Login
        </button>
        <div>
          <Link to="/signup">Don't have an account ?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
