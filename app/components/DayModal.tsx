"use client";
import React, { useRef, useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Palette,
  Cloud,
  Star,
  Heart,
  Brain,
  Moon,
  Lightbulb,
  Footprints,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NoteCard from "./NoteCard";
import { Note, DayData, WeatherType, HealthCategory, AnxietyLevel, DreamCategory } from "@/lib/types";
import { HEALTH_COLORS, ANXIETY_COLORS, DREAM_COLORS, RATING_COLORS, WEATHER_ICONS } from "@/lib/constants";

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  date: Date | null;
  dayData?: DayData;
  onSave?: (data: DayData) => void;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, onClose, notes, date, dayData, onSave }) => {
  const [activeItem, setActiveItem] = useState<string>('doodle');
  const [localData, setLocalData] = useState<DayData>({
    date: date?.toISOString() || new Date().toISOString()
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAnxietyDetails, setShowAnxietyDetails] = useState(false);
  const [showDreamDetails, setShowDreamDetails] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (isOpen && date) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (dayData) {
        setLocalData(dayData);
        setShowAnxietyDetails(!!dayData.anxiety?.details);
        setShowDreamDetails(!!dayData.dream?.details);
        
        if (dayData.doodle && canvas) {
          const ctx = canvas.getContext('2d');
          const img = new window.Image();
          img.onload = () => {
            ctx?.drawImage(img, 0, 0);
          };
          img.src = dayData.doodle;
        }
      } else {
        setLocalData({
          date: date.toISOString()
        });
        setShowAnxietyDetails(false);
        setShowDreamDetails(false);
      }
    }
  }, [isOpen, date, dayData]);

  const handleSave = () => {
    const dataToSave = { ...localData };
    
    if (date) {
      dataToSave.date = date.toISOString();
    }
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const hasDrawing = imageData?.data.some((channel, index) => {
        if (index % 4 === 3) return channel !== 0;
        return false;
      });
      
      if (hasDrawing) {
        dataToSave.doodle = canvas.toDataURL();
      } else {
        delete dataToSave.doodle;
      }
    }
    
    onSave?.(dataToSave);
    onClose();
  };

  const sidebarItems = [
    { icon: Palette, label: 'Doodle', key: 'doodle' },
    { icon: Cloud, label: 'Weather', key: 'weather' },
    { icon: Star, label: 'Rating', key: 'rating' },
    { icon: Heart, label: 'Health', key: 'health' },
    { icon: Brain, label: 'Anxiety', key: 'anxiety' },
    { icon: Moon, label: 'Dream', key: 'dream' },
    { icon: Lightbulb, label: 'Highlight', key: 'highlight' },
    { icon: Footprints, label: 'Steps', key: 'steps' },
    { icon: FileText, label: 'Notes', key: 'notes' },
    { icon: Image, label: 'Photos', key: 'photos' }
  ];

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penSize * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderContent = () => {
    switch(activeItem) {
      case 'doodle':
        const penSizes = [1, 2, 4, 6, 8, 12];
        const colors = [
          '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', 
          '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
          '#F59E0B', '#10B981', '#6366F1', '#A855F7', '#F43F5E'
        ];
        
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Doodle of the Day</h2>
            
            <div className="mb-4 flex items-center gap-6 p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Tool:</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEraser(false)}
                  className={`px-4 py-2 border-2 transition-all ${
                    !isEraser ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Pen
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEraser(true)}
                  className={`px-4 py-2 border-2 transition-all ${
                    isEraser ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Eraser
                </motion.button>
              </div>

              {!isEraser && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Color:</span>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPenColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          penColor === color ? 'border-black scale-110 ring-2 ring-offset-2 ring-black' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Size:</span>
                <div className="flex gap-2">
                  {penSizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPenSize(size)}
                      className={`w-10 h-10 flex items-center justify-center border-2 transition-all ${
                        penSize === size ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div 
                        className="rounded-full"
                        style={{ 
                          width: `${Math.min(size * 2, 20)}px`, 
                          height: `${Math.min(size * 2, 20)}px`,
                          backgroundColor: isEraser && penSize === size ? '#666' : penColor
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="border-2 border-black shadow-lg">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="cursor-crosshair bg-white"
                />
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCanvas}
                className="px-6 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-medium"
              >
                Clear Canvas
              </motion.button>
            </div>
          </motion.div>
        );

      case 'weather':
        const weatherTypes: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'foggy', 'snowy', 'stormy'];
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Weather Tracker</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                  <div className="text-6xl mb-4">
                    {localData.weather ? WEATHER_ICONS[localData.weather] : '🌤️'}
                  </div>
                  <p className="text-lg capitalize">{localData.weather || 'Select weather'}</p>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={weatherTypes.indexOf(localData.weather || 'sunny')}
                    onChange={(e) => setLocalData({ ...localData, weather: weatherTypes[parseInt(e.target.value)] })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between mt-4">
                    {weatherTypes.map((weather) => (
                      <button
                        key={weather}
                        onClick={() => setLocalData({ ...localData, weather })}
                        className={`text-3xl transition-transform hover:scale-125 ${localData.weather === weather ? 'scale-125' : 'opacity-50'}`}
                      >
                        {WEATHER_ICONS[weather]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'rating':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Rate My Day</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                  <div 
                    className="inline-block text-8xl font-bold px-8 py-4 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: localData.rating !== undefined ? RATING_COLORS[localData.rating] : '#e5e7eb',
                      color: 'white'
                    }}
                  >
                    {localData.rating !== undefined ? localData.rating : '-'}
                  </div>
                </div>
                <div className="grid grid-cols-11 gap-2">
                  {Array.from({ length: 11 }, (_, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocalData({ ...localData, rating: i })}
                      className={`aspect-square flex items-center justify-center text-lg font-semibold border-2 transition-all ${
                        localData.rating === i ? 'border-black scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: RATING_COLORS[i] }}
                    >
                      <span className="text-white">{i}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'health':
        const healthCategories: { key: HealthCategory; label: string }[] = [
          { key: 'well', label: 'Well' },
          { key: 'stomach-problem', label: 'Stomach Problem' },
          { key: 'cold-cough', label: 'Cold/Cough' },
          { key: 'headache', label: 'Headache' },
          { key: 'brain-fog', label: 'Brain Fog' },
          { key: 'hangover', label: 'Hangover' },
          { key: 'other', label: 'Other' }
        ];
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Health Log</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                {healthCategories.map(({ key, label }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLocalData({ ...localData, health: key })}
                    className={`p-6 border-2 transition-all ${
                      localData.health === key ? 'border-black scale-105' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: localData.health === key ? HEALTH_COLORS[key] : 'white',
                      color: localData.health === key ? 'white' : 'black'
                    }}
                  >
                    <span className="text-lg font-medium">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'anxiety':
        const anxietyLevels: { key: AnxietyLevel; label: string }[] = [
          { key: 'none', label: 'None' },
          { key: 'low', label: 'Low' },
          { key: 'medium', label: 'Medium' },
          { key: 'high', label: 'High' },
          { key: 'severe', label: 'Severe' }
        ];
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Anxiety Log</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl space-y-6">
                <div className="grid grid-cols-5 gap-3">
                  {anxietyLevels.map(({ key, label }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocalData({ ...localData, anxiety: { level: key, details: localData.anxiety?.details } })}
                      className={`p-4 border-2 transition-all ${
                        localData.anxiety?.level === key ? 'border-black scale-105' : 'border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: localData.anxiety?.level === key ? ANXIETY_COLORS[key] : 'white',
                        color: localData.anxiety?.level === key ? 'white' : 'black'
                      }}
                    >
                      <span className="text-sm font-medium">{label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAnxietyDetails}
                      onChange={(e) => setShowAnxietyDetails(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span>Add details</span>
                  </label>
                </div>
                <AnimatePresence>
                  {showAnxietyDetails && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 120 }}
                      exit={{ opacity: 0, height: 0 }}
                      value={localData.anxiety?.details || ''}
                      onChange={(e) => setLocalData({ ...localData, anxiety: { level: localData.anxiety?.level || 'none', details: e.target.value } })}
                      placeholder="Add details about your anxiety..."
                      className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none resize-none"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );

      case 'dream':
        const dreamCategories: { key: DreamCategory; label: string }[] = [
          { key: 'funny-weird', label: 'Funny/Weird' },
          { key: 'happy', label: 'Happy' },
          { key: 'boring', label: 'Boring' },
          { key: 'sad', label: 'Sad' },
          { key: 'frustrating', label: 'Frustrating' },
          { key: 'scary', label: 'Scary' },
          { key: 'dont-remember', label: "Don't Remember" }
        ];
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Dream Log</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {dreamCategories.map(({ key, label }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocalData({ ...localData, dream: { category: key, details: localData.dream?.details } })}
                      className={`p-4 border-2 transition-all ${
                        localData.dream?.category === key ? 'border-black scale-105' : 'border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: localData.dream?.category === key ? DREAM_COLORS[key] : 'white',
                        color: localData.dream?.category === key ? 'white' : 'black'
                      }}
                    >
                      <span className="text-sm font-medium">{label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDreamDetails}
                      onChange={(e) => setShowDreamDetails(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span>Add details</span>
                  </label>
                </div>
                <AnimatePresence>
                  {showDreamDetails && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 120 }}
                      exit={{ opacity: 0, height: 0 }}
                      value={localData.dream?.details || ''}
                      onChange={(e) => setLocalData({ ...localData, dream: { category: localData.dream?.category || 'dont-remember', details: e.target.value } })}
                      placeholder="Describe your dream..."
                      className="w-full p-4 border-2 border-gray-300 focus:border-black focus:outline-none resize-none"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );

      case 'highlight':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Highlight of the Day</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <textarea
                  value={localData.highlight || ''}
                  onChange={(e) => setLocalData({ ...localData, highlight: e.target.value })}
                  placeholder="What was the highlight of your day?"
                  className="w-full h-64 p-6 border-2 border-gray-300 focus:border-black focus:outline-none resize-none text-lg"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'steps':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col bg-white p-8">
            <h2 className="text-2xl font-light mb-6">Number of Steps</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md text-center">
                <div className="mb-8">
                  <div className="text-8xl font-bold mb-4" style={{ color: '#22c55e' }}>
                    {localData.steps?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xl text-gray-600">steps</p>
                </div>
                <input
                  type="number"
                  value={localData.steps || ''}
                  onChange={(e) => setLocalData({ ...localData, steps: parseInt(e.target.value) || 0 })}
                  placeholder="Enter step count"
                  className="w-full p-4 text-center text-2xl border-2 border-gray-300 focus:border-black focus:outline-none"
                  min="0"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'notes':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col">
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
          </motion.div>
        );

      case 'photos':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col">
            <div className="notes-and-photos-section">
              <h2 className="text-xl font-light text-white p-4 border-b border-[#292a30]">Photos</h2>
              <div className="grid grid-cols-3 gap-4 p-4">
              </div>
            </div>
          </motion.div>
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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-[95vw] h-[95vh] flex border-2 border-black bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>

            <div className="w-20 flex flex-col border-l-2 border-black bg-gray-50">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.key}
                  whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveItem(item.key)}
                  className={`p-4 border-b border-gray-300 transition-all ${
                    activeItem === item.key 
                      ? 'bg-white text-black border-l-4 border-l-black' 
                      : 'text-gray-600'
                  }`}
                  title={item.label}
                >
                  <item.icon className="h-6 w-6 mx-auto" />
                </motion.button>
              ))}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="p-4 border-b border-gray-300 hover:bg-green-100 text-green-600 transition-all"
                title="Save"
              >
                <Save className="h-6 w-6 mx-auto" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-4 mt-auto border-t-2 border-black hover:bg-red-100 text-red-600 transition-all"
                title="Close"
              >
                <X className="h-6 w-6 mx-auto" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DayModal;