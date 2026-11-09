import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Magic Board — Studio",
  description: "Minimalist electronic magic drawing board interface",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
