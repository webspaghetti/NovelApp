"use client";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ChapterStyleWrapper({ children }) {
    return (
        <>
            <style jsx global>{`
                body {
                  background-image: none;
                  background-color: #171717;
                  .chapter-title {
                    color: #5e42fc;
                  }
                  .chapter-content {
                    color: #FAFAFA;
                    font-family: ${inter.style.fontFamily};
                  }
                }
            `}</style>
            {children}
        </>
    );
}