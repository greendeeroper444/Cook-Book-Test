import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { UserContext } from '../../contexts/userContext';
import toast from 'react-hot-toast';
import { Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';


export default function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [isNavCollapsed, setNavCollapsed] = useState(true);

    const handleSignout = async () => {
        try {
            const response = await axios.post('/signout', {}, { 
                withCredentials: true 
            });
            // localStorage.removeItem('selectedRecipe')
            setUser(null);
            navigate('/');
            toast.success(response.data.message)
        
        } catch (error) {
            console.log(error)
        }
    }

    const handleToggleNav = () => {
        setNavCollapsed(!isNavCollapsed)
    }

  return (
    <BootstrapNavbar bg="light" expand="lg">
        <Nav className="mr-auto">
            <Link to="/home" className="nav-link mx-2">Home</Link>
        </Nav>
        <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleToggleNav} />
        <BootstrapNavbar.Collapse id="responsive-navbar-nav" 
        className={`justify-content-end ${isNavCollapsed ? 'collapse' : ''}`}>
            <Nav className="right navbar-nav">
                {
                    !!user && (
                        <Link to="#" className="nav-link mx-2">Hello, {user.name}</Link>
                    )
                }
                <Button variant="light" className="mx-2" onClick={handleSignout}>
                    Sign out
                </Button>
            </Nav>
        </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  )
}