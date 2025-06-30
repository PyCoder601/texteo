import React from "react";

function Footer({darkMode}: { darkMode: boolean }) {
    return (
        <footer
            className={`mt-auto ${darkMode ? "bg-[#202c33]/50" : "bg-gray-200/50"} py-4 text-center text-sm`}
        >
            © 2025 Texteo: whatsApp Clone
        </footer>
    );
}

export default Footer;