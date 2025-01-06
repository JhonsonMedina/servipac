import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagos.css';
import Img1 from '../../assets/img2/img1.png';
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Link } from "react-router-dom";

// Inicialización de Mercado Pago
initMercadoPago('APP_USR-c7b9fa30-af3f-4739-8970-834a2903a533', { locale: 'es-CL' });

const Pagos = () => {
  const userLoggin = localStorage.getItem('user');
  let userData = null;

  if (userLoggin !== null) {
    userData = JSON.parse(userLoggin);
  }

  const [userName, setUserName] = useState(userData ? userData.name : '');
  const [userlastName, setUserLastName] = useState(userData ? userData.lastName : '');
  const [preferenceId, setPreferenceId] = useState(null);
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem(`${userName}_products`)) || {});
  const [debtDetails, setDebtDetails] = useState(JSON.parse(localStorage.getItem(`${userName}_debtDetails`)) || []);
  const [totalDebt, setTotalDebt] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successfulPayments, setSuccessfulPayments] = useState(JSON.parse(localStorage.getItem(`${userName}_successfulPayments`)) || []);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 6;
  const [cartDisabled, setCartDisabled] = useState(JSON.parse(localStorage.getItem(`${userName}_cartDisabled`)) || {});

  const [isScrolled, setIsScrolled] = useState(false);

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
    localStorage.setItem(`${userName}_products`, JSON.stringify(products));
    calculateTotalDebt();
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${userName}_debtDetails`, JSON.stringify(debtDetails));
    calculateTotalDebt();
  }, [debtDetails]);

  useEffect(() => {
    localStorage.setItem(`${userName}_successfulPayments`, JSON.stringify(successfulPayments));
  }, [successfulPayments]);

  useEffect(() => {
    localStorage.setItem(`${userName}_cartDisabled`, JSON.stringify(cartDisabled));
  }, [cartDisabled]);

  const handleProductFormSubmit = (e) => {
    e.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageUrl = event.target.result;
      const name = document.getElementById('nameInput').value.trim();
      const price = parseFloat(document.getElementById('priceInput').value).toFixed(2);
      const discount = parseFloat(document.getElementById('discountInput').value) || 0;
      const discountedPrice = (price - (price * (discount / 100))).toFixed(2);
      const month = document.getElementById('monthInput').value;

      setProducts((prevProducts) => {
        const updatedProducts = { ...prevProducts };
        updatedProducts[name] = { price, discount, discountedPrice, imageUrl, month };
        return updatedProducts;
      });

      clearFormFields();
    };

    reader.readAsDataURL(file);
  };

  const calculateTotalDebt = () => {
    const total = debtDetails.reduce((sum, debt) => sum + debt.total, 0);
    setTotalDebt(total);
  };

  const clearFormFields = () => {
    document.getElementById('imageInput').value = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('priceInput').value = '';
    document.getElementById('discountInput').value = '';
    document.getElementById('monthInput').value = '';
  };

  const removeProduct = (name) => {
    setProducts((prevProducts) => {
      const updatedProducts = { ...prevProducts };
      delete updatedProducts[name];
      return updatedProducts;
    });
    setCartDisabled((prev) => {
      const updatedCartDisabled = { ...prev };
      delete updatedCartDisabled[name];
      localStorage.setItem(`${userName}_cartDisabled`, JSON.stringify(updatedCartDisabled));
      return updatedCartDisabled;
    });
  };

  const addToGlobalAccount = (name) => {
    const product = products[name];
    const total = parseFloat(product.discountedPrice);
    setDebtDetails((prevDebtDetails) => [...prevDebtDetails, { name, total, month: product.month, paidAt: null }]);
    setCartDisabled((prev) => ({ ...prev, [name]: true })); // Disable the specific "Añadir al carrito" button
  };

  const removeDebt = (index) => {
    setDebtDetails((prevDebtDetails) => {
      const updatedDebtDetails = [...prevDebtDetails];
      updatedDebtDetails.splice(index, 1);
      return updatedDebtDetails;
    });
  };

  const createPreference = async () => {
    const preferenceData = {
      items: debtDetails.map(debt => ({
        title: debt.name,
        unit_price: debt.total,
        quantity: 1,
      })),
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      auto_return: 'approved',
    };

    try {
      const response = await axios.post('http://localhost:8080/create_preference', preferenceData);
      const { id } = response.data;
      return id;
    } catch (error) {
      console.error('Error al crear preferencia:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
    }
  };

  const paySelectedDebts = () => {
    if (debtDetails.length === 0) {
      alert('No hay deudas para pagar.');
      return;
    }

    // Marcar las deudas como pagadas
    const now = new Date().toLocaleString();
    const paidDebts = debtDetails.map(debt => ({ ...debt, paidAt: now }));

    setDebtDetails([]);
    setSuccessfulPayments((prevPayments) => [...prevPayments, ...paidDebts]);
    localStorage.setItem(`${userName}_successfulPayments`, JSON.stringify([...successfulPayments, ...paidDebts]));
    setPaymentSuccess(true);
    setCartDisabled({}); // Enable all "Añadir al carrito" buttons after payment
    setTimeout(() => setPaymentSuccess(false), 5000); // Hide success message after 5 seconds
  };

  // Calculate the current list of payments to display based on the current page
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = successfulPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  // Determine the number of pages
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(successfulPayments.length / paymentsPerPage); i++) {
    pageNumbers.push(i);
  }

  const removePayment = (index) => {
    setSuccessfulPayments((prevPayments) => {
      const updatedPayments = [...prevPayments];
      updatedPayments.splice(index, 1);
      localStorage.setItem(`${userName}_successfulPayments`, JSON.stringify(updatedPayments));
      return updatedPayments;
    });
  };

  return (
    <>
      <div>
        <nav className={`navbar navbar-expand-lg navbar-light fon fixed-top ${isScrolled ? 'scrolled' : ''}`}>
          <img src={Img1} alt="Logo" className="navbar-brand" />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              {userLoggin !== null ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link text-white">Hola {userName} {userlastName}❤</span>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-white" href="#" data-toggle="modal" data-target="#debtDetailModal">Ver Pagos ${totalDebt.toFixed(2)}</a>
                  </li>
                  <li className="nav-item">
                  <Link to="/"lassName="nav-link text-white">Regresar</Link>
                  </li>
                </>
              ) : (
                <>
                </>
              )}
            </ul>
          </div>
        </nav>

        <div className="container mt-4">
          <h1>Agregar Producto</h1>
          <form id="productForm" onSubmit={handleProductFormSubmit}>
            <div className="form-group">
              <label htmlFor="imageInput">Seleccionar imagen:</label>
              <input type="file" className="form-control-file" id="imageInput" accept="image/*" required />
            </div>
            <div className="form-group">
              <label htmlFor="nameInput">Nombre del Producto:</label>
              <input type="text" className="form-control" id="nameInput" required />
            </div>
            <div className="form-group">
              <label htmlFor="priceInput">Precio:</label>
              <input type="number" className="form-control" id="priceInput" step="0.01" required />
            </div>
            <div className="form-group">
              <label htmlFor="discountInput">Descuento (%):</label>
              <input type="number" className="form-control" id="discountInput" step="0.01" />
            </div>
            <div className="form-group">
              <label htmlFor="monthInput">Mes:</label>
              <input type="text" className="form-control" id="monthInput" required />
            </div>
            <button type="submit" className="btn btn-primary">Agregar Producto</button>
          </form>

          <h2 className="mt-5">Productos Agregados</h2>
          <div className="row" id="productDisplay">
            {Object.keys(products).map(name => {
              const product = products[name];
              return (
                <div className="col-md-4 mb-4" key={name}>
                  <div className="card">
                    <img src={product.imageUrl} className="card-img-top" alt="Product" />
                    <div className="card-body">
                      <h5 className="card-title">{name}</h5>
                      {product.discount > 0 ? (
                        <p className="card-text">Precio: <s>${product.price}</s> ${product.discountedPrice}</p>
                      ) : (
                        <p className="card-text">Precio: ${product.price}</p>
                      )}
                      <p className="card-text">Mes: {product.month}</p>
                      <button className="btn btn-danger" onClick={() => removeProduct(name)}>Sin Stock</button>
                      <button className="btn btn-success" onClick={() => addToGlobalAccount(name)} disabled={cartDisabled[name]}>Añadir al carrito</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal fade" id="debtDetailModal" tabIndex="-1" role="dialog" aria-labelledby="debtDetailModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="debtDetailModalLabel">Detalle de Deudas</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Mes</th>
                      <th>Fecha</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtDetails.map((debt, index) => (
                      <tr key={index}>
                        <td>{debt.name}</td>
                        <td>${debt.total.toFixed(2)}</td>
                        <td>{debt.month}</td>
                        <td>{debt.paidAt ? debt.paidAt : 'Sin Pagar'}</td>
                        <td className="text-center remove"><span className="remove-product bg-danger rounded-circle text-white" onClick={() => removeDebt(index)}>&times;</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preferenceId && (
                  <Wallet initialization={{ preferenceId }} />
                )}
              </div>
              <div className="modal-footer">
                <span><strong>Total Seleccionado:</strong> ${totalDebt.toFixed(2)}</span>
                <button type="button" className="btn btn-primary" onClick={paySelectedDebts}>Pagar {totalDebt.toFixed(2)}</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-4">
          <h2>Registro de Pagos Realizados</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Total</th>
                <th>Mes</th>
                <th>Fecha y Hora</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.name}</td>
                  <td>${payment.total.toFixed(2)}</td>
                  <td>{payment.month}</td>
                  <td>{payment.paidAt}</td>
                  <td><button className="btn btn-danger" onClick={() => removePayment(indexOfFirstPayment + index)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination">
              {pageNumbers.map(number => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <a onClick={() => setCurrentPage(number)} href="#" className="page-link">
                    {number}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {paymentSuccess && (
          <div className="alert alert-success fixed-bottom m-4" role="alert">
            ¡Pago realizado con éxito!
          </div>
        )}
      </div>
    </>
  );
};

export default Pagos;