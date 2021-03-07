import React, { useEffect, createContext, useHistory, useReducer } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Explore from "./components/pages/Explore";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Profile from "./components/pages/Profile";
import CreatePost from "./components/pages/CreatePost";
import UserProfile from "./components/pages/UserProfile";
import Feed from "./components/pages/Feed";
import { reducer, initialState } from "./Reducers/reducer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
export const userContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Feed} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/create-post" component={CreatePost} />
          <Route exact path="/profile/:userId" component={UserProfile} />
          <Route exact path="/explore" component={Explore} />
        </Switch>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
