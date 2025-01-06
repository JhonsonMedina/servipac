import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorPage from './error-page';
import Navbar from './componentes/navbar/navbar';
import Section from './componentes/section/section';

function App() {
  return (
    <>
      

    <Routes>
      <Route path="/" element={<Navbar/>} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>



    </>
  );
}

export default App;