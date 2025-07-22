"use client";
import React from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import Header from "@/ui/Header";
import {useSelector} from "react-redux";
import {selectDarkMode} from "@/redux/uiSlice";
import Footer from "@/ui/Footer";
import {GitMerge, Lightbulb, Map, User, Zap} from "lucide-react";
import Link from "next/link";

export default function APropos() {
    const darkMode = useSelector(selectDarkMode);

    const sections = [
        {
            title: "Source d'inspiration",
            icon: <Lightbulb className="text-yellow-400"/>,
            content: "Ce projet est né de l'envie de recréer l'essence des applications de messagerie modernes comme WhatsApp, mais avec une approche minimaliste et open-source. L'objectif était de me concentrer sur les fonctionnalités fondamentales — la rapidité, la sécurité et la simplicité — tout en explorant les technologies de communication en temps réel."
        },
        {
            title: "Description du projet",
            icon: <Zap className="text-green-400"/>,
            content: "Texteo est une application de chat en temps réel conçue pour être performante et sécurisée. Le backend, développé avec FastAPI, gère l'authentification, les messages et la présence en ligne via WebSockets et Redis. Le frontend, construit avec Next.js et TypeScript, offre une interface utilisateur réactive et moderne pour une expérience de chat fluide."
        },
        {
            title: "Ma roadmap de développement",
            icon: <Map className="text-teal-400"/>,
            content: "Le développement s'est déroulé en plusieurs étapes clés : d'abord, la mise en place de l'architecture backend avec l'authentification JWT. Ensuite, l'intégration des WebSockets pour le chat en direct. Puis, la construction de l'interface avec React et Redux pour la gestion de l'état. Enfin, l'ajout des fonctionnalités comme la gestion des contacts, le statut en ligne et l'historique des messages."
        },
        {
            title: "Le défi le plus stimulant",
            icon: <GitMerge className="text-red-400"/>,
            content: "La gestion de l'état en temps réel a été le défi le plus complexe. Synchroniser parfaitement le statut de présence des utilisateurs, les notifications de nouveaux messages et la confirmation de lecture entre le backend (via Redis et WebSockets) et les multiples instances du client (avec Redux) a nécessité une logique rigoureuse pour garantir la cohérence des données sans surcharger le serveur."
        }
    ];

    return (
        <main
            className={`flex flex-col min-h-screen ${darkMode ? "bg-gradient-to-br from-[#111b21] " +
                "to-[#202c33] text-white" : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"} 
                transition-colors duration-300`}
        >
            <Header/>

            <section className="px-4 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-12 max-w-7xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, ease: "easeOut"}}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                        À propos de <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">Texteo</span>
                    </h1>
                    <p className={`mt-4 text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Les coulisses d&#39;une application de chat moderne.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.1 * index}}
                            className={`p-6 rounded-xl shadow-lg flex flex-col items-start h-full ${darkMode ? 'bg-[#202c33]' : 'bg-white/70'} backdrop-blur-sm`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {section.icon}
                                <h2 className="text-2xl font-bold">{section.title}</h2>
                            </div>
                            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{section.content}</p>
                        </motion.div>
                    ))}
                </div>

                <hr className={`my-16 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}/>

                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.5}}
                        className="relative w-48 h-48"
                    >
                        <Image
                            src="/romeo.jpeg"
                            alt="Développeur"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full shadow-2xl"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-green-600 rounded-full blur-xl opacity-50 -z-10"></div>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="flex-1 text-center md:text-left"
                    >
                        <h2 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
                            <User className="text-teal-400"/>
                            À propos du développeur
                        </h2>
                        <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            Je suis Roméo, un développeur full-stack passionné par la création d&#39;applications
                            web performantes et esthétiques. J&#39;aime explorer de nouvelles technologies et
                            construire des projets de A à Z. Ce chat est un exemple de mon travail, combinant
                            un backend robuste en Python (FastAPI) et un frontend moderne en TypeScript (React/Next.js).
                            <br/>Email:
                            <Link href="mailto:romeomanoela18@gmail.com"
                                  className={`${darkMode ? 'text-teal-400' : 'text-teal-500'} font-semibold`}>
                                romeomanoela18@gmail.com
                            </Link>
                            <br/>
                            GitHub:
                            <Link href="https://github.com/PyCoder601"
                                  className={`${darkMode ? 'text-teal-400' : 'text-teal-500'} font-semibold`}>
                                PyCoder601
                            </Link>
                            <br/>
                            LinkedIn:
                            <Link href="https://www.linkedin.com/in/romeo-manoela18/"
                                  className={`${darkMode ? 'text-teal-400' : 'text-teal-500'} font-semibold`}>
                                Zafimanoela Roméo
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer darkMode={darkMode}/>
        </main>
    );
}
