import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AnimatedBackground from '@/components/AnimatedBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Virtuo Piano',
  description: "Application d'apprentissage du piano",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="relative min-h-screen">
          <AnimatedBackground position="fixed" />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
