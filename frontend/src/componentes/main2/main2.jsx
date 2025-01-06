import React from "react";
import Servi1 from '../../assets/img2/servi1.png';
import './main2.css';
 import { Link } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
 
function Main2 (){

    return(

<>

<Navbar />
<header className="fondoCompleto h100">
<div className="card p-5  fondo" >
<div className="card p-5 mt-5 bg-warning" >
<div className="card p-5 mt-5" >
  <div className="row g-0 ">
    <div className="col-md-4">
    <img src={Servi1} alt=""  />
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h5 className="card-title text-center">!!!!!  HEMOS ENVIANDO SU COMENTARIO  !!!!</h5>
        <h5 className="card-title text-center">LO CONTACTAREMOS A LA BREVEDAS</h5>
       
        <Link to="/main" className="footer-link">
        <div className="text-center">
        <button type="button" className="btn btn-warning mt-4 p-2 ">
         Regresar
        </button>
        </div>
        </Link>
                  
        
        
      </div>
    </div>
  </div>
</div>
</div>
</div>

</header>

<Footer />
</>

    )
}

export default Main2;