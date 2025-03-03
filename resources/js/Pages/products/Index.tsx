// resources/js/Pages/products/Index.js
import React from 'react';

const Index = ({ products } :any) => {
  return (
    <div>
      <h1>Lista de Productos</h1>
      <ul>
        {products.map((product: any) => (
          <div>
            <li key={product.id}>{product.name}</li> 
            <li key={product.id}>{product.description}</li> 
            <img src={product.image} alt="golulu" />
          </div>
          
        ))}
      </ul>
    </div>
  );
};

export default Index;
