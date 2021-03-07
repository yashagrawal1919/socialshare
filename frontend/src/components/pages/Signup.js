import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Materialize from "materialize-css";
import useInput from "../../Hooks/useInput";
import { userContext } from "../../App";

function Signup() {
  const [name, clearName, setName] = useInput("");
  const [email, clearEmail, setEmail] = useInput("");
  const [password, clearPasssword, setPassword] = useInput("");
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();
  useEffect(() => {
    if (state) {
      history.push("/");
    }
  }, []);
  const signUp = async () => {
    try {
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
      const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          email,
        }),
      });
      const data = await res.json();
      if (data.error) {
        Materialize.toast({
          html: data.error,
          classes: "#c62828 red darken-3",
        });
      } else {
        Materialize.toast({
          html: data.message,
          classes: "#2e7d32 green darken-3",
        });
        clearName();
        clearEmail();
        clearPasssword();
        history.push("/login");
      }
    } catch (e) {
      Materialize.toast({
        html: "Somthing went wrong",
        classes: "#2e7d32 green darken-3",
      });
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <div className="form-title">Signup</div>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Name"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <button
          onClick={() => signUp()}
          style={{ margin: "15px 0", borderRadius: "5px" }}
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
        >
          Signup
        </button>
        <div>
          <Link to="/login">Already have an account ?</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
