import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import Vapp from './Viewapp';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";
import { ArrowDown,ArrowUp,  } from 'react-bootstrap-icons';

export default class Viewapps extends Component {
    state = {
        applications:[],
        sort:-1,
        name:0,
        doa:0,
        rating:0,
    };
    ondoa=this.ondoa.bind(this);
    onname=this.onname.bind(this);
    onrating=this.onrating.bind(this);
    onsort=this.onsort.bind(this);
    onReject = this.onReject.bind(this);
    ondoa(e)
    {
      this.setState({sort:1,doa:(!this.state.doa)});
      this.onsort();
    }
    onname(e)
    {
      this.setState({sort:2,name:(!this.state.name)});
      this.onsort();
    }
    onrating(e)
    {
      this.setState({sort:3,rating:(!this.state.rating)});
      this.onsort();
    }
    showarrow(e)
    {
      if(e)
      {
        return <ArrowUp/>
      }
      else{
        return <ArrowDown/>
      }
    }
    onsort(e)
    {
      let applications=[];
      let last =[];
      axios.get('http://localhost:4000/application/job/'+localStorage.getItem("job"))
      .then(res=>{
        // console.log("inappps",res);
        applications=[...res.data];
        applications.forEach(app=>{
          // console.log("app",app);
        let v={};
        v.status=app.status;
        v.date=app.date;
        v.id=app._id;
        v.sop=app.sop;
        axios.post('http://localhost:4000/applicant/email',{"email":app.applicant})
          .then(user=>{
            if(user.data)
            {
              v.applicant=user.data;
              // console.log("V",v);
              last.push(v);
              this.setState({applications:[...last]});
              ////// sorting begins --------
              let d =[...this.state.applications];
              if(this.state.sort===1)
              {
                var flag=this.state.doa;
                d.sort(function(a, b) {
                  if(a.date !== undefined && b.date !== undefined){
                        return (1 - flag*2) * (a.date - b.date);
                    }
                    else{
                        return 1;
                    }
                  });
              }
              else if(this.state.sort===2)
              {
                var flag=this.state.name;
                d.sort(function(a, b) {
                  if(a.applicant.name != undefined && b.applicant.name != undefined){
                      return (1 - flag*2) * (a.applicant.name - b.applicant.name);
                  }
                  else{
                      return 1;
                  }
                });
              }
              else if(this.state.sort===3)
              {
                var flag=this.state.rating;
                d.sort(function(a, b) {
                  if(a.applicant.rating != undefined && b.applicant.rating != undefined){
                      return (1 - flag*2) * (a.applicant.rating - b.applicant.rating);
                  }
                  else{
                      return 1;
                  }
                });
              }
              // console.log("DDD",d);
              // this.setState({applications:[...d]});
              console.log("D",d);
              this.setState({applications:[...d]});
            }
          })
          .catch(err=>console.log(err));
        });
      })
      .catch(err=>console.log(err));
      
    }
    onReject(e){
      // console.log("LOL");
      axios.post("http://localhost:4000/application/update/"+e,{
            "status":"Reject"
        })
        .then(res=>{
            console.log("response reject app", res);
        })
        .catch(function(error){
            console.log(error);
          });
      let app= this.state.applications.filter(item => item.id !== e);
      this.setState({applications:[...app]});
    }
    componentDidMount(e){
      if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Recruiter") this.props.history.push("/");
      let applications=[];
      let last =[];
      axios.get('http://localhost:4000/application/job/'+localStorage.getItem("job"))
      .then(res=>{
        // console.log("inappps",res);
        applications=[...res.data];
        applications.forEach(app=>{
          // console.log("app",app);
          let v={};
          v.status=app.status;
          v.date=app.date;
          v.id=app._id;
          v.sop=app.sop;
          axios.post('http://localhost:4000/applicant/email',{"email":app.applicant})
          .then(user=>{
            if(user.data)
            {
              v.applicant=user.data;
              console.log("V",v);
              last.push(v);
              this.setState({applications:[...last]});
            }
          })
          .catch(err=>console.log(err));
        });
        // this.setState({applications:[...res]});
      })
      .catch(err=>console.log(err));
    }
    render() {
      console.log("this state",this.state);
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
                    <Nav.Link href="/recruiter/dashboard" >Home</Nav.Link>
                  <Nav.Link href="/recruiter/createjob" >Add Job</Nav.Link>
                    <Nav.Link href="/recruiter/myjobs" >Jobs</Nav.Link>
                    <Nav.Link href="/recruiter/viewapps" >View Applications</Nav.Link>
                    <Nav.Link href="/recruiter/viewemps" >View employees</Nav.Link>
                    
                  </Nav>
                  <Nav>
                    <Nav.Link href="/">Log out</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <table className="table" id="table">
                <tbody>
                  <tr>
                    <th scope="col">
                      <button className="btn btn-primary mr-sm-2 " onClick={this.ondoa}>
                        {this.state.sort===1 && this.showarrow(this.state.doa) }
                        Date of Application
                      </button>
                    </th>
                    <th scope="col">
                      <button className="btn btn-primary mr-sm-2 " onClick={this.onname}>
                        {this.state.sort===2 && this.showarrow(this.state.name) }
                        Name
                      </button>
                    </th>
                    <th scope="col">
                      <button className="btn btn-primary mr-sm-2 " onClick={this.onrating}>
                        {this.state.sort===3 && this.showarrow(this.state.rating) }
                        Rating
                      </button>
                    </th>
                  </tr>
                </tbody>
          </table>
            <br/>
              <table className="table" id="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Applied Date</th>
                      <th scope="col">Education</th>
                      <th scope="col">Skills</th>
                      <th scope="col">SOP</th>
                      <th scope="col">Rating</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.applications.map(app=>{
                    // console.log("appret",app);
                      return <Vapp
                      status={app.status}
                      name={app.applicant.name}
                      education={app.applicant.education}
                      skills={app.applicant.skills}
                      sop={app.sop}
                      id={app.id}
                      key={app.id}
                      delete={this.onReject}
                      date={app.date}
                      email={app.applicant.email}
                      rating={app.applicant.rating}
                      />
                    })}
                    </tbody>
            </table>
          </div>
        )
    }
}