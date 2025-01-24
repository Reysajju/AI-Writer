import React from 'react';
import { Menu, BookOpen, Settings, Info, Mail, X, ScrollText, CreditCard } from 'lucide-react';

type Page = 'articles' | 'settings' | 'about' | 'contact' | 'subscription';

interface NavigationProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Navigation({ activePage, onPageChange, isSidebarOpen, setIsSidebarOpen }: NavigationProps) {
  const navItems = [
    { page: 'articles' as const, icon: BookOpen, label: 'AI Articles' },
    { page: 'subscription' as const, icon: CreditCard, label: 'Subscription' },
    { page: 'about' as const, icon: Info, label: 'About Us' },
    { page: 'contact' as const, icon: Mail, label: 'Contact' },
  ];

  const NavButton = ({ page, icon: Icon, label }: {
    page: Page;
    icon: typeof Menu;
    label: string;
  }) => (
    <button
      onClick={() => onPageChange(page)}
      className={`w-full flex items-center px-4 py-3 hover:bg-sky-800/80 rounded-lg cursor-pointer transition-all duration-300 ${
        activePage === page ? 'bg-sky-800/80' : ''
      }`}
      title={label}
    >
      <Icon className="w-8 h-8" />
      {isSidebarOpen && (
        <span className="ml-3 text-sm font-medium">
          {label}
        </span>
      )}
    </button>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-sky-700 to-navy-900 text-white transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-24'
      } shadow-xl backdrop-blur-sm bg-opacity-90 z-50`}>
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ScrollText className="w-10 h-10 text-sky-300" />
                {isSidebarOpen && (
                  <span className="font-bold text-lg whitespace-nowrap">
                    Magnates Empire
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-sky-800/80 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="flex-1 px-3 space-y-2">
            {navItems.map((item) => (
              <NavButton
                key={item.page}
                page={item.page}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>

          <div className="px-3 mt-4">
            <NavButton page="settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </nav>
      
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}