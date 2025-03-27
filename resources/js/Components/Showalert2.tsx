import Swal from "sweetalert2";

/**
 * Muestra una alerta simple (éxito, error, info, etc.)
 */
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
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};

/**
 * Muestra una alerta de confirmación con botón cancelar
 */
export const showConfirmAlert = (
  title: string,
  text: string,
  confirmButtonText = "Sí",
  cancelButtonText = "Cancelar"
) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    background: "#1e293b",
    color: "#fff",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => console.log("Confirmación mostrada"),
    didClose: () => console.log("Confirmación cerrada"),
  });
};




