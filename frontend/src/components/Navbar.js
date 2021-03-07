import React, { useEffect, useContext, useRef, useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { userContext } from "../App";
import M from "materialize-css";

function Navbar() {
  const history = useHistory();
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    M.Modal.init(searchModal.current);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/login");
    }
  }, []);
  const renderList = () => {
    if (!state) {
      return [
        <li className="list-item" key={1}>
          <NavLink to="/login">Login</NavLink>
        </li>,
        <li className="list-item" key={2}>
          <NavLink to="/signup">Signup</NavLink>
        </li>,
      ];
    } else {
      return [
        <li key={7}>
          <i
            data-target="modal1"
            className="large material-icons modal-trigger list-item"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li className="list-item" key={3}>
          <NavLink to="/profile">Profile</NavLink>
        </li>,
        <li className="list-item" key={6}>
          <NavLink to="/explore">Explore</NavLink>
        </li>,
        <li className="list-item" key={4}>
          <NavLink to="/create-post">New Post</NavLink>
        </li>,
        <li className="list-item" key={5}>
          <NavLink
            to="/login"
            style={{ color: "black", cursor: "pointer" }}
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
            }}
          >
            Logout
          </NavLink>
        </li>,
      ];
    }
  };
  const fetchUsers = async (query) => {
    try {
      setSearch(query);
      const res = await fetch("/users/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          query,
        }),
      });
      const data = await res.json();
      if (data.error) {
        M.toast({
          html: data.error,
          classes: "#c62828 red darken-3",
        });
      } else {
        setUserDetails(data.user);
      }
    } catch (e) {
      M.toast({
        html: "Something went wrong",
        classes: "#c62828 red darken-3",
      });
    }
  };
  return (
    <div>
      <nav>
        <div style={{ gap: "2px" }} className="nav-wrapper white">
          <div>
            {" "}
            <NavLink
              to={state ? "/" : "/login"}
              style={{ marginLeft: "20px" }}
              className="brand-logo"
            >
              Social Share
            </NavLink>
            <a href="#" className="sidenav-trigger" data-target="mobile-links">
              <i className="material-icons">menu</i>
            </a>
          </div>
          <div className="right hide-on-med-and-down">
            <ul id="">{renderList()}</ul>
          </div>
        </div>
        <ul className="sidenav" id="mobile-links">
          <div className="container"></div>
          {renderList()}
        </ul>
        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="search users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection">
              {state &&
                userDetails.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      to={
                        item._id !== state._id
                          ? "/profile/" + item._id
                          : "/profile"
                      }
                      onClick={() => {
                        M.Modal.getInstance(searchModal.current).close();
                        setSearch("");
                      }}
                    >
                      <li className="collection-item">{item.email}</li>
                    </Link>
                  );
                })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => {
                setSearch("");
                setUserDetails([]);
              }}
            >
              close
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
