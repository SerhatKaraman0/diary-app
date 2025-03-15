"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  ShoppingCart, 
  Package, 
  TruckIcon, 
  BarChart2, 
  Settings,
  Save
} from 'lucide-react';

import NoteCard from "./NoteCard";
import {fakeData as notes} from "@/lib/assets/fakeData";

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const sidebarItems = [
    { 
        icon: LayoutGrid, 
        label: 'Dashboard', 
        key: 'dashboard' 
    },
    { 
        icon: ShoppingCart, 
        label: 'Orders', 
        key: 'orders' 
    },
    { 
        icon: Package, 
        label: 'Inventory', 
        key: 'inventory' 
    },
    { 
        icon: TruckIcon, 
        label: 'Shipping', 
        key: 'shipping' 
    },
    { 
        icon: BarChart2, 
        label: 'Analytics', 
        key: 'analytics' 
    },
    { 
        icon: Settings, 
        label: 'Settings', 
        key: 'settings' 
    }
  ];

  const renderContent = () => {
    switch(activeItem) {
        case 'dashboard':
            return (
                <div className="h-full flex flex-col">
                    <h2 className="text-xl font-light border-b border-black pb-2 mb-4">Dashboard</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-black p-4">
                            <h3 className="text-sm mb-2">Total Sales</h3>
                            <p className="text-2xl font-thin">$45,231.89</p>
                        </div>
                        <div className="border border-black p-4">
                            <h3 className="text-sm mb-2">Orders</h3>
                            <p className="text-2xl font-thin">452</p>
                        </div>
                    </div>
                </div>
            );
        case 'orders':
            return (
                <div className="h-full flex flex-col">
                    <div className='notes-and-photos-section no-scrollbar'>
                        <div>
                            {notes.map((note) => (
                                <NoteCard note={note} key={note.$id} />
                            ))}
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className="h-full flex items-center justify-center">Content for {activeItem}</div>;
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div 
        className="w-[95vw] h-[95vh] bg-white flex border border-black"
        initial={{ scale: 0.8 }}
        animate={{ scale: isOpen ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 p-8 overflow-auto border-r border-black">
          {renderContent()}
        </div>

        <div className="w-20 flex flex-col">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveItem(item.key)}
              className={`p-4 border-b border-black hover:bg-black hover:text-white transition-all ${
                  activeItem === item.key 
                      ? 'bg-black text-white' 
                      : ''
              }`}
            >
              <item.icon className="h-6 w-6" />
            </button>
          ))}
          <button 
            className="p-4 border-b border-black hover:bg-black hover:text-white"
          >
            <Save className="h-6 w-6" />
          </button>
          <button 
            onClick={onClose}
            className="p-4 mt-auto border-t border-black hover:bg-black hover:text-white"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DayModal; 