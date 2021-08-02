import CreateAccount from "./CreateAccount";
import Login from "./Login";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Change_Password from "./pages/Change_Password";
import Edit_profile from "./pages/Edit_profile";
import Add_Note from "./pages/Add_Note";
import Edit_Note from "./pages/Edit_Note";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/registration" component={CreateAccount} />
        <Route exact path="/" component={Home} />
        <Route path="/note" component={Notes} />
        <Route path="/profile" component={Profile} />
        <Route path="/edit-profile" component={Edit_profile} />
        <Route path="/change-password" component={Change_Password} />
        <Route path="/add-note" component={Add_Note} />
        <Route path="/edit-note/:id" component={Edit_Note} />
      </Switch>
    </Router>
  );
}

export default App;
