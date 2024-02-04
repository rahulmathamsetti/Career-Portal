import React, {Component} from 'react';
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";

export default class Login extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          email:" ",
          password: "",
          type:""
        };
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChangeEmail(event) {
        this.setState({email:event.target.value});
    }
    onChangePassword(event) {
      this.setState({ password: event.target.value });
    }
    onSubmit(e) {
      e.preventDefault();

      const newUser = {
        email: this.state.email,
        password: this.state.password
      };
    //   console.log(newUser);
      axios.post("http://localhost:4000/applicant/login", newUser).then(res => {
      console.log("response1", res);
      if (res.data.status === "empty") 
      {
        console.log("empty fields");
        alert("Please enter email and password");
      } 
      else if (res.data.status === "Applicant") 
      {
        console.log("Applicant");
        localStorage.setItem("type", "Applicant");
        this.props.history.push("/applicant/dashboard");
      } 
      else if (res.data.status==="Incorrect") 
      {
        console.log("incorrect password");
        alert("Incorrect Password! Try again.");
      }
      else if (res.data.status === "Register")
      {
              axios.post("http://localhost:4000/recruiter/login", newUser).then(res2 => {
                  console.log("response2", res2.data);
                  if (res2.data.status === "empty") 
                  {
                    console.log("empty fields");
                    alert("Please enter email and password");
                  } 
                  if (res2.data.status === "Recruiter") 
                  {
                    console.log("Recruiter");
                    localStorage.setItem("type", "Recruiter");
                    this.props.history.push("/recruiter/dashboard");
                  } 
                  else if (res2.data.status==="Incorrect") 
                  {
                    console.log("incorrect password");
                    alert("Incorrect Password! Try again.");
                  }
                  else if(res2.data.status==="Register")
                  {
                      console.log("not registered");
                      localStorage.setItem("type","");
                      alert("You are not registered. Register Now!");
                  }
              });
    }
    });
    localStorage.setItem("email", this.state.email);
    this.setState({
      email: "",
      password: "",
      type:""
    });
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
                    <Nav.Link href="/login" className="active">Login</Nav.Link>
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/register">Register</Nav.Link>
                  </Nav>
                  {/* <Nav>
                    <Nav.Link href="#deets">More deets</Nav.Link>
                  </Nav> */}
                </Navbar.Collapse>
              </Navbar>
                <form  onSubmit={this.onSubmit}>
                {/* <h3>Log in</h3> */}
                <div className="form-group" style={{marginTop:50}} >
                    <label>Email</label>
                    <input 
                        type="email"
                        className="form-control" 
                        placeholder="email" 
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password"
                        className="form-control" 
                        placeholder="password" 
                        value={this.state.password} 
                        onChange={this.onChangePassword}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-dark btn-lg ">Sign in</button>
                <p className="register text-right">
                    <a href="/register">Register</a>
                </p>
                </form>
            </div>
            )
    }
}
