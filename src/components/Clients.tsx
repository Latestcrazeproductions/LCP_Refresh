import { motion } from 'motion/react';

const clients = [
  "TECH_GIANT", "INNOVATE_CORP", "FUTURE_SYSTEMS", "GLOBAL_MEDIA", "APEX_DIGITAL", "NEXUS_LABS", "OMEGA_INDUSTRIES", "PRIME_EVENTS"
];

export default function Clients() {
  return (
    <section className="py-12 bg-black border-y border-white/5 overflow-hidden relative z-20">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-600 text-center">Trusted by Industry Leaders</p>
      </div>
      
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div 
          className="flex gap-16 whitespace-nowrap pr-16"
          animate={{ x: "-50%" }}
          transition={{ 
            repeat: Infinity, 
            duration: 30, 
            ease: "linear" 
          }}
        >
          {[...clients, ...clients, ...clients, ...clients].map((client, index) => (
            <span 
              key={index} 
              className="text-2xl md:text-4xl font-display font-bold text-white/20 uppercase tracking-tighter hover:text-white/40 transition-colors cursor-default"
            >
              {client}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
