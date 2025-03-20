import Swal from "sweetalert2";

export const showAlert = (
  title: string,
  text: string,
  icon: "success" | "error" | "warning" | "info"
) => {
  return Swal.fire({
    title,
    text,
    icon,
    background: "#1e293b",
    color: "#fff",
    confirmButtonColor: "#2563eb",
    confirmButtonText: "OK",
    showCancelButton: false,
    allowOutsideClick: false, // Evita cierre accidental
    allowEscapeKey: false, // Bloquea cierre con Escape
    didOpen: () => console.log("Alerta mostrada"), // Log cuando se abre
    didClose: () => console.log("Alerta cerrada"), // Log cuando se cierra
  });
};




