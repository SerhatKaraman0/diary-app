"use client";
import React from 'react';
import { 
  FileText, 
  Image, 
  Calendar, 
  BarChart2, 
  Save,
  X
} from 'lucide-react';
import NoteCard from "./NoteCard";
import { Note } from "@/lib/types";

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  date: Date | null;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, onClose, notes, date }) => {
  const [activeItem, setActiveItem] = React.useState<string>('notes');

  const sidebarItems = [
    { 
      icon: FileText, 
      label: 'Notes', 
      key: 'notes' 
    },
    { 
      icon: Image, 
      label: 'Photos', 
      key: 'photos' 
    },
    { 
      icon: Calendar, 
      label: 'Schedule', 
      key: 'schedule' 
    },
    { 
      icon: BarChart2, 
      label: 'Mood', 
      key: 'mood' 
    }
  ];

  const renderContent = () => {
    switch(activeItem) {
      case 'notes':
        return (
          <div className="h-full flex flex-col">
            <div className="notes-and-photos-section">
              <h2 className="text-xl font-light text-white p-4 border-b border-[#292a30]">
                Notes for {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <div className="p-4">
                {notes.map((note) => (
                  <NoteCard note={note} key={note.$id} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="h-full flex flex-col">
            <div className="notes-and-photos-section">
              <h2 className="text-xl font-light text-white p-4 border-b border-[#292a30]">Photos</h2>
              <div className="grid grid-cols-3 gap-4 p-4">
                {/* Photo grid will go here */}
              </div>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="h-full flex flex-col bg-white">
            <h2 className="text-xl font-light p-4 border-b border-gray-200">Schedule</h2>
            <div className="p-4">
              <div className="text-center py-8 text-gray-500">
                Schedule content will go here
              </div>
            </div>
          </div>
        );
      case 'mood':
        return (
          <div className="h-full flex flex-col bg-white">
            <h2 className="text-xl font-light p-4 border-b border-gray-200">Mood Tracker</h2>
            <div className="p-4">
              <div className="text-center py-8 text-gray-500">
                Mood tracking content will go here
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center bg-white">
            <h2 className="text-xl font-light">Select a section from the sidebar</h2>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-[95vw] h-[95vh] flex border border-gray-200 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>

        <div className="w-20 flex flex-col border-l border-gray-200">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveItem(item.key)}
              className={`p-4 border-b border-gray-200 hover:bg-gray-100 transition-all ${
                activeItem === item.key 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-600'
              }`}
              title={item.label}
            >
              <item.icon className="h-6 w-6" />
            </button>
          ))}
          <button 
            className="p-4 border-b border-gray-200 hover:bg-gray-100 text-gray-600"
            title="Save"
          >
            <Save className="h-6 w-6" />
          </button>
          <button 
            onClick={onClose}
            className="p-4 mt-auto border-t border-gray-200 hover:bg-gray-100 text-gray-600"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayModal; 