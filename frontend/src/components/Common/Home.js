import React, {Component} from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar'
import { ReactComponent as Logo } from "../../logo.svg";
export default class Home extends Component {

    componentDidMount(){
        localStorage.clear();
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
                    <Nav.Link href="/" className="active">Home</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/register">Register</Nav.Link>
                  </Nav>
                  {/* <Nav>
                    <Nav.Link href="#deets">More deets</Nav.Link>
                  </Nav> */}
                </Navbar.Collapse>
              </Navbar>
              <div style={{padding:100, backgroundColor:"black",color:"white",textAlign:'center'}}>
                <h3>Hi</h3>
              </div>
            </div>
        );
    }
}
