// resources/js/Pages/products/Index.js
import React from 'react';

const Index = ({ products }) => {
  return (
    <div>
      <h1>Lista de Productos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li> // Aquí asumes que tienes un campo 'name' en tus productos
        ))}
      </ul>
    </div>
  );
};

export default Index;
