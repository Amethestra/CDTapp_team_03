import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/providers";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode}) => {
  return (
    <Providers>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </Providers>
  );
};

export default Layout;