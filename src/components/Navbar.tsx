'use client';

import Image from 'next/image';
import { motion, useScroll } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export default function Navbar() {
  const { brand } = useContent();
  const safeBrand = brand ?? {
    name: 'Nexus',
    nameFull: 'Nexus AV Productions',
    logo: null as string | null,
    logoDark: null as string | null,
    logoHeight: 64,
  };
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navBackground = isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent";

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#vision" className="flex items-center gap-1">
          {safeBrand.logo ? (
            <Image
              src={safeBrand.logo}
              alt={safeBrand.nameFull}
              width={(safeBrand.logoHeight ?? 64) * 3.5}
              height={safeBrand.logoHeight ?? 64}
              className="w-auto object-contain"
              style={{ height: `${safeBrand.logoHeight ?? 64}px` }}
              priority
            />
          ) : (
            <span className="text-2xl font-bold tracking-tighter font-display">
              {safeBrand.name.toUpperCase()}
              <span className="text-blue-500">.</span>
            </span>
          )}
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          {[
            { label: 'Expertise', href: '#expertise' },
            { label: 'Work', href: '#work' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/cms/login"
            className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-400 transition-colors"
          >
            Log in
          </a>
          <a
            href="#contact"
            className="px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Book Demo
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden absolute top-14 left-0 w-full bg-black border-b border-white/10 p-4 flex flex-col gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: 'Expertise', href: '#expertise' },
            { label: 'Work', href: '#work' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-display text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/cms/login"
            className="text-xs text-gray-500 hover:text-gray-400 pt-2 border-t border-white/5"
            onClick={() => setIsOpen(false)}
          >
            Log in
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
