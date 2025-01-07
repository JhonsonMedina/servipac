import React from 'react';
import { createBrowserRouter, NavLink } from 'react-router-dom';
import ErrorPage from '../../error-page.jsx';
import Registro from '../registro/registro.jsx';
import Login from '../login/login.jsx';
import App from '../../App.jsx';
import Main from '../main/main.jsx'
import Main2 from '../main2/main2.jsx';
import Navbar from '../navbar/navbar.jsx';
import Section from '../section/section.jsx';
import Footer from '../footer/footer.jsx';
import Root from '../../root.jsx';
import Pagos from '../pagos/pagos.jsx';
import ProductosAgregados from '../pagos/productosAgregados.jsx';
import Ayuda from '../ayuda/ayuda.jsx';
import AyudaAdministrador from '../ayuda/ayudaAdminitrador.jsx';
import MainAdministrador from '../main/main.jsx';

const router = createBrowserRouter([
  {
    path: '/app',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <Root/>,
    
  },

  {
    path: '/navbar',
    element: <Navbar/>,
    
  },

  {
    path: '/footer',
    element: <Footer/>,
   
  },

  {
    path: '/section',
    element: <Section/>,
   
  },
  {
    path: '/registro',
    element: <Registro />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/mainAdministrador',
    element: <MainAdministrador />,
  },
  {
    path: '/ayuda',
    element: <Ayuda />,
  },
  {
    path: '/main2',
    element: <Main2 />,
  },


  {
    path: '/pagosAdministrador',
    element: <Pagos/>,
  },

  {
    path: '/productosAgregados',
    element: <ProductosAgregados/>,
    
  },

  {
    path: '/ayudaAdministrador',
    element: <AyudaAdministrador/>,
    
  },

]);

export default router;
  
     
    
   
    