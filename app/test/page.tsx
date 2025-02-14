"use client";
import React, { useState } from 'react';
import { 
  LayoutGrid, 
  ShoppingCart, 
  Package, 
  TruckIcon, 
  BarChart2, 
  Settings,
  Save
} from 'lucide-react';

import NoteCard from "../components/NoteCard";
import {fakeData as notes} from "@/lib/assets/fakeData";

export default function TestRoute() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState<string>('dashboard');

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
                        <h2 className="text-xl font-light border-b border-black pb-2 mb-4">Notes and Photos</h2>
                        <div className='notes-and-photos-section'>
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
        <>
            <button 
                onClick={() => setShowModal(true)} 
                className="px-5 py-2 border border-black hover:bg-black hover:text-white transition-all"
            >
                Open Modal
            </button>

            {showModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div 
                        className="w-5/6 h-5/6 bg-white flex border border-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-1 p-6 overflow-auto border-r border-black">
                            {renderContent()}
                        </div>

  
                        <div className="w-16 flex flex-col">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setActiveItem(item.key)}
                                    className={`p-3 border-b border-black hover:bg-black hover:text-white transition-all ${
                                        activeItem === item.key 
                                            ? 'bg-black text-white' 
                                            : ''
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                </button>
                            ))}
                            <button 
                                className="p-3 border-b border-black hover:bg-black hover:text-white"
                            >
                                <Save className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-3 border-t border-black hover:bg-black hover:text-white"
                            >
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}