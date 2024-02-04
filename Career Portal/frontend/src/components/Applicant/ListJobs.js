import React, {Component} from 'react';
import axios from 'axios';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";
import Job from "./Listjob";
import { ArrowDown,ArrowUp } from 'react-bootstrap-icons';

export default class ListJobs extends Component {
  
  constructor(props) {
    super(props);
    this.state={
      jobs:[],
      filter:[],
      conditions:{
        title:"", // search
        type:"3", // filter
        duration:7, // filter
        durationsort:0, // sort
        salarysort:0, // sort
        sort:-1,
        min:"",
        max:"", // 100 million :/
        ratingsort:0,
        //rating need to implement
        }
    }
    this.ontitle=this.ontitle.bind(this);
    this.ontype=this.ontype.bind(this);
    this.onduration=this.onduration.bind(this);
    this.ondurationsort=this.ondurationsort.bind(this);
    this.onratingsort=this.onratingsort.bind(this);
    this.onsalarysort=this.onsalarysort.bind(this);
    this.onmin=this.onmin.bind(this);
    this.onmax=this.onmax.bind(this);
    this.getdata=this.getdata.bind(this);
    this.showarrow=this.showarrow.bind(this);
  }
  componentDidMount() {
    if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Applicant") this.props.history.push("/");
    axios.get('http://localhost:4000/job/all')
         .then(response => {
             console.log("mount",response.data);
            this.setState({jobs:[...response.data]});
         })
         .catch(function(error) {
             console.log(error);
         });
  }
  ontitle(e)
  {
    let val=this.state.conditions;
    val.title=e.target.value;
    this.setState({conditions:{...val}});
    // console.log("tit",this.state.conditions);
    this.getdata();
  }
  ontype(e)
  {
    let val=this.state.conditions;
    val.type=e.target.value;
    this.setState({conditions:{...val}});
    this.getdata();
  }
  onduration(e)
  {
    let val=this.state.conditions;
    val.duration=e.target.value;
    this.setState({conditions:{...val}});
    this.getdata();
  }
  ondurationsort()
  {
    let val=this.state.conditions;
    val.durationsort=(1-val.durationsort);
    val.sort=1;
    this.setState({conditions:{...val}});
    this.getdata();
  }
  onsalarysort()
  {
    let val=this.state.conditions;
    val.salarysort=(1-val.salarysort);
    val.sort=2;
    this.setState({conditions:{...val}});
    this.getdata();
  }
  onratingsort()
  {
    let val=this.state.conditions;
    val.ratingsort=(1-val.ratingsort);
    val.sort=3;
    this.setState({conditions:{...val}});
    this.getdata();
  }
  onmin(e)
  {
    let val=this.state.conditions;
    val.min=e.target.value;
    this.setState({conditions:{...val}});
    this.getdata();

  }
  onmax(e)
  {
    let val=this.state.conditions;
    val.max=e.target.value;
    this.setState({conditions:{...val}});
    this.getdata();

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
  async getdata()
  {
    await axios.get('http://localhost:4000/job/all')
         .then(response => {
             console.log("get data");
            this.setState({jobs:[...response.data]});
            // console.log(response.data);
         })
         .catch(function(error) {
             console.log(error);
         });
    this.filter();
  }
  filter()
  {
    console.log("filter");
    let d =[...this.state.jobs];
    // console.log("d",d,this.state.conditions);
    if(this.state.conditions.type!=="3")
    {
      d = d.filter(item=>item.type.toString()===this.state.conditions.type);
      // console.log("dtype",d);
    }
    if(this.state.conditions.duration.toString()!=="7")
    {
      d = d.filter(item=> item.duration.toString()<=this.state.conditions.duration && item.duration>0);
      // console.log("dduration",d);
    }
    if(this.state.title!=="")
    {
      d = d.filter(item => item.title.includes(this.state.conditions.title));
      // console.log("dtitle",d);
    }
    // min and max
    let mn=this.state.conditions.min;
    let mx=this.state.conditions.max;
    if(this.state.conditions.min) d = d.filter(item => item.salary>=this.state.conditions.min);
    if(this.state.conditions.max) d = d.filter(item => item.salary<=this.state.conditions.max);
    // console.log("minmax",this.state.conditions.min,this.state.conditions.max);
    //sort
    if(this.state.conditions.sort===1)
    {
      var flag=this.state.conditions.durationsort;
      d.sort(function(a, b) {
        if(a.duration===0) {
          if(flag) return -1;
          else return 1;
        }
        else if(b.duration===0) {
          if(flag) return 1;
          else return -1;
        }
        else if(a.duration != undefined && b.duration != undefined){
              return (1 - flag*2) * (a.duration - b.duration);
          }
          else{
              return 1;
          }
        });
    }
    else if(this.state.conditions.sort===2)
    {
      var flag=this.state.conditions.salarysort;
      d.sort(function(a, b) {
        if(a.salary != undefined && b.salary != undefined){
            return (1 - flag*2) * (a.salary - b.salary);
        }
        else{
            return 1;
        }
      });
    }
    else if(this.state.conditions.sort===3)
    {
      var flag=this.state.conditions.ratingsort;
      d.sort(function(a, b) {
        if(a.rating != undefined && b.rating != undefined){
            return (1 - flag*2) * (a.rating - b.rating);
        }
        else{
            return 1;
        }
      });
    }
    this.setState({jobs:[...d]});
  }
  render() {
    // console.log("ren",this.state.jobs);
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
                <Nav.Link href="/applicant/listjobs" className="active" >Browse Jobs</Nav.Link>
                <Nav.Link href="/applicant/myjobs" >My Applications</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="/">Log out</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <table className="table" id="table">
                <tbody>
                  <tr>
                    <th scope="col" >
                      <label className="mb-2 mr-sm-2 ">Title</label>
                      <input type="string" className="mb-2 mr-sm-2 form-control"
                        onChange={this.ontitle} value={this.state.conditions.title} placeholder="search by title"/>
                      </th>
                    <th scope="col">
                      {/* filter by type */}
                      <label className="mb-2 mr-sm-2 ">Type</label>
                      <select className="mr-sm-2 form-control" onChange={this.ontype} defaultValue="3" >
                      <option value="0">Full time</option>
                      <option value="1">Half time</option>
                      <option value="2">Work from home</option>
                      <option value="3"></option>
                    </select>
                    </th>
                    <th scope="col">
                      {/* sort by duration */}
                      <button className="btn btn-primary mr-sm-2 " onClick={this.ondurationsort}>
                        {this.state.conditions.sort===1 && this.showarrow(this.state.conditions.durationsort) }
                        Duration
                        {/* {this.state.conditions.salarysort} */}
                      </button>
                      {/* filter by duration */}
                      <select className=" mr-sm-2 form-control" onChange={this.onduration} defaultValue="7" >
                      <option value="1">1 Month</option>
                      <option value="2">2 or below Months</option>
                      <option value="3">3 or below Months</option>
                      <option value="4">4 or below Months</option>
                      <option value="5">5 or below Months</option>
                      <option value="6">6 or below Months</option>
                      <option value="7"></option>
                    </select>
                    </th>
                    <th scope="col">
                      {/* filter by salary */}
                      <button className="btn btn-primary mr-sm-2" onClick={this.onsalarysort}>
                        {this.state.conditions.sort===2 && this.showarrow(this.state.conditions.salarysort) }
                        Salary
                        {/* {this.state.conditions.salarysort} */}
                      </button>
                      <input type="number" className="form-control mr-sm-2"  onChange={this.onmin} value={this.state.min} placeholder="Min salary" />
                      <input type="number" className="form-control mr-sm-2"  onChange={this.onmax} value={this.state.max} placeholder="Max salary" />
                    </th>
                    <th scope="col">
                      <button className="btn btn-primary mr-sm-2" onClick={this.onratingsort}>
                        {this.state.conditions.sort===3 && this.showarrow(this.state.conditions.ratingsort) }
                        Rating
                        {/* {this.state.conditions.salarysort} */}
                      </button>
                    </th>
                  </tr>
                </tbody>
          </table>
            <br/>
            <table className="table" id="table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Recruiter</th>
                    <th scope="col">Salary</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Deadline</th>
                    <th scope="col">Remaining Applications</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.jobs.map(job=>{
                    return <Job
                    title={job.title}
                    recruiter={job.recruiter}
                    applications={job.applications}
                    positions={job.positions}
                    deadline={job.deadline}
                    salary={job.salary}
                    type={job.type}
                    duration={job.duration}
                    rating={job.rating} 
                    key={job._id}
                    id={job._id}
                    />
                  })}
                  </tbody>
          </table>
          </div>
      )
  }
}