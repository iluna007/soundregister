import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import appStore from "../store/appStore";
import { logoutUser } from "../actions/appActions";


const Header = () => {
	const [user, setUser] = useState(appStore.getState().user); // Initialize with current user state

	// Subscribe to store updates to track user changes
	useEffect(() => {
		const handleStoreChange = () => {
			setUser(appStore.getState().user); // Update user state
		};
		appStore.subscribe(handleStoreChange);

		// Cleanup subscription on component unmount
		return () => appStore.unsubscribe(handleStoreChange);
	}, []);

	// Handle sign-out functionality
	const handleSignOut = () => {
		logoutUser()(appStore.handleAction.bind(appStore));
		window.location.href = "/auth";
	};

	return (
		<Navbar bg='warning' expand='lg'>
			<Container>
				<Navbar.Brand as={Link} to='/'>
					Sound Register
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='ms-auto'>
						<Nav.Link as={Link} to='/'>
							Home
						</Nav.Link>
						<Nav.Link as={Link} to='/records'>
							Records
						</Nav.Link>
						<Nav.Link as={Link} to='/about'>
							About
						</Nav.Link>

						{/* User-specific navigation */}
						{user ? (
							<NavDropdown title={`Hi, ${user.username}`} id='user-dropdown'>
								<NavDropdown.Item as={Link} to='/dash'>
									My Dashboard
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item onClick={handleSignOut}>
									Sign Out
								</NavDropdown.Item>
							</NavDropdown>
						) : (
							<Nav.Link as={Link} to='/auth'>
								Sign In/Up
							</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Header;
