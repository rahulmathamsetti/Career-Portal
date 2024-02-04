import React, {Component} from 'react';
import axios from 'axios';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";
import MyJob from "./Myjob";

export default class ListJobs extends Component {

    constructor(props) {
        super(props);
        this.state={
            applications:[],
        }
    }
    componentDidMount() {
      if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Applicant") this.props.history.push("/");
        let applications=[];
        let last =[];
        axios.post('http://localhost:4000/application/applicant/',{"email":localStorage.getItem("email")})
         .then(response => {
            applications=[...response.data];
            applications.forEach(app=>{
                console.log("app",app);
                let v={};
                v.status=app.status;
                v.id=app._id;
                v.ratejob=app.ratejob;
                axios.get('http://localhost:4000/job/'+app.job)
                .then(job=>{
                  if(job.data){
                    v.job=job.data;
                    console.log("vdata",v);
                    last.push(v);
                    // last.push({"job":job.data,"status":app.status});
                    this.setState({applications:[...last]});
                  }
                })
                .catch(err=>console.log(err));
           });
         })
         .catch(function(error) {
             console.log(error);
         });
    }
    render() {
      console.log("ren",this.state);
        return (
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
                  <Nav.Link href="/applicant/dashboard" >Home</Nav.Link>
                  <Nav.Link href="/applicant/listjobs"  >Browse Jobs</Nav.Link>
                  <Nav.Link href="/applicant/myjobs" className="active" >My Applications</Nav.Link>
                  </Nav>
                  <Nav>
                    <Nav.Link href="/">Log out</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <table className="table" id="table">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Date of Joining</th>
                      <th scope="col">Salary</th>
                      <th scope="col">Recruiter</th>
                      <th scope="col">Rating</th>
                      <th scope="col">Status</th>
                      <th scope="col">Rate job</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.applications.map(app=>{
                    console.log("appret",app);
                      return <MyJob
                      status={app.status}
                      title={app.job.title}
                      email={app.job.recruiter}
                      salary={app.job.salary}
                      rating={app.job.rating} 
                      key={app.id}
                      id={app.id}
                      addrating={app.ratejob}
                      posting={app.job.posting}
                      job={app.job._id}
                      />
                    })}
                    </tbody>
            </table>
            </div>
        )
    }
}