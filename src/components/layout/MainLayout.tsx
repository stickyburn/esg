'use client';

import { ReactNode } from 'react';
import NavigationSidebar from './NavigationSidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar />
      <main className={cn(
        "flex-1 overflow-auto custom-scrollbar",
        "lg:ml-0", // No margin on large screens as sidebar is static
      )}>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}