"use client";
import React from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {LogIn} from "lucide-react";
import Header from "@/ui/Header";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import Footer from "@/ui/Footer";
import Link from "next/link";

export default function Home() {
    const darkMode = useSelector(selectDarkMode);
    return (
        <main
            className={`flex flex-col min-h-screen ${darkMode ? "bg-gradient-to-br from-[#111b21] " +
                "to-[#202c33] text-white" : "bg-gradient-to-br from-gray-100" +
                " to-gray-200 text-gray-800"} transition-colors duration-300`}
        >
            <Header/>
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto">
                <motion.div
                    className="md:w-1/2 space-y-6"
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.5}}
                >
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
                        Une version minimaliste de WhatsApp.
                    </h1>
                    <p
                        className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                    >
                        Envoyez et recevez des messages instantanément grâce aux WebSockets.
                    </p>
                    <div className="space-x-4 flex">
                        <motion.button
                            className={`bg-gradient-to-r from-teal-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2`}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            <LogIn size={20}/>
                            <Link href={"/login"}>Se connecter</Link>
                        </motion.button>
                    </div>
                </motion.div>
                <motion.div
                    className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.7, type: "spring", stiffness: 100}}
                >
                    <div className="relative w-[400px] h-[400px]">
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-green-600 rounded-full blur-2xl opacity-30"></div>
                        <Image
                            src="/mp.png"
                            alt="WhatsApp mockup"
                            width={400}
                            height={400}
                            className="rounded-lg shadow-2xl relative z-10"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <Footer darkMode={darkMode}/>
        </main>
    );
}
