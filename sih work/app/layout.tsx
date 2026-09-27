import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import '../src/styles.css';

export const metadata: Metadata = {
  title: 'Urban Intelligence — Mobility Command',
  description: 'AI-powered urban mobility intelligence command center',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
