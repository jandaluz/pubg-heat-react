/*global overwolf*/

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import DragService from '../common/services/drag-service';
import WindowsService from '../common/services/windows-service';
import WindowsNames from '../common/constants/window-names';
import './nav.css';

const newNavbar = props => {
  const _headerRef = props.headerRef;
  let _dragService = props.dragService;
  // Make window draggable
  overwolf.windows.getCurrentWindow(result => {
    _dragService = new DragService(result.window, _headerRef.current);
  });

  const closeOnClick = async event => {
    await WindowsService.minimize(WindowsNames.IN_GAME);
  };
  return (
    <div id="slide" className="nav-container" ref={_headerRef}>
      <Navbar id="nav" bg="dark" variant="dark" fixed="top">
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav justify variant="tabs" className="mr-auto">
            <Nav.Link
              className="nav-link"
              eventKey="erangel"
              onSelect={props.onMapSelect}
            >
              Erangel
            </Nav.Link>
            <Nav.Link
              className="nav-link"
              eventKey="miramar"
              onSelect={props.onMapSelect}
            >
              Miramar
            </Nav.Link>
            <Nav.Link
              className="nav-link"
              eventKey="sanhok"
              onSelect={props.onMapSelect}
            >
              Sanhok
            </Nav.Link>
            <Nav.Link
              className="nav-link"
              eventKey="vikendi"
              onSelect={props.onMapSelect}
            >
              Vikendi
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav.Item>
          <Nav.Link id="min-btn" class="nav-link" onClick={closeOnClick}>
            X
          </Nav.Link>
        </Nav.Item>
      </Navbar>
    </div>
  );
};

export default newNavbar;
