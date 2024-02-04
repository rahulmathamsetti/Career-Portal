import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";
import { ArrowDown,ArrowUp } from 'react-bootstrap-icons';
import Vemp from './Myemployee';

export default class Viewemps extends Component {
  state = {
      applications:[],
      sort:-1,
      name:0,
      doj:0,
      rating:0,
      title:0,
  };
    ondoj=this.ondoj.bind(this);
    onname=this.onname.bind(this);
    onrating=this.onrating.bind(this);
    onsort=this.onsort.bind(this);
    ontitle=this.ontitle.bind(this);
    fromchild=this.fromchild.bind(this);
    fromchild(a,b,c)
    {
      // console.log("AB",a,b);
      let d = [...this.state.applications];
      let i = d.findIndex(x=>x.id===c);
      d[i].applicant.rating=a;
      d[i].rating=b;
      // console.log(d);
      this.setState({applications:[...d]});
      this.onsort(-1);
    }
    ondoj(e)
    {
      // this.setState({sort:1,doj:(!this.state.doj)});
      this.onsort(1);
    }
    onname(e)
    {
      // this.setState({sort:2,name:(!this.state.name)});
      this.onsort(2);
    }
    onrating(e)
    {
      // this.setState({sort:4,rating:(!this.state.rating)});
      // console.log("state",this.state);
      this.onsort(4);
    }
    ontitle()
    {
      // this.setState({sort:3,title:(!this.state.title)});
      this.onsort(3);
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
    onsort(v)
    {
      let d =[...this.state.applications];
      let e;
      if(v===-1) e=this.state.sort;
      else e=v;
      if(e===-1) return;
      console.log("E",e,d);
      if(e===1)
      {
        var flag=!this.state.doj;
        if(v===-1) flag=!flag;
        d.sort(function(a, b) {
          if(a.job.posting !== undefined && b.job.posting !== undefined){
            return (1 - flag*2) * (a.job.posting - b.job.posting);
          }
          else{
            return 1;
          }
        });
        this.setState({applications:[...d],doj:flag,sort:1});
        // console.log("lol1",d);
      }
      else if(e===2)
      {
        var flag=!this.state.name;
        if(v===-1) flag=!flag;
        d.sort(function(a, b) {
          if(a.applicant.name !== undefined && b.applicant.name !== undefined){
            // return (1 - flag*2) * (a.applicant.name - b.applicant.name);
            return (1-flag*2)*(a.applicant.name).localeCompare(b.applicant.name);
          }
          else{
            return 1;
          }
        });
        this.setState({applications:[...d],name:flag,sort:2});
        // console.log("lol2",d);
      }
      else if(e===3)
      {
        var flag=!this.state.title;
        if(v===-1) flag=!flag;
        d.sort(function(a, b) {
          if(a.job.title !== undefined && b.job.title !== undefined){
            // return (1 - flag*2) * (a.job.title - b.job.title);
            return (1-flag*2)*(a.job.title).localeCompare(b.job.title);
          }
          else{
              return 1;
          }
        });
        this.setState({applications:[...d],title:flag,sort:3});
        // console.log("lol3",d);
      }
      else if(e===4)
      {
        var flag=!this.state.rating;
        if(v===-1) flag=!flag;
        d.sort(function(a, b) {
          if(a.applicant.rating !== undefined && b.applicant.rating !== undefined){
            return (1 - flag*2) * (a.applicant.rating - b.applicant.rating);
          }
          else{
            return 1;
          }
        });
        this.setState({applications:[...d],rating:flag,sort:4});
        // console.log("lol4",d);
      }
      // this.setState({applications:[...d]});      
    }
 
    componentDidMount(e){
      if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Recruiter") this.props.history.push("/");
      let applications=[];
      let last =[];
      axios.post('http://localhost:4000/application/recruiter',{"recruiter":localStorage.getItem("email")})
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
          v.rating=app.rateapplicant; // to add rating to applicant ***
          axios.post('http://localhost:4000/applicant/email',{"email":app.applicant})
          .then(user=>{
            if(user.data)
            {
              v.applicant=user.data;
              // console.log("V",v);
              axios.get('http://localhost:4000/job/'+app.job)
              .then(job=>{
                if(job.data!==null){
                  v.job=job.data;
                  last.push(v);
                  this.setState({applications:[...last]});
                }
              })
              .catch(err=>console.log(err));
            }
          })
          .catch(err=>console.log(err));
        });
        // this.setState({applications:[...res]});
      })
      .catch(err=>console.log(err));
    }
    render() {
      // console.log("this state",this.state);
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
                  <Nav.Link href="/recruiter/viewemps" className="active" >View employees</Nav.Link>
              
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
                      <button className="btn btn-primary mr-sm-2 " onClick={this.onname}>
                        {this.state.sort===2 && this.showarrow(this.state.name) }
                        Name
                      </button>
                    </th>
                    <th scope="col">
                      <button className="btn btn-primary mr-sm-2 " onClick={this.ondoj}>
                        {this.state.sort===1 && this.showarrow(this.state.doj) }
                        Date of Joining
                      </button>
                    </th>
                    <th scope="col">
                      <button className="btn btn-primary mr-sm-2 " onClick={this.ontitle}>
                        {this.state.sort===3 && this.showarrow(this.state.title) }
                        Job Title
                      </button>
                    </th>
                    <th scope="col">
                      <button className="btn btn-primary mr-sm-2 " onClick={this.onrating}>
                        {this.state.sort===4 && this.showarrow(this.state.rating) }
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
                      <th scope="col">Date of Joining</th>
                      <th scope="col">Job Title</th>
                      <th scope="col">Job Type</th>
                      <th scope="col">Rating</th>
                      <th scope="col">Add rating</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.applications.map(app=>{
                      return <Vemp
                      name={app.applicant.name}
                      id={app.id}
                      doj={app.job.posting}
                      type={app.job.type}
                      email={app.applicant.email}
                      title={app.job.title}
                      rating={app.applicant.rating}
                      addrating={app.rating}
                      key={app.id}
                      toparent={this.fromchild}
                      />
                    })}
                  </tbody>
            </table>
          </div>
        )
    }
}