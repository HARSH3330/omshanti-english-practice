import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Om Shanti English Practice',
  description: 'Simple spoken English practice for daily learning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a href="/" className="site-logo">Om Shanti</a>
          <nav>
            <a href="/">Home</a>
            <a href="/dashboard">Practice</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
