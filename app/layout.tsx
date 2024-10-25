import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { DeviceProfileProvider } from '@/lib/contexts/device-profile-context';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Network Monitor',
  description: 'Enterprise Network Monitoring Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <DeviceProfileProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen bg-background">
                <Navigation />
                <main className="container mx-auto p-4 pt-20 md:p-6 md:pt-24">
                  {children}
                </main>
              </div>
              <Toaster />
            </ThemeProvider>
          </DeviceProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}