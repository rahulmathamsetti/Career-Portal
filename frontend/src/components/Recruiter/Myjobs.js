import React, {Component} from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import { ReactComponent as Logo } from "../../logo.svg";
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import Job from './Job';

export default class RecruiterMyJobs extends Component {
    state={
        jobs:[],
    };
    onUpdate=this.onUpdate.bind(this);
    delete=this.delete.bind(this);
    componentDidMount(){
      if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Recruiter") this.props.history.push("/");
        // get user information
        axios.post('http://localhost:4000/job/recruiter',{email:localStorage.getItem("email")})
          .then(response=>{
            this.setState({jobs:[...response.data]});
            console.log("state my jobs",this.state);
          })
          .catch(function(error){
            console.log(error);
          })
      }
    onUpdate(e){
        e.preventDefault();
        axios.post("http://localhost:4000/Job/recruiter",{email:localStorage.getItem("email")})
        .then(response=>{
          this.setState({jobs:[...response.data]});
          console.log("state",this.state);
          })
          .catch(function(error){
            console.log(error);
          })
    }
    delete(e)
    {
      console.log("e",e);
      axios.post("http://localhost:4000/job/del/"+e)
      .then(res=>{
          console.log("response del edu", res);
          if(res.status===200) alert("delete successful");
      })
      .catch(function(error){
          console.log(error);
        })
      let job = this.state.jobs.filter(item => item._id !== e);
      this.setState({jobs:[...job]});
    }
    render(){
        return(
            <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="">
                  <Logo
                  alt=""
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link href="/recruiter/dashboard" >Home</Nav.Link>
                  <Nav.Link href="/recruiter/createjob" >Add Job</Nav.Link>
                    <Nav.Link href="/recruiter/myjobs" className="active">Jobs</Nav.Link>
                    <Nav.Link href="/recruiter/viewapps" >View Applications</Nav.Link>
                    <Nav.Link href="/recruiter/viewemps" >View employees</Nav.Link>
                    
                  </Nav>
                  <Nav>
                    <Nav.Link href="/">Log out</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <div>
                {this.state.jobs.map(job=>{
                  return (
                  <Job
                  title={job.title}
                  recruiter={job.recruiter}
                  applications={job.applications}
                  positions={job.positions}
                  deadline={job.deadline}
                  posting={job.posting}
                  skillset={job.skillset}
                  salary={job.salary}
                  type={job.type}
                  duration={job.type}
                  rating={job.rating} 
                  key={job._id}
                  id={job._id}
                  delete={this.delete}
                  history={this.props.history}
                  />
                )})}
              </div>
                </div>
        );
    }
}