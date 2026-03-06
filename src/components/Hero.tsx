'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useContent } from '@/context/ContentContext';

export default function Hero() {
  const { hero } = useContent();
  const images =
    hero?.images && Array.isArray(hero.images) && hero.images.length > 0
    ? hero.images
    : ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="vision" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image Slideshow with Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={currentImageIndex}
            src={images[currentImageIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            alt="Corporate event setup" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        {/* Gradient overlay for text readability, but keeping image visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle overall tint for text contrast */}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-7xl mx-auto mt-20">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-sm md:text-base tracking-[0.3em] uppercase text-white/90 font-semibold mb-6 drop-shadow-md"
        >
          {hero?.eyebrow ?? 'The Future of Live Events'}
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9] drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          {(hero?.headline ?? 'IMMERSIVE\nIMPACT').split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {hero?.subhead ?? 'We engineer 40ft video walls and lighting experiences that define moments.'}
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
          <ChevronDown className="w-6 h-6 text-white/50 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
