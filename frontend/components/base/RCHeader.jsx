/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from "../../src/RCA/auth";
import '../../styles/header.css';
import logo from "../../public/img/foot-logo_1.png";
import { useState } from 'react';




function RCHeader() {



  const [isOpen, setIsOpen] = useState(false);

  const ToggleDropDown = () => {

    setIsOpen(!isOpen);

  }



const GetUserName = (fullName) => {
  if (!fullName) return "";
  return fullName.split(" ")[0]; // Divide por espacio y toma la primera palabra

};


const [isLoggedIn, user] = useAuthStore((state) => [
  state.isLoggedIn,
  state.user
  ]);
  console.log("User data:", user());
  console.log("isLoggedIn:", isLoggedIn());

  

  return (
    <header className="app-header">
      <div className="header-content">
      <img src={logo} alt="Company Logo" 
      style={{ height: '50px', marginRight: '10px', borderRadius: '40px', boxShadow: '2px 1px 5px 1px #19285c82'}} />
        <Link to="/" className="logo">Quote Generator</Link>
        
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/quote-searcher">Quote Searcher</Link>
          <Link to="/clients">Our Clients</Link>
          <Link to="/coverage">Coverage</Link>
        </nav>

        <div className="user-actions">

          {isLoggedIn() ? (
            <>
              <span className="user-greeting">Hi Dear,  {GetUserName(user().full_name)}</span>
              {/* <Link to="/dashboard" className="headerbtn"></Link> */}
              <Link to="/logout" className="headerbtn">Logout</Link>
            </>
          ) 
          : (
            <>
              <span className="user-greeting">Hi Dear, User</span>
              <Link to="/register" className="headerbtn">Register</Link>
              <Link to="/login" className="headerbtn">Login</Link>
            </>

          )}



<div className="dropdown">
       <>

       <p className='dropdown-button ' onClick={ToggleDropDown}>Options</p>
       
       </>
      {isOpen && (
        <ul className="dropdown-menu">
          <li><a href="/user-info-form">Quote Calculator</a></li>
          <li><a href="/quote-searcher">Searcher</a></li>
          <li><a href="/about-service">About the tool</a></li>
        </ul>
      )}
    </div>
        </div>
      </div>
    </header>
  );
}

export default RCHeader