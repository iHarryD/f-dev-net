import { ToastOptions } from "react-toastify";

export const toastEmitterConfig: ToastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: { backgroundColor: "#000", color: "#fff" },
};
