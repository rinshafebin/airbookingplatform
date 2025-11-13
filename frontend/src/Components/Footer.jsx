import React from 'react';
import { Plane } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-orange-100 py-4 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plane className="w-5 h-5 text-orange-500" />
          <span className="text-sm text-gray-500">SkyBooker © {new Date().getFullYear()}</span>
        </div>
        <div className="text-xs text-gray-400">
          Powered by Bridgeton Tech
        </div>
      </div>
    </footer>
  );
}
