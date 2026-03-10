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
    <section id="vision" className="relative h-screen w-full flex items-start justify-center overflow-hidden">
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
            alt="Latest Craze Productions corporate event - LED video walls and live event production setup" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        {/* Gradient overlay for text readability, but keeping image visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle overall tint for text contrast */}
      </div>

      {/* Content — aligned to top so image remains visible */}
      <div className="relative z-20 text-center px-4 max-w-7xl mx-auto pt-24 md:pt-28">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9] drop-shadow-2xl whitespace-nowrap"
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          {(hero?.headline ?? 'IMMERSIVE IMPACT').replace(/\n/g, ' ')}
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white font-bold uppercase tracking-wide max-w-2xl mx-auto drop-shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {hero?.subhead ?? 'WE DESIGN EVENTS THAT MOVE PEOPLE'}
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
          <span className="font-display font-bold text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
          <ChevronDown className="w-6 h-6 text-white/50 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
