import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './ayuda.css';
import Footer from "../footer/footer";
import Img1 from '../../assets/img2/img1.png';

function AyudaAdministrador() {
  const userLoggin = localStorage.getItem('user');
  let userData = null;

  if (userLoggin !== null) {
    userData = JSON.parse(userLoggin);
  }

  const [userName, setUserName] = useState(userData ? userData.name : '');
  const [userLastName, setUserLastName] = useState(userData ? userData.lastName : '');
  const [userEmail, setUserEmail] = useState(userData ? userData.email : '');
  const [comentarios, setComentarios] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (userLoggin === null) {
      navigate('/login'); // Redirect to login page if not logged in
    }
  }, [userLoggin, navigate]);

  function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
  }

  // Function to get records from localStorage
  function getRecords() {
    return JSON.parse(localStorage.getItem('records')) || [];
  }

  function saveRecords(records) {
    localStorage.setItem('records', JSON.stringify(records));
  }

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const newRecord = {
      name: userName,
      lastName: userLastName,
      email: userEmail,
      comentarios,
      timestamp: getCurrentDateTime(),
    };

    const records = getRecords();
    records.push(newRecord);
    saveRecords(records);

    // Reset form fields
    setComentarios('');

    // Navigate to confirmation page
    navigate("/main2");
  };

  return (
    <>
      {userLoggin !== null ? (
        <>
          <nav className={`navbar navbar-expand-lg fixed-top fon ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container-fluid">
              <img src={Img1} alt="Logo" className="navbar-brand" />
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <span className="nav-link text-white">Hola {userName} {userLastName}❤</span>
                  </li>
                
                  <li className="nav-item">
                    <Link to="/pagosAdministrador" className="nav-link text-white">Pagos</Link>
                  </li>
                 

                </ul>
              </div>
            </div>
          </nav>

          <div className="registro mt-4 pt-4">
            <div className="container mt-4 pt-4">
              <div className="form-container pt-4">
                <h2 className="text-center bg-warning p-4">¡Tiene dudas o algún problema con el pago? Coméntenos por acá!</h2>
                <form id="registerForm" onSubmit={handleSubmit}>
                 
                  <div className="text-center">
                  
                    <Link to="/mainAdministrador" className="footer-link ms-2">
                      <button type="button" className="btn btn-warning">Ver Comentarios</button>
                    </Link>
                  </div>

                </form>
              </div>
            </div>
            <Footer />
          </div>
        </>
      ) : null}
    </>
  );
}

export default AyudaAdministrador;