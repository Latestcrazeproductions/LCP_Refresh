import { motion } from 'motion/react';

const projects = [
  {
    id: 1,
    title: "The Apex Keynote",
    category: "A Standing Ovation",
    image: "https://picsum.photos/seed/tech1/800/600?grayscale",
    size: "col-span-1 md:col-span-2"
  },
  {
    id: 2,
    title: "Neon Nights Gala",
    category: "Pure Euphoria",
    image: "https://picsum.photos/seed/lights2/400/600",
    size: "col-span-1"
  },
  {
    id: 3,
    title: "FutureForward 2025",
    category: "Total Immersion",
    image: "https://picsum.photos/seed/stage3/400/600",
    size: "col-span-1"
  },
  {
    id: 4,
    title: "Summit One",
    category: "The C-Suite Reveal",
    image: "https://picsum.photos/seed/crowd4/800/600?grayscale",
    size: "col-span-1 md:col-span-2"
  }
];

export default function Gallery() {
  return (
    <section className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Moments of Triumph</h2>
          <p className="text-gray-400 mt-4 md:mt-0 max-w-xs text-right">
            When the planning ends and the magic begins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[400px]">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`relative group overflow-hidden rounded-xl ${project.size}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {project.category}
                </p>
                <h3 className="text-2xl font-bold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
