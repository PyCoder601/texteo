import {toast} from "react-toastify";
import React from "react";

export const showNotification = (
    type: "success" | "error" | "info",
    title: string,
    message: string
) => {
    toast[type](
        React.createElement(
            "div",
            null,
            React.createElement("p", {className: "font-bold capitalize"}, title),
            React.createElement("p", null, message)
        ),
    {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }
    );
};