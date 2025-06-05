
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/context/AuthContext';

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          <header className="h-14 border-b bg-white flex items-center px-6 sticky top-0 z-10">
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-medium">
                {user?.name}
              </span>
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
