/**
 * create by miaoyu 2018/6/4
 */

import React from "react";
import { HashRouter, Route } from "react-router-dom";

import Home from "./Home/index";
import Login from "./Login/index";

export default class Main extends React.Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/Home" component={Home} />
          <Route path="/login" component={Login} />
        </div>
      </HashRouter>
    );
  }
}