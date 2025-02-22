import { Analytics } from "@vercel/analytics/react";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Recalla",
  description:
    "An app that lets users create flashcards to streamline their study process",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(dmSans.className, "antialiased")}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
