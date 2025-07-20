"use client";
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Lock, User} from "lucide-react";
import Header from "@/ui/Header";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import Footer from "@/ui/Footer";
import Link from "next/link";
import authenticate from "@/service/auth";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const darkMode: boolean = useSelector(selectDarkMode);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router = useRouter();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const response = await authenticate({username, password}, "login");
        if (response === true) {
            router.push("/home");
            setLoading(false);
        } else {
            setError(response);
            setLoading(false);
        }
    }

    return (
        <main
            className={`flex flex-col min-h-screen ${
                darkMode
                    ? "bg-gradient-to-br from-[#111b21] to-[#202c33] text-white"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
            } transition-colors duration-300`}
        >
            <Header/>
            <section
                className="flex flex-col items-center justify-center px-8 py-4 md:py-10 max-w-7xl mx-auto flex-grow">
                <motion.div
                    className={`w-full max-w-md p-8 rounded-lg shadow-lg ${
                        darkMode ? "bg-[#202c33]" : "bg-white"
                    }`}
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
                        Se connecter
                    </h1>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error &&
                            <p className="text-red-500 max-w-5/6 bg-pink-100 rounded-xl mx-auto text-center">{error}</p>}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Nom_utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-lg ${
                                    darkMode
                                        ? "bg-[#2a3942] text-white placeholder-gray-400"
                                        : "bg-gray-200 text-gray-800 placeholder-gray-500"
                                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-lg ${
                                    darkMode
                                        ? "bg-[#2a3942] text-white placeholder-gray-400"
                                        : "bg-gray-200 text-gray-800 placeholder-gray-500"
                                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            />
                        </div>
                        <motion.button
                            type="submit"
                            className={`w-full ${isMobile ? "bg-teal-100" : "bg-gradient-to-r from-teal-500 to-green-600"} " +
                                "text-white px-8 py-3 rounded-full font-semibold shadow-lg " +
                                "hover:shadow-xl transform hover:scale-105 transition-all " +
                                "duration-300 ${
                                loading
                                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                    : 'bg-teal-200 text-white shadow-lg  hover:shadow-xl'
                            } `}
                            whileHover={{scale: !loading ? 1.02 : 1}}
                            whileTap={{scale: !loading ? 0.98 : 1}}
                        >
                            {loading ? (
                                <div className='flex items-center justify-center'>
                                    <svg
                                        className='mr-3 h-5 w-5 animate-spin text-white'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        />
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                     5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        />
                                    </svg>
                                    connexion ...
                                </div>
                            ) : isMobile ? ("Passer sur un pc ☺️") :
                                (
                                'Se connecter'
                            )}
                        </motion.button>
                    </form>
                    <p className={`text-center mt-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Pas encore de compte?{" "}
                        <Link href="/register" className="text-teal-500 hover:underline">
                            S&#39;inscrire
                        </Link>
                    </p>
                </motion.div>
            </section>
            <Footer darkMode={darkMode}/>
        </main>
    );
}
