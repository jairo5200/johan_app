import React, { useState } from "react";

export default function ProductTable({ setSearchTerm, searchTerm }: any) {
  

  return (
    <div className="w-full p-4">
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar..."
        className="p-2 w-fullp-2 border rounded-lg bg-gray-800/50 text-white border rounded-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}