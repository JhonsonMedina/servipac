import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './registro.css';

function Registro() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [direction , setDirection] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordError(password !== confirmPassword);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    const isValid =
      name &&
      lastName &&
      direction&&
      email &&
      password &&
      confirmPassword &&
      !passwordError &&
      acceptTerms;

    setIsFormValid(isValid);
  }, [name, lastName,direction,  email, password, confirmPassword, passwordError, acceptTerms]);

  const handleSubmit = () => {
    if (!isFormValid) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    const user = {
      name,
      lastName,
      direction,
      email,
      password,
    };

    fetch('http://localhost:8080/api/v1/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.msg || 'Hubo un problema con el servidor');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.msg === 'Usuario creado correctamente') {
          alert('Registro exitoso');
          navigate('/');
        }
      })
      .catch((error) => {
        alert(error.message);
        console.error('Error:', error);
      });
  };

  const handleGoogleSignUp = () => {
    window.location.href = 'https://accounts.google.com/signin';
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="col-12 col-md-8 col-lg-6 p-4 shadow-sm rounded">
        <Link to="/" className="btn btn-link">
          <button className="close-button">X</button>
        </Link>

        <form>
          <div className="mb-3">
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="Nombre"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              id="lastName"
              type="text"
              className="form-control"
              placeholder="Apellido"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              id="direction"
              type="text"
              className="form-control"
              placeholder="direccion"
              onChange={(e) => setDirection(e.target.value)}
            />
          </div>


          <div className="mb-3">
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="row mb-3">
            <div className="col-6 position-relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div className="col-6 position-relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Repetir Contraseña"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          {passwordError && (
            <div className="text-danger mb-3">Las contraseñas no coinciden</div>
          )}

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="terms">
              Acepto términos y condiciones
            </label>
          </div>

          <div className="d-grid mt-4">
            <button
              type="button"
              className={`btn ${
                isFormValid ? 'btn-dark text-white' : 'btn-secondary'
              }`}
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Registrarme
            </button>
          </div>

          <div className="text-center my-4">
            <div className="d-flex align-items-center justify-content-center">
              <hr className="flex-grow-1" />
              <span className="mx-2">O</span>
              <hr className="flex-grow-1" />
            </div>
          </div>

          <div className="d-grid">
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center justify-content-center"
              onClick={handleGoogleSignUp}
            >
              <i
                className="bi bi-google"
                style={{ fontSize: '1.2rem', marginRight: '10px' }}
              ></i>
              Registrarme con Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;