import "./globals.css";
export const metadata = {
  icons: {
    icon: "/osp/osp-public-favicon-transparent.png",
    shortcut: "/osp/osp-public-favicon-transparent.png",
    apple: "/osp/osp-public-favicon-transparent.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}
