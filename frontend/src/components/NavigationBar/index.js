import './index.css'
import React from 'react';
import Logo from '../../images/RateMio.png';
import { Nav, Container, Navbar, Image, NavDropdown, Form, Button } from 'react-bootstrap';

export default function NavigationBar() {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
                <Container fluid>
                    <Navbar.Brand href="/">RateMio<Image src={Logo} width="120px" height="50px" responsive/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Button variant="primary" href="/login" id="loginButton">Login</Button>
                        <Button variant="info" href="/register" id="registerButton">Register</Button>
                    </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}