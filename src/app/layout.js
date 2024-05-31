import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Weather Tools",
  description: "Temperature graphing tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <header>
          <Navbar/>
        </header>
        {children}
      </body>
    </html>
  );
}
