import {toast} from "react-toastify";

export const showNotification = (type: "success" | "error" | "info", title: string, message: string) => {
    toast[type](
        <div>
            <p className = "font-bold capitalize" > {title} < /p>
            < p > {message} < /p>
            < /div>,
    {
        position: "top-right",
            autoClose
    :
        3000,
            hideProgressBar
    :
        false,
            closeOnClick
    :
        true,
            pauseOnHover
    :
        true,
            draggable
    :
        true,
            progress
    :
        undefined,
    }
)
    ;
};
