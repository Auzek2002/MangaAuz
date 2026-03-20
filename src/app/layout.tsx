import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "MangaAuz - Read Manga Online",
  description: "Read manga online for free. Discover thousands of manga titles with MangaAuz.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ backgroundColor: "#0d0d12", color: "#e2e2ee" }}>
        <Navbar />
        <main>{children}</main>
        <footer
          className="border-t py-10 mt-16"
          style={{ borderColor: "#1e1e2a", backgroundColor: "#0a0a0f" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e05248, #c03a32)" }}>
                <BookOpen size={14} color="#fff" />
              </div>
              <span className="font-bold" style={{ color: "#e2e2ee" }}>
                Manga<span style={{ color: "#e05248" }}>Auz</span>
              </span>
            </div>
            <p className="text-xs text-center" style={{ color: "#44445a" }}>
              Powered by{" "}
              <a href="https://mangadex.org" target="_blank" rel="noopener noreferrer" style={{ color: "#e05248" }} className="hover:underline">
                MangaDex API
              </a>
              {" "}&bull; All content belongs to respective authors &amp; publishers.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
