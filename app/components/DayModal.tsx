"use client";
import React, { useRef, useState, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
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
    { icon: ImageIcon, label: 'Photos', key: 'photos' }
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
        const doodleColors = [
          '#000000', '#FFFFFF', '#FF4953', '#C79B60', '#D4AF37', 
          '#2C3E50', '#E67E22', '#6C553A', '#8B0F1A', '#443532',
          '#12110D', '#C0392B', '#E9C297', '#9B7753', '#4E4A3D'
        ];
        
        return (
          <motion.div 
            key="doodle"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8 bg-transparent">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(-1.5deg)' }}>Doodle of the Day</h2>
            
            <div className="mb-6 flex flex-wrap items-center gap-8 p-6 bg-white/50 border-2 border-gray-600 rounded-xl scrapbook-card !p-6">
              <div className="flex items-center gap-4">
                <span className="typewriter">Tool</span>
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEraser(false)}
                    className={`px-4 py-2 font-heading text-xs uppercase tracking-widest transition-all ${
                      !isEraser ? 'bg-gray-600 text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    Pen
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEraser(true)}
                    className={`px-4 py-2 font-heading text-xs uppercase tracking-widest transition-all ${
                      isEraser ? 'bg-gray-600 text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    Eraser
                  </motion.button>
                </div>
              </div>

              {!isEraser && (
                <div className="flex items-center gap-4">
                  <span className="typewriter">Ink</span>
                  <div className="flex gap-2">
                    {doodleColors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPenColor(color)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          penColor === color ? 'border-gray-800 scale-125 ring-2 ring-gray-400 ring-offset-2' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="typewriter">Tip</span>
                <div className="flex gap-2">
                  {penSizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPenSize(size)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                        penSize === size ? 'bg-gray-100 border-2 border-gray-600' : 'bg-white border-2 border-gray-200'
                      }`}
                    >
                      <div 
                        className="rounded-full"
                        style={{ 
                          width: `${Math.min(size * 1.5, 16)}px`, 
                          height: `${Math.min(size * 1.5, 16)}px`,
                          backgroundColor: isEraser && penSize === size ? '#999' : penColor
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white border-4 border-gray-600 shadow-xl relative" style={{ borderRadius: '4px 8px 3px 6px', transform: 'rotate(0.5deg)' }}>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="cursor-crosshair max-w-full h-auto"
                />
                <div className="absolute -top-6 -left-6 w-12 h-12 washi-tape rotate-[-45deg] opacity-40" />
                <div className="absolute -bottom-6 -right-6 w-12 h-12 washi-tape rotate-[-45deg] opacity-40" />
              </div>
            </div>
            
            <div className="mt-8 self-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearCanvas}
                className="px-6 py-2 bg-journal-heart text-white font-heading text-xs uppercase tracking-widest border-2 border-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
              >
                Clear Page
              </motion.button>
            </div>
          </motion.div>
        );

      case 'weather':
        const weatherTypes: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'foggy', 'snowy', 'stormy'];
        return (
          <motion.div 
            key="weather"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(-1deg)' }}>Atmosphere</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl bg-white/50 border-2 border-gray-600 p-10 scrapbook-card">
                <div className="mb-12 text-center relative">
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-20 h-8 washi-tape opacity-40 rotate-2" />
                  <div className="text-8xl mb-4 drop-shadow-sm">
                    {localData.weather ? WEATHER_ICONS[localData.weather] : '🌤️'}
                  </div>
                  <p className="handwriting text-3xl capitalize text-gray-600">{localData.weather || 'Select weather'}</p>
                </div>
                <div className="relative pt-8">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={weatherTypes.indexOf(localData.weather || 'sunny')}
                    onChange={(e) => setLocalData({ ...localData, weather: weatherTypes[parseInt(e.target.value)] })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between mt-6">
                    {weatherTypes.map((weather) => (
                      <button
                        key={weather}
                        onClick={() => setLocalData({ ...localData, weather })}
                        className={`text-4xl transition-all duration-300 hover:scale-125 ${localData.weather === weather ? 'scale-125' : 'opacity-30'}`}
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
            key="rating"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(1.5deg)' }}>Day Pulse</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl bg-white/50 border-2 border-gray-600 p-10 scrapbook-card">
                <div className="text-center mb-12 relative">
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-8 washi-tape opacity-40 -rotate-1" />
                  <div 
                    className="inline-block text-9xl font-heading px-10 py-6 text-white transition-all duration-500 shadow-xl"
                    style={{ 
                      backgroundColor: localData.rating !== undefined ? RATING_COLORS[localData.rating] : '#e5e7eb',
                      borderRadius: '4px 8px 3px 6px',
                      transform: `rotate(${localData.rating ? (localData.rating - 5) * 2 : 0}deg)`
                    }}
                  >
                    {localData.rating !== undefined ? localData.rating : '?'}
                  </div>
                  <p className="handwriting text-2xl mt-6 text-gray-500">Overall Satisfaction</p>
                </div>
                <div className="grid grid-cols-11 gap-1">
                  {Array.from({ length: 11 }, (_, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLocalData({ ...localData, rating: i })}
                      className={`aspect-square flex items-center justify-center text-sm font-heading border-2 transition-all ${
                        localData.rating === i ? 'border-gray-800 scale-110 shadow-lg' : 'border-gray-200 opacity-60'
                      }`}
                      style={{ 
                        backgroundColor: RATING_COLORS[i],
                        color: 'white',
                        borderRadius: `${2 + i % 3}px`
                      }}
                    >
                      {i}
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
          { key: 'stomach-problem', label: 'Stomach' },
          { key: 'cold-cough', label: 'Cold/Cough' },
          { key: 'headache', label: 'Headache' },
          { key: 'brain-fog', label: 'Brain Fog' },
          { key: 'hangover', label: 'Hangover' },
          { key: 'other', label: 'Other' }
        ];
        return (
          <motion.div 
            key="health"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(-2deg)' }}>Vitals Check</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
                {healthCategories.map(({ key, label }, index) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 1 : -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLocalData({ ...localData, health: key })}
                    className={`p-8 border-2 transition-all scrapbook-card !p-8 ${
                      localData.health === key ? 'border-gray-800 ring-2 ring-gray-200' : 'border-gray-300 opacity-70 grayscale-[0.5]'
                    }`}
                    style={{ 
                      backgroundColor: localData.health === key ? HEALTH_COLORS[key] : 'white',
                      color: localData.health === key ? 'white' : 'black',
                      borderRadius: `${10 + index % 5}px ${15 - index % 4}px ${12 + index % 3}px ${8 + index % 6}px`,
                      transform: `rotate(${index % 2 === 0 ? -1.5 : 1.5}deg)`
                    }}
                  >
                    <span className="font-heading text-xs uppercase tracking-widest block">{label}</span>
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
            key="anxiety"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(1deg)' }}>Anxiety Log</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl space-y-8 bg-white/50 border-2 border-gray-600 p-10 scrapbook-card">
                <div className="grid grid-cols-5 gap-3">
                  {anxietyLevels.map(({ key, label }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocalData({ ...localData, anxiety: { level: key, details: localData.anxiety?.details } })}
                      className={`p-4 border-2 transition-all ${
                        localData.anxiety?.level === key ? 'border-gray-800 ring-2 ring-gray-200' : 'border-gray-200 opacity-60'
                      }`}
                      style={{ 
                        backgroundColor: localData.anxiety?.level === key ? ANXIETY_COLORS[key] : 'white',
                        color: localData.anxiety?.level === key ? 'white' : 'black',
                        borderRadius: '4px 8px 3px 6px'
                      }}
                    >
                      <span className="font-heading text-[10px] uppercase tracking-tighter block">{label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t-2 border-dashed border-gray-300 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showAnxietyDetails}
                      onChange={(e) => setShowAnxietyDetails(e.target.checked)}
                      className="w-6 h-6 border-2 border-gray-600 rounded cursor-pointer accent-gray-600"
                    />
                    <span className="typewriter text-xs group-hover:text-gray-800 transition-colors">Add detailed notes</span>
                  </label>
                </div>
                <AnimatePresence>
                  {showAnxietyDetails && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 150 }}
                      exit={{ opacity: 0, height: 0 }}
                      value={localData.anxiety?.details || ''}
                      onChange={(e) => setLocalData({ ...localData, anxiety: { level: localData.anxiety?.level || 'none', details: e.target.value } })}
                      placeholder="What was on your mind?..."
                      className="w-full p-6 bg-white/80 border-2 border-gray-600 scrapbook-card handwriting text-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
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
            key="dream"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(-1.5deg)' }}>Dream Log</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl space-y-8 bg-white/50 border-2 border-gray-600 p-10 scrapbook-card">
                <div className="grid grid-cols-3 gap-4">
                  {dreamCategories.map(({ key, label }, index) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocalData({ ...localData, dream: { category: key, details: localData.dream?.details } })}
                      className={`p-4 border-2 transition-all ${
                        localData.dream?.category === key ? 'border-gray-800 ring-2 ring-gray-200' : 'border-gray-200 opacity-60'
                      }`}
                      style={{ 
                        backgroundColor: localData.dream?.category === key ? DREAM_COLORS[key] : 'white',
                        color: localData.dream?.category === key ? 'white' : 'black',
                        borderRadius: `${index % 2 === 0 ? '4px 12px' : '12px 4px'}`
                      }}
                    >
                      <span className="font-heading text-[10px] uppercase tracking-tighter block">{label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t-2 border-dashed border-gray-300 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showDreamDetails}
                      onChange={(e) => setShowDreamDetails(e.target.checked)}
                      className="w-6 h-6 border-2 border-gray-600 rounded cursor-pointer accent-gray-600"
                    />
                    <span className="typewriter text-xs group-hover:text-gray-800 transition-colors">Record dream story</span>
                  </label>
                </div>
                <AnimatePresence>
                  {showDreamDetails && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 150 }}
                      exit={{ opacity: 0, height: 0 }}
                      value={localData.dream?.details || ''}
                      onChange={(e) => setLocalData({ ...localData, dream: { category: localData.dream?.category || 'dont-remember', details: e.target.value } })}
                      placeholder="The dream was about..."
                      className="w-full p-6 bg-white/80 border-2 border-gray-600 scrapbook-card handwriting text-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
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
            key="highlight"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(1deg)' }}>Highlight</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl relative">
                <div className="absolute -top-4 left-10 w-24 h-8 washi-tape rotate-[-2deg] z-10" />
                <textarea
                  value={localData.highlight || ''}
                  onChange={(e) => setLocalData({ ...localData, highlight: e.target.value })}
                  placeholder="Today was amazing because..."
                  className="w-full h-80 p-10 bg-white border-2 border-gray-600 scrapbook-card handwriting text-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-2xl"
                  style={{ borderRadius: '12px 18px 10px 15px' }}
                />
                <div className="absolute bottom-4 right-8 font-mono text-[10px] opacity-20 uppercase tracking-widest">
                  Personal Record
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'steps':
        return (
          <motion.div 
            key="steps"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8">
            <h2 className="label-maker mb-8 self-start" style={{ transform: 'rotate(-1.5deg)' }}>Mobility</h2>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md text-center bg-white/50 border-2 border-gray-600 p-12 scrapbook-card">
                <div className="mb-12 relative">
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-20 h-8 washi-tape opacity-40 rotate-1" />
                  <div className="font-heading text-8xl mb-4 text-green-600 drop-shadow-sm">
                    {localData.steps?.toLocaleString() || '0'}
                  </div>
                  <p className="typewriter text-xs text-gray-400">Steps Journeyed</p>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={localData.steps || ''}
                    onChange={(e) => setLocalData({ ...localData, steps: parseInt(e.target.value) || 0 })}
                    placeholder="Steps count"
                    className="w-full p-6 text-center text-3xl font-heading border-2 border-gray-600 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-200 scrapbook-card !p-6"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'notes':
        return (
          <motion.div 
            key="notes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col">
            <div className="notes-and-photos-section !h-full">
              <div className="p-8 flex items-center justify-between border-b-2 border-gray-600/10">
                <h2 className="label-maker" style={{ transform: 'rotate(-1deg)' }}>
                  Day Notes
                </h2>
                <span className="typewriter text-[10px] opacity-40">
                  {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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
            key="photos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col">
            <div className="notes-and-photos-section !h-full">
              <div className="p-8 flex items-center justify-between border-b-2 border-gray-600/10">
                <h2 className="label-maker" style={{ transform: 'rotate(1.5deg)' }}>Gallery</h2>
                <span className="typewriter text-[10px] opacity-40">Moments Captured</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-8 opacity-20">
                <div className="text-center">
                  <ImageIcon className="w-24 h-24 mx-auto mb-4" />
                  <p className="typewriter text-xs uppercase tracking-widest">No memories captured yet</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center bg-transparent">
            <h2 className="typewriter text-sm opacity-30">Explore the sidebar sections</h2>
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotate: 2 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-5xl h-[90vh] flex flex-col md:flex-row border-2 border-gray-600 bg-journal-paper scrapbook-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              borderRadius: '15px 20px 18px 25px',
              boxShadow: '12px 12px 0px rgba(0,0,0,0.15)'
            }}
          >
            {/* Washi Tape Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 washi-tape -translate-y-4 rotate-1 z-50" />

            {/* Sidebar / Tabs */}
            <div className="w-full md:w-24 flex md:flex-col border-b-2 md:border-b-0 md:border-r-2 border-gray-600 bg-neutral-100/50">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.key}
                  whileHover={{ backgroundColor: '#fff', x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveItem(item.key)}
                  className={`flex-1 md:flex-none p-4 transition-all relative flex flex-col items-center gap-1 ${
                    activeItem === item.key 
                      ? 'bg-white text-gray-800' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={item.label}
                >
                  <item.icon className={`h-6 w-6 ${activeItem === item.key ? 'scale-110' : ''}`} />
                  <span className="typewriter text-[8px] md:block hidden">{item.label}</span>
                  {activeItem === item.key && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-y-0 left-0 w-1 bg-gray-600 md:block hidden"
                    />
                  )}
                </motion.button>
              ))}
              
              <div className="mt-auto flex md:flex-col border-t-2 border-gray-600">
                <motion.button 
                  whileHover={{ backgroundColor: '#dcfce7' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex-1 md:flex-none p-4 text-green-600 hover:text-green-700 transition-colors border-r-2 md:border-r-0 md:border-b-2 border-gray-600"
                  title="Save"
                >
                  <Save className="h-6 w-6 mx-auto" />
                </motion.button>
                <motion.button 
                  whileHover={{ backgroundColor: '#fee2e2' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 md:flex-none p-4 text-red-500 hover:text-red-600 transition-colors"
                  title="Close"
                >
                  <X className="h-6 w-6 mx-auto" />
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
              <AnimatePresence mode="wait">
                <div className="h-full overflow-y-auto custom-scrollbar">
                  {renderContent()}
                </div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DayModal;
