import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Img1 from '../../assets/img2/img1.png';
import './navbar.css';



function Navbar() {
  const userLoggin = localStorage.getItem('user');
  let userData = null;

  if (userLoggin !== null) {
    userData = JSON.parse(userLoggin);
  }

  const [userName, setUserName] = useState(userData ? userData.name : '');
  const [userlastName, setUserLastName] = useState(userData ? userData.lastName : '');

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <>

      <nav className={`navbar navbar-expand-lg fixed-top fon ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-fluid">
          <img src={Img1} alt="Logo" className="navbar-brand" />

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              {userLoggin !== null ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link text-white">Hola {userName} {userlastName}❤</span>
                  </li>
                  <li className="nav-item">
                    <Link to="" className="nav-link text-white">Mi Cuenta</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/pagos" className="nav-link text-white">Pagos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/ayuda" className="nav-link text-white">Ayuda</Link>
                  </li>
                  <li className="nav-item">
                    <button type="button" className="nav-link btn btn-link text-white" onClick={handleLogout}>
                      Desconectar
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/registro" className="nav-link ml-3 color1">Registrate</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link ml-3 color2">Login</Link>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;