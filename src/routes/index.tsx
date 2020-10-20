import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from "../components/Main";
import User from "../components/User";

function Routes(){
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main}/>
        <Route path="/user/:username" exact component={User}/>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes;