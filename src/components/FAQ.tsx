'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export type FAQItem = { question: string; answer: string };

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: 'What types of events does Latest Craze Productions handle?',
    answer:
      'We specialize in corporate keynotes, product launches, galas and awards ceremonies, conferences, and brand activations. Our services include LED video walls, intelligent lighting, stage design, precision audio, scenic design, and projection mapping.',
  },
  {
    question: 'Where is Latest Craze Productions based?',
    answer:
      'We are based in Phoenix, Arizona, and serve corporate events across the United States. Our team travels to venues nationwide for high-profile productions.',
  },
  {
    question: 'What is the typical lead time for an event?',
    answer:
      'We recommend 4–8 weeks for standard corporate events. Large-scale productions with custom fabrication may require 8–12 weeks. Contact us as soon as your event is confirmed to secure availability.',
  },
  {
    question: 'Do you provide LED video wall rentals?',
    answer:
      'Yes. We offer ultra-wide LED walls (40ft+), fine pixel pitch displays for 4K/8K clarity, and custom configurations including curved and corner setups. All displays include full redundancy for mission-critical events.',
  },
  {
    question: 'How does Latest Craze Productions handle lighting design?',
    answer:
      'Our intelligent lighting systems include moving heads, pixel-mapped LED bars, wireless uplighting, timecode sync with video and audio, and atmospheric effects. We design lighting that creates emotion and guides audience attention.',
  },
  {
    question: 'What audio equipment do you use?',
    answer:
      'We deploy premium line-array systems from L-Acoustics and d&b, digital mixing consoles with redundancy, RF coordination for wireless mics, and immersive surround configurations. Every system is tuned for crystal-clear intelligibility.',
  },
];

export default function FAQ({ items = DEFAULT_FAQS }: { items?: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400 mb-16">
          Quick answers for planners and decision-makers.
        </p>

        <div className="space-y-3">
          {items.map((faq, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/5 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-gray-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
