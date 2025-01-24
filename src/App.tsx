import React, { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { StoryGenerator } from './components/StoryGenerator';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Subscription } from './components/Subscription';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';

type Page = 'articles' | 'settings' | 'about' | 'contact' | 'subscription';

function App() {
  const [session, setSession] = useState(null);
  const [activePage, setActivePage] = useState<Page>('articles');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      <Navigation 
        activePage={activePage} 
        onPageChange={setActivePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-24'} p-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 opacity-0 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-navy-800 bg-clip-text text-transparent">
              Magnates Empire
            </h1>
            <p className="text-gray-600 mt-2">AI-Powered Content Writing Suite</p>
          </div>

          <div className="flex justify-center opacity-0 animate-slide-up">
            {activePage === 'articles' && <StoryGenerator />}
            {activePage === 'settings' && <Settings />}
            {activePage === 'about' && <About />}
            {activePage === 'contact' && <Contact />}
            {activePage === 'subscription' && <Subscription />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;