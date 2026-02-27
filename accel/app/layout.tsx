import { Inter } from "next/font/google";
import { UserProvider } from "./providers/userProvider";

const interMono = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-mono",
});

export const metadata = {
  title: 'Accel',
  description: 'My app description',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}


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
