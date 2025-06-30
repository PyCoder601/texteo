import "./globals.css";
import React from "react";
import ReduxProvider from "@/redux/Provider";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/logo-texteo.ico"/>
            <title>Texteo</title>
        </head>
        <body
        >
        <ReduxProvider>
            {children}
        </ReduxProvider>
        </body>
        </html>
    );
}
