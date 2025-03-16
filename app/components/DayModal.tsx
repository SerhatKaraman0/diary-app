"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 }
};

const modalVariants = {
  closed: { 
    scale: 0.75,
    opacity: 0,
    y: -50
  },
  open: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    scale: 0.75,
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.3
    }
  }
};

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

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div 
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="w-[95vw] h-[95vh] flex border border-gray-200 bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex-1 overflow-hidden"
            >
              {renderContent()}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-20 flex flex-col border-l border-gray-200"
            >
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  onClick={() => setActiveItem(item.key)}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-100 transition-all ${
                    activeItem === item.key 
                      ? 'bg-gray-100 text-black' 
                      : 'text-gray-600'
                  }`}
                  title={item.label}
                >
                  <item.icon className="h-6 w-6" />
                </motion.button>
              ))}
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="p-4 border-b border-gray-200 hover:bg-gray-100 text-gray-600"
                title="Save"
              >
                <Save className="h-6 w-6" />
              </motion.button>
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.3 }}
                onClick={onClose}
                className="p-4 mt-auto border-t border-gray-200 hover:bg-gray-100 text-gray-600"
                title="Close"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DayModal; 