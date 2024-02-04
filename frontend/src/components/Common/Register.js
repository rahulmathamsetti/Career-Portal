import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      type: "Applicant"
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeName(event) {
    this.setState({ name: event.target.value });
  }
  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }
  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  onChangeType(event) {
    this.setState({ type: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email,
      type: this.state.type
    };
    if(!this.state.name || !this.state.password || !this.state.email || !this.state.type)
    {
        alert("fill all the details");
    }
    else{
        console.log("New user:", newUser);
        if(this.state.type==='Recruiter'){ 
            axios.post("http://localhost:4000/recruiter/register", newUser).then(res => {
              if (res.data.status==="Already registered") alert("This Email has already been registered");
              console.log(res.data);
            });
        }
        else if(this.state.type==='Applicant'){
            axios.post("http://localhost:4000/applicant/register", newUser).then(res => {
              if (res.data.status === "Already registered") alert("This Email has already been registered");
              console.log(res.data);
            });
        }
        this.setState({
          name: "",
          email: "",
          password: "",
          type: "Applicant"
        });
        this.props.history.push("/login");
    }
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
                    <Nav.Link href="/register" className="active">Register</Nav.Link>
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav>
                  {/* <Nav>
                    <Nav.Link href="#deets">More deets</Nav.Link>
                  </Nav> */}
                </Navbar.Collapse>
              </Navbar>
        <br/>
        <br/>
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
              required
            />
          </div>
          <div className="form-group">
            <label>Email: </label>
            <input
              type="email"
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
              required
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
              required
            />
          </div>
          <Form.Group
            value={this.state.type}
            onChange={this.onChangeType}
          >
            <Form.Label>Type:</Form.Label>
            <Form.Control as="select">
              <option value="Applicant">Applicant</option>
              <option value="Recruiter">Recruiter</option>
            </Form.Control>
          </Form.Group>
          <div className="form-group">
            <input type="submit" value="Register" className="btn btn-primary" />
          </div>
        </Form>
      </div>
    );
  }
}