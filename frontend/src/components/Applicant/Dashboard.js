import React, {Component} from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";
import axios from 'axios';
import Education from "./Education";
import AddEducation from "./Addeducation";
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
// import Tags from './Skills';

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

export default class Applicanthome extends Component {

    constructor(props) {
        super(props);
        this.state={
          name:"",
          type:"Applicant",
          email:localStorage.getItem("email"),
          education:[],
          skills:[],
        }
        this.onChange=this.onChange.bind(this);
        this.onDelete=this.onDelete.bind(this);
        this.onSkillsChange=this.onSkillsChange.bind(this);
        this.onSkillupd = this.onSkillupd.bind(this);
    }
    onSkillsChange = (event, values) => {
      console.log("onchang");
      this.setState({
        skills: values
      }, () => {
        // This will output an array of objects
        // given by Autocompelte options property.
        console.log(this.state.skills);
      });
    }
    onSkillupd(e)
    {
      e.preventDefault();
      console.log("myskills",this.state.skills);
      axios.post('http://localhost:4000/applicant/skill/upd/email',{email:localStorage.getItem("email"),"skills":this.state.skills})
          .then(response=>{
            console.log("response",response.data);
          })
          .catch(function(error){
            console.log(error);
          })
    }
    componentDidMount(){
      // get user information
      if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Applicant") this.props.history.push("/");
      axios.post('http://localhost:4000/applicant/email',{email:localStorage.getItem("email")})
        .then(response=>{
          this.setState({...response.data});
          console.log("state",this.state);
        })
        .catch(function(error){
          console.log(error);
        })
    }
    onChange(event){
      console.log("event",event);
      this.setState({education:[...this.state.education,event]})
    }
    onDelete(e){
      // axios.post('http://localhost:4000/applicant/email',{email:localStorage.getItem("email")})
      // .then(response=>{
      //   this.setState({...response.data});
      //   console.log("state",this.state);
      // })
      // .catch(function(error){
      //   console.log(error);
      // })
      axios.post("http://localhost:4000/applicant/edu/del/"+e,{email:localStorage.getItem("email")})
      .then(res=>{
          console.log("response del edu", res);
      })
      .catch(function(error){
          console.log(error);
        })
      let edu = this.state.education.filter(item => item._id !== e);
      this.setState({education:[...edu]});
      // alert("delete successful");
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
                  <Nav.Link href="/applicant/dashboard" className="active">Home</Nav.Link>
                  <Nav.Link href="/applicant/listjobs" >Browse Jobs</Nav.Link>
                  <Nav.Link href="/applicant/myjobs" >My Applications</Nav.Link>
                  </Nav>
                  <Nav>
                    <Nav.Link href="/">Log out</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <br/><h1> Appicant</h1><br/>
              <h2>Username :{this.state.name}</h2><br/>
              <h3>Email    : {this.state.email}</h3><br/>
                <br/>
                {/* <Tags skills={this.state.skills}/> */}
                <div className="row">
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
                  <button onClick={this.onSkillupd} className="btn btn-success">Update Skills</button>
                </div>
              <br/>
                <h3>Education :</h3>
                {this.state.education.map(edu=>{
                  return <Education id={edu._id} start={edu.start} end={edu.end} institute={edu.institute} delete={this.onDelete} key={edu._id} />
                })}
                <AddEducation onAdd={this.onChange} />
                  <br/>
                </div>
        );
    }
}
