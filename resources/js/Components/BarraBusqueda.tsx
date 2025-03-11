import React, { useState } from "react";

export default function ProductTable({ setSearchTerm, searchTerm }: any) {
  

  return (
    <div className="w-full p-4">
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar producto..."
        className="mb-4 p-2 w-full border rounded-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}