import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    localStorage.removeItem('rememberedEmail');
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const user = {
      email: email,
      password: password,
    };

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
          setUserLoggeado(data);
          localStorage.setItem('token', JSON.stringify(data.token));
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberMe');
          }
        } else {
          alert('Usuario o contraseña incorrecta');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Ocurrió un error. Intente nuevamente.');
      });
  };

  useEffect(() => {
    if (localStorage.getItem('rememberMe') === 'true') {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
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
  }, [userNavigate, navigate]);

  return (
    <>
      <div className='login template d-flex justify-content-center align-items-center vh-100 fondo'>
        <div className='form_container p-5 rounded bg-white'>
          <form onSubmit={handleSubmit}>
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
                value={email}
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
                value={password}
                onChange={handlePassword}
              />
            </div>
            <div className='mb-3 form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id='check'
                checked={rememberMe}
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
                type='submit'
                className='btn btn-primary'
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
                <Link to='/' className='mt-3'>
                <button type='button' className='btn btn-warning'>
                  Regresar
                </button>
                </Link>
             
            </div>
          </form>

          {userLoggeado.status === 200 && (
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