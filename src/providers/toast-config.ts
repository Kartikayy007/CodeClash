import { toast as toastify } from "react-toastify";
import { ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/toastify.css";
import { CustomToast } from "@/components/CustomToast";

export const toastConfig: ToastOptions = {
  position: "top-center",
  className: "toast-with-progress",
  progressClassName: "toast-progress",
  autoClose: 3000,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export const toast = {
  error: (title: string, message: string) =>
    toastify.error((props) => CustomToast({ ...props, title, message }), {
      ...toastConfig,
      progressClassName: "toast-progress-error",
    }),
  success: (title: string, message: string) =>
    toastify.success((props) => CustomToast({ ...props, title, message }), {
      ...toastConfig,
      progressClassName: "toast-progress-success",
    }),
};
