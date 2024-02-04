import React, { Component } from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import { ReactComponent as Logo } from "../../logo.svg";
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const topskills = [
  { title: "c++" },
  { title: "python" },
  { title: "express" },
  { title: "java" },
  { title: "ruby" },
  { title: "c#" },
  { title: "react" },
  { title: "mongoose" },
  { title: "node.js" },
];

export default class CreateJob extends Component {

    state = {
        title:"",
        applications:"",
        positions:"",
        deadline:"",
        posting:"",
        skillset:[],
        salary:"",
        type:0,
        duration:0,
    };
    onChangetitle=this.onChangetitle.bind(this);
    onChangepositions = this.onChangepositions.bind(this);
    onChangeapplications = this.onChangeapplications.bind(this);
    onChangedeadline = this.onChangedeadline.bind(this);
    onChangeposting = this.onChangeposting.bind(this);
    onChangeskillset= this.onChangeskillset.bind(this);
    onChangesalary = this.onChangesalary.bind(this);
    onChangetype=this.onChangetype.bind(this);
    onChangeduration=this.onChangeduration.bind(this);
    onAdd = this.onAdd.bind(this);
    onSkillsChange=this.onSkillsChange.bind(this);
    
    onSkillsChange(event, values) {
      this.setState({skillset: values});
    }
    onChangetitle(event) {
        this.setState({title:event.target.value});
    }
    onChangepositions(event) {
        this.setState({positions:event.target.value});
    }
    onChangeapplications(event){
        this.setState({applications:event.target.value});
    }
    onChangedeadline(event){
        this.setState({deadline:event.target.value});
    }
    onChangeposting(event){
        this.setState({posting:event.target.value});
    }
    onChangeskillset(event) {
        this.setState({skillset:event.target.value});
    }
    onChangesalary(event) {
        this.setState({salary:event.target.value});
    }
    onChangetype(event) {
        this.setState({type:event.target.value});
    }
    onChangeduration(event) {
      this.setState({duration:event.target.value});
    }
    onAdd(e){ // add
        e.preventDefault();
        let date = new Date();
        if(this.state.deadline < date)
        {
            alert("deadline not valid");
            return;
        }
        if(this.state.posting < date)
        {
            alert("posting date not valid");
            return;
        }
        const newjob = {
            title:this.state.title,
            applications:this.state.applications,
            positions:this.state.positions,
            deadline:this.state.deadline,
            posting:this.state.posting,
            skillset:this.state.skillset,
            salary:this.state.salary,
            type:this.state.type,
            duration:this.state.duration,
            recruiter:localStorage.getItem("email"),
          };
          console.log(newjob);
          axios.post("http://localhost:4000/job/add/", newjob).then(res => {
          console.log("response add job", res);
          if(res.status===200) alert("added new job");
        }).catch(function(error){
          console.log(error);
        });
        this.setState({
          title:"",
          applications:"",
          positions:"",
          deadline:"",
          posting:"",
          skillset:"",
          salary:"",
          type:"",
          duration:"",
          skills:[],
        });
    }
    componentDidMount()
    {
      if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Recruiter") this.props.history.push("/");
    }
    render() {
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
                    <Nav.Link href="/recruiter/createjob" className="active">Add Job</Nav.Link>
                    <Nav.Link href="/recruiter/myjobs" >Jobs</Nav.Link>
                    <Nav.Link href="/recruiter/viewapps" >View Applications</Nav.Link>
                    <Nav.Link href="/recruiter/viewemps" >View employees</Nav.Link>
                    </Nav>
                  <Nav>
                    <Nav.Link href="/">Log out</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
                </Navbar>
                <br/>
                <form onSubmit={this.onAdd}>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                      <input type="string" className="form-control" onChange={this.onChangetitle} value={this.state.title} required placeholder="Title"/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Deadline</label>
                    <div className="col-sm-10">
                      <input type="datetime-local" className="form-control" onChange={this.onChangedeadline} value={this.state.deadline} min={new Date()} required placeholder="deadline for applications"/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Posting date</label>
                    <div className="col-sm-10">
                      <input type="date" className="form-control" onChange={this.onChangeposting} value={this.state.posting} min={new Date()} placeholder="date of recruitment" required/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Salary</label>
                    <div className="col-sm-10">
                      <input type="number" className="form-control" min="1" onChange={this.onChangesalary} value={this.state.salary} placeholder="Salary" required/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Job Type</label>
                    <div className="col-sm-10">
                    <select className="form-control" onChange={this.onChangetype}  required>
                      <option value="0">Full time</option>
                      <option value="1">Half time</option>
                      <option value="2">Work from home</option>
                    </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Applications</label>
                    <div className="col-sm-10">
                      <input type="number" className="form-control" min="1" onChange={this.onChangeapplications} value={this.state.applications} placeholder="Max number of Applications" required/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Positions</label>
                    <div className="col-sm-10">
                      <input type="number" className="form-control" min="1" onChange={this.onChangepositions} value={this.state.positions} placeholder="Max number of Positions" required/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Job Duration</label>
                    <div className="col-sm-10">
                    <select className="form-control" onChange={this.onChangeduration} defaultValue="0" required>
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="3">3 Months</option>
                      <option value="4">4 Months</option>
                      <option value="5">5 Months</option>
                      <option value="6">6 Months</option>
                      <option value="0">Indefinite</option>
                    </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Skillset</label>
                    <div className="col-sm-10">
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={topskills.map((option) => option.title)}
                    // defaultValue={skills}
                    value={this.state.skills}
                    freeSolo
                    onChange={this.onSkillsChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" label="Skills"  />
                    )}
                    />
                </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-10">
                      <button type="submit" className="btn btn-primary">Create Job</button>
                    </div>
                  </div>
                </form>
            </div>
        )
    }
}