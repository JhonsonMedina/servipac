import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './ayuda.css'
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

function Ayuda() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [comentarios, setComentarios] = useState("");
    const navigate = useNavigate();

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
            name,
            lastName,
            email,
            comentarios,
            timestamp: getCurrentDateTime(),
        };

        const records = getRecords();
        records.push(newRecord);
        saveRecords(records);

        // Reset form fields
        setName("");
        setLastName("");
        setEmail("");
        setComentarios("");

        // Navigate to confirmation page
        navigate("/main2");
    };

    return (
        <>
            <Navbar />
            <div className="registro mt-4 pt-4">
                <div className="container mt-4 pt-4">
                    <div className="form-container pt-4">
                        <h2 className="text-center bg-warning p-4">¡Tiene dudas o algún problema con el pago? Coméntenos por acá!</h2>
                        <form id="registerForm" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Ingresa tu nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    placeholder="Ingresa tu apellido"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Correo</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Ingresa tu correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comentarios" className="form-label">Comentarios</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="comentarios"
                                    value={comentarios}
                                    onChange={(e) => setComentarios(e.target.value)}
                                    placeholder="Escribe tu comentario"
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-warning">Comenta</button>
                                <Link to="/main" className="footer-link ms-2">
                                    <button type="button" className="btn btn-warning">Ver Comentarios</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Ayuda;