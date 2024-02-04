import React, {Component} from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import { ReactComponent as Logo } from "../../logo.svg";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

export default class Recruiterhome extends Component {

    state={
      name:"",
      type:"Recruiter",
      email:localStorage.getItem("email"),
      bio:"",
      number:"",
      count:0,
    };
    onChangenumber=this.onChangenumber.bind(this);
    onChangebio=this.onChangebio.bind(this);
    onUpdate=this.onUpdate.bind(this);
    componentDidMount(){
      if(!localStorage.getItem("email") || localStorage.getItem("type")!=="Recruiter") this.props.history.push("/");
        // get user information
        axios.post('http://localhost:4000/recruiter/email',{email:localStorage.getItem("email")})
          .then(response=>{
            this.setState({...response.data});
            console.log("state",this.state);
          })
          .catch(function(error){
            console.log(error);
          })
      }
    onChangenumber(event){
        this.setState({number:event.target.value});
    }
    onChangebio(event){
        let s = event.target.value;
        s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
        s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
        s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
        let c = s.split(' ').filter(function(str){return str!="";}).length;
        //return s.split(' ').filter(String).length; - this can also be used
        if(c>250) alert("Limit 250 words");
        else this.setState({bio:event.target.value,count:c});
    }
    onUpdate(e){
        e.preventDefault();
        const data={
            email:localStorage.getItem("email"),
            bio: this.state.bio,
            number:this.state.number
        }
        console.log(data);
        axios.post("http://localhost:4000/recruiter/update",data)
        .then(res=>{
            console.log("response upd rec", res);
            if(res.data.status!=="empty")
                alert("updated user info");
        })
        .catch(function(error){
            console.log(error);
          })
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
                    <Nav.Link href="/recruiter/dashboard" className="active">Home</Nav.Link>
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
              <br/><h1> Recruiter</h1><br/>
              <h2>Username :{this.state.name}</h2><br/>
              <h3>Email    : {this.state.email}</h3><br/>
              <br/>
                <PhoneInput
                    value={this.state.number}
                    onChange={number => this.setState({ number})}
                  />
                  <div style={{marginTop:10}}>
                      <label>Bio:</label>
                    <div style={{paddingTop:10}}>
                        <textarea expand value={this.state.bio} onChange={this.onChangebio}/>
                        {this.state.count!==0 && <p>{this.state.count}/250</p>}
                    </div>
                    <button onClick={this.onUpdate} style={{marginLeft:10}} 
                    className="btn text-right btn-dark btn-lg">
                        Update Info
                    </button>
                  </div>
                </div>
        );
    }
}