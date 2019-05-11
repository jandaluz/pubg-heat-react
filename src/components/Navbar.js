/*global overwolf*/

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import DragService from '../common/services/drag-service';

const newNavbar = props => {
  const _headerRef = props.headerRef;
  let _dragService = props.dragService;
    // Make window draggable
    overwolf.windows.getCurrentWindow(result => {
      _dragService = new DragService(result.window, _headerRef.current)
    });
  return (
  <div id="slide" className="nav-container" ref={_headerRef}>
    <Navbar bg="dark" variant="dark" fixed="top" style={{width: props.width}}>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav justify variant="tabs" className="mr-auto">
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
)};

export default newNavbar;
