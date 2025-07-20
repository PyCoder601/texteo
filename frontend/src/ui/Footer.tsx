import React from "react";
import Link from "next/link";

function Footer({darkMode}: { darkMode: boolean }) {
    return (
        <footer
            className={`mt-auto ${darkMode ? "bg-[#202c33]/50" : "bg-gray-200/50"} py-4 text-center text-sm`}
        >
            © 2025 Texteo: Conçu et developpé par <Link href={"mailto:romeomanoela18@gmail.com"}
                                                        className={"font-semibold"}>Zafimanoela Romeo</Link>
        </footer>
    );
}

export default Footer;