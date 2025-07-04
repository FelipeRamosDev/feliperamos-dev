import '@/style/style.scss';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Felipe Ramos - Fullstack Developer | JavaScript | TypeScript | React | Node.js | Next.js | MongoDB | PostgreSQL | REST API | Docker | Redis | Jest | Material UI',
  description: 'Felipe Ramos is a Fullstack Developer with expertise in JavaScript, TypeScript, React, Node.js, Next.js, MongoDB, PostgreSQL, REST API, Docker, Redis, Jest, and Material UI. Explore his portfolio to see his projects and skills.',
  keywords: 'Felipe Ramos, Fullstack Developer, JavaScript, TypeScript, React, Node.js, Next.js, MongoDB, PostgreSQL, REST API, Docker, Redis, Jest, Material UI',
  authors: [{ name: 'Felipe Ramos', url: 'https://github.com/FelipeRamosDev' }],
  creator: 'Felipe Ramos'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
