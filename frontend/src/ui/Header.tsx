import {motion} from "framer-motion";
import {Moon, Sun} from "lucide-react";
import React from "react";
import {AppDispatch} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {selectDarkMode, toggleDarkMode} from "@/redux/uiSlice";
import Link from "next/link";

const BarNav = [
    {
        title: "Fonctionnalités",
        lien: "/fonctionalite"
    },
    {
        title: "À propos",
        lien: "/a-propos"
    },
    {
        "title": "Se connecter",
        "lien": "/login"
    }
];

function Header() {
    const dispatch: AppDispatch = useDispatch();
    const darkMode: boolean = useSelector(selectDarkMode);
    return (
        <header
            className={`flex items-center justify-between p-6 sticky top-0 z-10`}
        >
            <motion.div
                className={"text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" +
                    " bg-gradient-to-r from-teal-400 to-green-500"}
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Link href="/">Texteo</Link>
            </motion.div>
            <nav className="flex items-center space-x-3 sm:space-x-6">
                {BarNav.map(
                    (item, index) => (
                        <motion.a
                            key={item.title}
                            href={item.lien}
                            className={`text-sm sm:text-base hover:text-teal-400  transition-colors
                            ${item.lien === "/login" ? "hidden sm:block" : ""}
                            `}
                            whileHover={{scale: 1.1}}
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.1}}
                        >
                            {item.title}
                        </motion.a>
                    )
                )}
                <motion.button
                    onClick={() => dispatch(toggleDarkMode())}
                    className={`p-2 rounded-full ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
                </motion.button>
            </nav>
        </header>
    );
}

export default Header;
