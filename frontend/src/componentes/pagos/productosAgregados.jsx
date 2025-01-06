import React from "react";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagos.css'
import Img1 from '../../assets/img2/img1.png'

import { initMercadoPago} from '@mercadopago/sdk-react'
initMercadoPago('');




function ProductosAgregados () {

    const userLoggin = localStorage.getItem('user');
       let userData = null;
     
       if (userLoggin !== null) {
         userData = JSON.parse(userLoggin);
       }
     
       const [userName, setUserName] = useState(userData ? userData.name : '');
       const [userlastName, setUserLastName] = useState(userData ? userData.lastName : '');
       
      
      
    
      const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || {});
      const [debtDetails, setDebtDetails] = useState(JSON.parse(localStorage.getItem('debtDetails')) || []);
      const [totalDebt, setTotalDebt] = useState(0);
      const [paymentSuccess, setPaymentSuccess] = useState(false);
      const [successfulPayments, setSuccessfulPayments] = useState(JSON.parse(localStorage.getItem('successfulPayments')) || []);
      const [currentPage, setCurrentPage] = useState(1);
      const paymentsPerPage = 6;
    
    
    
      useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
        calculateTotalDebt();
      }, [products]);
    
      useEffect(() => {
        localStorage.setItem('debtDetails', JSON.stringify(debtDetails));
        calculateTotalDebt();
      }, [debtDetails]);
    
      useEffect(() => {
        localStorage.setItem('successfulPayments', JSON.stringify(successfulPayments));
      }, [successfulPayments]);
    
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
          const quantity = parseInt(document.getElementById('quantityInput').value);
          const month = document.getElementById('monthInput').value;
    
          setProducts((prevProducts) => {
            const updatedProducts = { ...prevProducts };
            if (updatedProducts[name]) {
              updatedProducts[name].quantity += quantity;
              updatedProducts[name].price = price;
              updatedProducts[name].discount = discount;
              updatedProducts[name].discountedPrice = discountedPrice;
              updatedProducts[name].imageUrl = imageUrl;
              updatedProducts[name].month = month;
            } else {
              updatedProducts[name] = { price, discount, discountedPrice, quantity, imageUrl, month };
            }
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
        document.getElementById('quantityInput').value = '';
        document.getElementById('monthInput').value = '';
      };
    
      const removeProduct = (name) => {
        setProducts((prevProducts) => {
          const updatedProducts = { ...prevProducts };
          delete updatedProducts[name];
          return updatedProducts;
        });
      };
    
      const showAddToCartSection = (name) => {
        document.getElementById(`cart-section-${name}`).style.display = 'block';
      };
    
      const addToGlobalAccount = (name) => {
        const quantity = parseInt(document.getElementById(`cartQuantityInput-${name}`).value);
        if (quantity > 0 && quantity <= products[name].quantity) {
          setProducts((prevProducts) => {
            const updatedProducts = { ...prevProducts };
            updatedProducts[name].quantity -= quantity;
            return updatedProducts;
          });
          const total = quantity * products[name].discountedPrice;
          setDebtDetails((prevDebtDetails) => [...prevDebtDetails, { name, quantity, total, month: products[name].month, paidAt: null }]);
          document.getElementById(`cart-section-${name}`).style.display = 'none';
        } else {
          alert('Cantidad inválida.');
        }
      };
    
      const removeDebt = (index) => {
        setDebtDetails((prevDebtDetails) => {
          const updatedDebtDetails = [...prevDebtDetails];
          updatedDebtDetails.splice(index, 1);
          return updatedDebtDetails;
        });
      };
    
      const paySelectedDebts = () => {
        if (debtDetails.length === 0) {
          alert('No hay deudas para pagar.');
          return;
        }
    
        const now = new Date().toLocaleString();
        const paidDebts = debtDetails.map(debt => ({ ...debt, paidAt: now }));
    
        setDebtDetails([]);
        setSuccessfulPayments((prevPayments) => [...prevPayments, ...paidDebts]);
        setPaymentSuccess(true);
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
          return updatedPayments;
        });
      };

    return(
        <>

        <nav className="navbar navbar-expand-lg navbar-light fon">
                 <img src={Img1} alt="Logo" className="navbar-brand" />
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                     
                    {userLoggin !== null ? (
                   <>
        
                  <li className="nav-item">
                       <span className="nav-link text-white">Hola {userName}  {userlastName}❤</span>
                                    </li>
        
                  <li className="nav-item">
                        <a className="nav-link text-white" href="#" data-toggle="modal" data-target="#debtDetailModal">Ver Pagos ${totalDebt.toFixed(2)}</a>
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
                      <p className="card-text">Cantidad: {product.quantity}</p>
                      <p className="card-text">Mes: {product.month}</p>
                      
                      <button className="btn btn-success" onClick={() => showAddToCartSection(name)}>Añadir al carrito</button>
                      <div className="cart-section" id={`cart-section-${name}`} style={{ display: 'none' }}>
                        <input type="number" className="form-control my-2 text-center" id={`cartQuantityInput-${name}`} min="1" />
                        <button className="btn btn-primary " onClick={() => addToGlobalAccount(name)}>Agregar</button>
                      </div>
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
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Mes </th>
                      <th>Fecha</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtDetails.map((debt, index) => (
                      <tr key={index}>
                        <td>{debt.name}</td>
                        <td>{debt.quantity}</td>
                        <td>${debt.total.toFixed(2)}</td>
                        <td>{debt.month}</td>
                        <td>{debt.paidAt ? debt.paidAt : 'Sin Pagar'}</td>
                        <td className="text-center remove"><span className="remove-product bg-danger rounded-circle text-white " onClick={() => removeDebt(index)}>&times;</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <span><strong>Total Seleccionado:</strong></span>
                <button type="button" className= {totalDebt.toFixed(2)} onClick={paySelectedDebts}>Pagar ${totalDebt.toFixed(2)}</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
        
        
        
        
        
        
        </>
    )
}

export default ProductosAgregados;