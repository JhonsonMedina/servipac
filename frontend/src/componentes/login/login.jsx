import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userLoggeado, setUserLoggeado] = useState({});
  const [userNavigate, setUserNavigate] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    window.location.reload();
  };

  const handleSubmit = () => {
    if (!email || !password) {
      alert('todos los campos son obligatorios');
      return;
    }

    const user = {
      email: email,
      password: password,
    };

    document.getElementById('email').value = '';
    document.getElementById('password').value = '';

    fetch('http://localhost:8080/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setEmail('');
          setPassword('');
          setUserLoggeado(data);
          localStorage.setItem('token', JSON.stringify(data.token));
          if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(data.data));
            localStorage.setItem('rememberMe', 'true');
          }
        } else {
          alert('Usuario o contraseña incorrecta');
        }
      })
      .catch((error) => {
        console.error('error:', error);
        alert('Ocurrió un error. Intente nuevamente.');
      });
  };

  useEffect(() => {
    if (localStorage.getItem('rememberMe') === 'true') {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUserLoggeado({ status: 200, data: storedUser });
    }
  }, []);

  useEffect(() => {
    if (userLoggeado.status === 200) {
      localStorage.setItem('user', JSON.stringify(userLoggeado.data));
      setUserNavigate(true);
    }
  }, [userLoggeado]);

  useEffect(() => {
    if (userNavigate) {
      navigate('/');
    }
  }, [navigate, userNavigate]);

  return (
    <>
      <div className='login template d-flex justify-content-center align-items-center vh-100 fondo'>
        <div className='form_container p-5 rounded bg-white'>
          <form>
            <h4 className='text-center color-fondo-login mt-2'>
              Iniciar Sesión
            </h4>
            <div className='mb-3'>
              <label className='color-fondo-login' htmlFor='email'>
                Email
              </label>
              <input
                type='email'
                placeholder='Ingrese su Email'
                className='form-control'
                id='email'
                onChange={handleEmail}
              />
            </div>
            <div className='mb-3'>
              <label className='color-fondo-login' htmlFor='password'>
                Contraseña
              </label>
              <input
                type='password'
                placeholder='Ingrese su contraseña'
                className='form-control'
                id='password'
                onChange={handlePassword}
              />
            </div>
            <div className='mb-3 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='check'
                onChange={handleRememberMe}
              />
              <label
                htmlFor='check'
                className='form-check-label ms-2 color-fondo-login'
              >
                Recordarme
              </label>
            </div>
            <div className='d-grid mb-3'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleSubmit}
              >
                Ingresar
              </button>
            </div>
            <div className='d-grid mb-3 text-center'>
              <Link to='/registro'>
                <button type='button' className='btn btn-secondary'>
                  Regístrate
                </button>
              </Link>
            </div>
          </form>

          {localStorage.getItem('user') !== null && (
            <div className='fondo-backend mt-3'>
              <p className='text-center'>
                Bienvenido(a) {userLoggeado.data?.name} {userLoggeado.data?.lastName}
              </p>
              <p className='justi-textosession'>
                A continuación serás redirigido a la página de Inicio
              </p>
              <div className='d-grid mb-3'>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={handleLogout}
                >
                  Desconectar
                </button>
              </div>
            </div>
          )}
        
        </div>
      </div>
    </>
  );
}

export default Login;