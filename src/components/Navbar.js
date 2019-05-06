import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const newNavbar = props => (
  <div id="slide" className="nav-container">
    <Navbar bg="dark" variant="dark">
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link eventKey="erangel" onSelect={props.onMapSelect} style={{ "color": "#F2A900" }}>
            Erangel
          </Nav.Link>
          <Nav.Link eventKey="miramar" onSelect={props.onMapSelect} style={{ "color": "#F2A900" }}>
            Miramar
          </Nav.Link>
          <Nav.Link eventKey="sanhok" onSelect={props.onMapSelect} style={{ "color": "#F2A900" }}>
            Sanhok
          </Nav.Link>
          <Nav.Link eventKey="vikendi" onSelect={props.onMapSelect} style={{ "color": "#F2A900" }}>
            Vikendi
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

export default newNavbar;
