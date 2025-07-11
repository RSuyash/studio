import type {Metadata} from 'next';
import './globals.css';
import 'reactflow/dist/style.css';

export const metadata: Metadata = {
  title: 'Nexus Cortex',
  description: 'An interactive learning syllabus application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
