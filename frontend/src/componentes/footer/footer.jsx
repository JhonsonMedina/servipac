import React from 'react';
import Im1 from "../../assets/img2/im1.png";
import Im2 from "../../assets/img2/im2.png";
import Im3 from "../../assets/img2/im3.png";
import './footer.css';

function Footer() {
    return (
        <footer className="footer bg-dark text-white  mt-4 pt-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <h4 className="footer__title">Corporativo</h4>
                        <ul className="list-unstyled ">
                            <li>Historia</li>
                            <li>Trabaja con nosotros</li>
                            <li>Ética y cumplimiento</li>
                            <li>Política de Privacidad</li>
                            
                        </ul>
                    </div>
                    <div className="col-md-4 text-center  ">
                        <h4 className="footer__title">Canales de Atención</h4>
                        <ul className="list-unstyled text-center ">
                        <li>Términos y Condiciones</li>
                            <li>yoPAG</li>
                            <li>Sucursales</li>
                            <li>APP Servipag</li>
                        </ul>
                    </div>
                    <div className="col-md-4 text-center ">
                        <h4 className="footer__title">Te ayudamos</h4>
                        <ul className="list-unstyled text-center ">
                            <li >Preguntas Frecuentes</li>
                            <li>Recupera tu comprobante</li>
                            <li>Recupera tu póliza SOAP</li>
                            <li>Contáctanos</li>
                        </ul>
                    </div>
                    
                </div>
                
            </div>
        </footer>
    );
}

export default Footer;