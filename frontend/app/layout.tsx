import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Management ",
  description: "A Task Management allows you to manage your daily tasks",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <Toaster position="top-center" />
          <main className="container mx-auto ">{children}</main>
        </body>
      </html>
    </Providers>
  );
};
export default RootLayout;
