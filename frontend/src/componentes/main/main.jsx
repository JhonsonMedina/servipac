import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import './main.css';
import { Link,useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

function MainAdministrador() {
    const navigate = useNavigate();
    const userLoggin = localStorage.getItem('user');
    let userData = null;
  
    if (userLoggin !== null) {
      userData = JSON.parse(userLoggin);
    }


      useEffect(() => {
        if (userLoggin === null) {
          navigate('/login'); // Redirect to login page if not logged in
        }
      }, [userLoggin, navigate]);

    const [records, setRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    // Cargar registros de localStorage al montar el componente
    useEffect(() => {
        const storedRecords = getRecords();
        setRecords(storedRecords);
    }, []);

    // Función para obtener registros del localStorage
    function getRecords() {
        return JSON.parse(localStorage.getItem('records')) || [];
    }

    // Manejar búsqueda
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredRecords = getRecords().filter(record =>
            record.name.toLowerCase().includes(query) ||
            record.lastName.toLowerCase().includes(query) ||
            record.email.toLowerCase().includes(query)
        );
        setRecords(filteredRecords);
        setCurrentPage(1); // Reset to first page on new search
    };

    // Obtener registros actuales para la página actual
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Manejar exportación a Excel
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(records);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
        XLSX.writeFile(workbook, "registros.xlsx");
    };

    // Paginación centrada
    const pageNumbers = [];
    const totalPages = Math.ceil(records.length / recordsPerPage);
    const maxPagesToShow = 5;
    let startPage, endPage;
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Navbar />
            <div className="main">
                <div className="container">
                    <h2 className="text-center bg-warning p-4">Registros</h2>
                    <input
                        type="text"
                        id="search"
                        className="form-control mb-3"
                        placeholder="Buscar Usuario"
                        onChange={handleSearch}
                    />
                    <div id="records">
                        {currentRecords.length === 0 ? (
                            <p>No hay registros.</p>
                        ) : (
                            <ul className="list-group">
                                {currentRecords.map((record, index) => (
                                    <li key={index} className="list-group-item">
                                        <strong>{record.name} {record.lastName}</strong> ({record.email}) dijo:<br />
                                        {record.comentarios}<br />
                                        <small className="text-muted">en {record.timestamp}</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div id="pagination" className="pagination mt-3">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`btn btn-${currentPage === number ? 'primary' : 'secondary'} mx-1`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                    <div className="text-center">
                        <button type="button" id="exportExcel" className="btn btn-warning mt-4 p-2" onClick={handleExportExcel}>
                            Exportar a Excel
                        </button>
                    </div>
                    <Link to="/ayuda" className="footer-link">
                        <div className="text-center">
                            <button type="button" className="btn btn-warning mt-4 p-2 regresar mb-2">
                                Regresar
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MainAdministrador;