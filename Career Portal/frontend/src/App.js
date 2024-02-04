import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

// import UsersList from './components/Users/UsersList'
import Home from './components/Common/Home'
import Register from './components/Common/Register'
import Login from './components/Common/Login'
// import Navbar from './components/templates/Navbar'
// import Profile from './components/Users/Profile'
import Applicanthome from './components/Applicant/Dashboard';
import ListJobs from './components/Applicant/ListJobs';
import MyJobs from './components/Applicant/Myjobs';
import Recruiterhome from './components/Recruiter/Dashboard';
import RecruiterMyJobs from './components/Recruiter/Myjobs';
import CreateJob from './components/Recruiter/CreateJob';
import Viewapps from './components/Recruiter/Viewapps';
import Viewemps from './components/Recruiter/Myemployees';
function App() {
  return (
    <Router>
      <div className="container">
        {/* <Navbar /> */}
        <br />
        <Route path="/" exact component={Login} />
        {/* <Route path="/users" exact component={UsersList} /> */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/applicant/dashboard" component={Applicanthome} />
        <Route path="/recruiter/dashboard" component={Recruiterhome} />
        <Route path="/recruiter/myjobs" component={RecruiterMyJobs} />
        <Route path="/recruiter/createjob" component={CreateJob} />
        <Route path="/recruiter/viewapps" component={Viewapps}/>
        <Route path="/recruiter/viewemps" component={Viewemps}/>
        <Route path="/applicant/myjobs" component={MyJobs}/>
        <Route path="/applicant/listjobs" component={ListJobs}/>
        {/* <Route path="/profile" component={Profile} /> */}
      </div>
    </Router>
  );
}

export default App;
