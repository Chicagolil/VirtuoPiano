import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuroraBackground } from '@/components/ui/aurora-background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Virtuo Piano',
  description: "Application XR d'apprentissage du piano",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuroraBackground>
          <div className="relative min-h-screen">
            <div className="relative z-10">{children}</div>
          </div>
        </AuroraBackground>
      </body>
    </html>
  );
}
