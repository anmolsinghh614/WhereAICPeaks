import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ControlPlane.ai — Enterprise AI Governance & Control Plane',
  description: 'Enterprise AI control plane for real-time AI governance, observability, cost control, and responsible AI.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
