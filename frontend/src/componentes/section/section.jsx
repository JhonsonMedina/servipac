import React from 'react';
import Img2 from '../../assets/img2/img2.png';
import Img3 from '../../assets/img2/img3.webp';
import Img4 from '../../assets/img2/img4.avif';
import Img6 from '../../assets/img2/img9.jpeg';
import { Link } from 'react-router-dom';


import './section.css';


function Section() {
  return (
    <>

      <div className='pt-4'>
      <div className="container pt-4">
        <div className="row align-items-center ">
          <div className="col-md-6 order-md-2 pt-4">
            <img src={Img2} alt="Header Image" className="img-fluid" />
          </div>
          <div className="col-md-6 order-md-1 pt-4">
            <h1>Bienvenidos</h1>
            <p>Servipag es una plataforma que facilita el pago de diversas cuentas y servicios de manera rápida y sencilla. A través de su sitio web y aplicación móvil, los usuarios pueden gestionar sus pagos desde la comodidad de su hogar, evitando largas filas y ahorrando tiempo. La plataforma ofrece una interfaz intuitiva y segura, permitiendo a los usuarios realizar transacciones con confianza. Además, Servipag está en constante evolución, incorporando nuevas funcionalidades para mejorar la
                 experiencia del usuario y adaptarse a las necesidades del mercado.</p>
            
          </div>
        </div>
      </div>
      </div>

      <section className="hero mt-5 margen pt-4">
        <div className="container">
          <div className="row">

          <div className="col-md-6">
              <img src={Img6} alt="Hero Image" className="img-fluid" />
            </div>
            <div className="col-md-6 mb-5 text-center">
              <div className="hero__text ">
                <h1 className="hero__title ">Paga tus cuentas</h1>
                <p className="hero__description">De forma directa, fácil y sencilla.</p>
                <Link to="/productosAgregados">
                <button className="btn btn-primary">Pago rápido</button>
                </Link>
              </div>
            </div>
           
          </div>
        </div>
      </section>

      <section className="process mt-5 pt-4">
        <div className="container">
          <h2 className="process__title text-center">¿Cómo pagar una cuenta sin registro?</h2>
          <div className="row mt-4 pt-4">
            <div className="col-md-4 text-center">
            <img src={Img4} alt="Realizar el pago" className="img-fluid mb-3 foto" />
            
              <p className="process__description">Buscar el servicio</p>
            </div>
            <div className="col-md-4 text-center">
            <img src={Img4} alt="Realizar el pago" className="img-fluid mb-3" />
              <p className="process__description">Selecciona la empresa</p>
            </div>
            <div className="col-md-4 text-center">
            <img src={Img3} alt="Realizar el pago" className="img-fluid mb-3" />
              <p className="process__description">Realizar el pago</p>
            </div>
          </div>
        </div>
      </section>




      
    </>
  );
}

export default Section;