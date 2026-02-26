import { Inter } from "next/font/google";
import { UserProvider } from "./providers/userProvider";

const interMono = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={interMono.variable}>
      <body style={{ margin: 0, padding: 0 }}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
