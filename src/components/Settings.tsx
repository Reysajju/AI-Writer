import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Key, LogOut } from 'lucide-react';
import { APIKeyModal } from './APIKeyModal';

export function Settings() {
  const [user, setUser] = useState(null);
  const [showAPIModal, setShowAPIModal] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>
      
      <div className="space-y-6">
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          {user && (
            <div className="text-gray-600">
              <p>Email: {user.email}</p>
            </div>
          )}
        </div>

        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">API Keys</h3>
          <button
            onClick={() => setShowAPIModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Key className="w-4 h-4" />
            <span>Manage API Keys</span>
          </button>
        </div>

        <div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <APIKeyModal
        isOpen={showAPIModal}
        onClose={() => setShowAPIModal(false)}
        onSuccess={() => setShowAPIModal(false)}
      />
    </div>
  );
}