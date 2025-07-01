"use client";
import React from "react";
import {motion} from "framer-motion";
import {Lock, User, Mail} from "lucide-react";
import Header from "@/ui/Header";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import Footer from "@/ui/Footer";
import Link from "next/link";

export default function RegisterPage() {
    const darkMode = useSelector(selectDarkMode);

    return (
        <main
            className={`flex flex-col min-h-screen ${
                darkMode
                    ? "bg-gradient-to-br from-[#111b21] to-[#202c33] text-white"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
            } transition-colors duration-300`}
        >
            <Header/>
            <section className="flex flex-col items-center justify-center px-8 py-20 max-w-7xl mx-auto flex-grow">
                <motion.div
                    className={`w-full max-w-md p-8 rounded-lg shadow-lg ${
                        darkMode ? "bg-[#202c33]" : "bg-white"
                    }`}
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
                        Créer un compte
                    </h1>
                    <form className="space-y-6">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Nom d'utilisateur"
                                className={`w-full pl-12 pr-4 py-3 rounded-lg ${
                                    darkMode
                                        ? "bg-[#2a3942] text-white placeholder-gray-400"
                                        : "bg-gray-200 text-gray-800 placeholder-gray-500"
                                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                type="email"
                                placeholder="Email"
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
                                className={`w-full pl-12 pr-4 py-3 rounded-lg ${
                                    darkMode
                                        ? "bg-[#2a3942] text-white placeholder-gray-400"
                                        : "bg-gray-200 text-gray-800 placeholder-gray-500"
                                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            />
                        </div>
                        <motion.button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            S&#39;inscrire
                        </motion.button>
                    </form>
                    <p className={`text-center mt-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Déjà un compte?{" "}
                        <Link href="/login" className="text-teal-500 hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </motion.div>
            </section>
            <Footer darkMode={darkMode}/>
        </main>
    );
}
