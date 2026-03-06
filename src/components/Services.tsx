import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Zap, Mic2, Layers, ArrowUpRight, X, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const services = [
  {
    id: "led-walls",
    icon: <Monitor className="w-6 h-6" />,
    title: "Ultra-Wide LED Walls",
    description: "40ft+ seamless displays that dominate the visual field.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    details: {
      headline: "Unrivaled Visual Immersion",
      text: "Our flagship 40ft+ LED walls redefine corporate presentations. By eliminating bezels and pushing resolution to the limit, we create a canvas that allows for true cinematic storytelling. Whether it's a high-stakes keynote or an immersive brand reveal, our displays deliver perfect color accuracy and HDR contrast that standard projection simply cannot match.",
      features: [
        "1.5mm Fine Pixel Pitch for 4K/8K clarity",
        "High Dynamic Range (HDR10) Support",
        "Custom Aspect Ratios (32:9 Ultra-Wide)",
        "Curved & Corner Configurations",
        "Full Redundancy for Mission-Critical Events"
      ]
    }
  },
  {
    id: "lighting",
    icon: <Zap className="w-6 h-6" />,
    title: "Intelligent Lighting",
    description: "Architectural and atmospheric lighting design.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop",
    details: {
      headline: "Atmosphere & Emotion",
      text: "Lighting is the heartbeat of any event. Our intelligent lighting systems go beyond simple illumination to create dynamic, emotional landscapes. From subtle, brand-aligned ambient washes to high-energy, music-synchronized strobe sequences, we design lighting that guides the audience's attention and amplifies the impact of every moment.",
      features: [
        "Moving Head Beam & Spot Fixtures",
        "Pixel-Mapped LED Bars & Tubes",
        "Wireless Uplighting for Architectural Highlights",
        "Timecode Synchronization with Video & Audio",
        "Haze & Atmospheric Effects"
      ]
    }
  },
  {
    id: "stage",
    icon: <Layers className="w-6 h-6" />,
    title: "Stage Design",
    description: "Custom fabrication blending physical and digital worlds.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    details: {
      headline: "Physical meets Digital",
      text: "We believe the stage is more than a platform; it's a statement. Our scenic design team combines custom fabrication with digital elements to build stages that feel like modern art installations. We integrate LED surfaces into physical structures, create multi-dimensional depth, and ensure every angle looks perfect for both the live audience and the camera.",
      features: [
        "Custom Scenic Fabrication & Carpentry",
        "Integrated LED & Projection Surfaces",
        "Modular Staging Systems",
        "High-Gloss & Matte Flooring Options",
        "3D Renderings & CAD Planning"
      ]
    }
  },
  {
    id: "audio",
    icon: <Mic2 className="w-6 h-6" />,
    title: "Precision Audio",
    description: "Crystal clear line-array systems for immersive sound.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop",
    details: {
      headline: "Sonic Perfection",
      text: "In a corporate environment, clarity is king. Our precision audio systems are tuned to ensure every word of a keynote is heard with crystal-clear intelligibility, no matter where you sit. But we also bring the power. When the walk-on music hits or the video plays, our line-array systems deliver a full-range, immersive soundscape that you can feel.",
      features: [
        "Premium Line-Array Systems (L-Acoustics, d&b)",
        "Digital Mixing Consoles with Redundancy",
        "RF Coordination & Wireless Microphones",
        "Immersive Surround Sound Configurations",
        "Acoustic Analysis & Room Tuning"
      ]
    }
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Technical Precision</h2>
            <p className="text-gray-400 max-w-md">Our toolkit for creating unforgettable experiences.</p>
          </div>
          <div className="text-right hidden md:block">
             <span className="text-xs uppercase tracking-widest text-gray-600">Capabilities 01 — 04</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => service.details && setSelectedService(service)}
            >
              {/* Background Image */}
              <img 
                src={service.image} 
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="mb-4 p-3 w-fit rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                      {service.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-white">{service.title}</h3>
                    <p className="text-gray-300 max-w-sm">{service.description}</p>
                  </div>
                  {service.details && (
                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
            />
            <motion.div 
              layoutId={`card-${selectedService.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-50 flex flex-col scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 md:h-80 shrink-0">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 md:p-10 -mt-12 relative">
                <div className="mb-6 p-3 w-fit rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 relative z-10">
                  {selectedService.icon}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{selectedService.title}</h3>
                
                {selectedService.details && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-semibold text-blue-400 mb-2">{selectedService.details.headline}</h4>
                      <p className="text-gray-300 leading-relaxed text-lg">{selectedService.details.text}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <h5 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Key Specifications</h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedService.details.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
