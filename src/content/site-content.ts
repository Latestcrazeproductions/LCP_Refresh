/**
 * Site Content — Single source of truth for all page content.
 *
 * Add your images to the public/ folder (see CONTENT_GUIDE.md for structure).
 * Reference them by path, e.g. "/images/hero/hero-1.jpg"
 */

export const siteContent = {
  /** Company branding — used in Navbar, footer, meta */
  brand: {
    name: 'Latest Craze',
    nameFull: 'Latest Craze Productions',
    /** Path to company logo. Use /logos/company/logo.svg or logo.png. Falls back to text if null. */
    logo: null as string | null,
    /** Optional: dark/light logo variants for different backgrounds */
    logoDark: null as string | null,
    /** Logo height in pixels (navbar). Configurable in CMS. */
    logoHeight: 64,
  },

  /** Hero section */
  hero: {
    eyebrow: '', // optional; left empty per design
    headline: 'IMMERSIVE IMPACT',
    subhead: 'WE DESIGN EVENTS THAT MOVE PEOPLE',
    /** Add images to public/images/hero/ and list paths. Use /images/hero/hero-1.jpg etc. when ready. */
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2000&auto=format&fit=crop',
    ] as string[],
  },

  /** Featured video on homepage — YouTube embed between Events and Clients sections */
  featuredVideo: {
    /** Full YouTube URL (e.g. https://www.youtube.com/watch?v=VIDEO_ID) — editable in CMS */
    youtubeUrl: 'https://www.youtube.com/watch?v=qrix9EAM_js&t=30s',
  },

  /** Work section — client logos + featured projects */
  work: {
    /** Marquee text or logos. Use logo path for image, or string for text-only. */
    clients: [
      { type: 'text' as const, value: 'TECH_GIANT' },
      { type: 'text' as const, value: 'INNOVATE_CORP' },
      { type: 'text' as const, value: 'FUTURE_SYSTEMS' },
      { type: 'text' as const, value: 'GLOBAL_MEDIA' },
      { type: 'text' as const, value: 'APEX_DIGITAL' },
      { type: 'text' as const, value: 'LATEST_CRAZE' },
      { type: 'text' as const, value: 'OMEGA_INDUSTRIES' },
      { type: 'text' as const, value: 'PRIME_EVENTS' },
      // Logo example: { type: 'logo' as const, src: '/logos/clients/client-1.svg', alt: 'Client Name' }
    ] as Array<
      | { type: 'text'; value: string }
      | { type: 'logo'; src: string; alt: string }
    >,
    clientsLabel: 'Trusted by Industry Leaders',

    /** Featured projects. Set image to /images/work/project-N.jpg once you add files. */
    projects: [
      {
        id: 1,
        title: 'The Apex Keynote',
        category: 'A Standing Ovation',
        image: 'https://picsum.photos/seed/tech1/800/600?grayscale',
        size: 'col-span-1 md:col-span-2',
      },
      {
        id: 2,
        title: 'Neon Nights Gala',
        category: 'Pure Euphoria',
        image: 'https://picsum.photos/seed/lights2/400/600',
        size: 'col-span-1',
      },
      {
        id: 3,
        title: 'FutureForward 2025',
        category: 'Total Immersion',
        image: 'https://picsum.photos/seed/stage3/400/600',
        size: 'col-span-1',
      },
      {
        id: 4,
        title: 'Summit One',
        category: 'The C-Suite Reveal',
        image: 'https://picsum.photos/seed/crowd4/800/600?grayscale',
        size: 'col-span-1 md:col-span-2',
      },
    ],
    projectsTitle: 'Moments of Triumph',
    projectsSubhead: 'When the planning ends and the magic begins.',
  },

  /** Technical Precision / Services section */
  services: {
    sectionTitle: 'Technical Precision',
    sectionSubhead: 'Our toolkit for creating unforgettable experiences.',
    items: [
      {
        id: 'led-walls',
        iconKey: 'monitor',
        title: 'Ultra-Wide LED Walls',
        description: '40ft+ seamless displays that dominate the visual field.',
        image:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1200&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Unrivaled Visual Immersion',
          text: "Our flagship 40ft+ LED walls redefine corporate presentations. By eliminating bezels and pushing resolution to the limit, we create a canvas that allows for true cinematic storytelling. Whether it's a high-stakes keynote or an immersive brand reveal, our displays deliver perfect color accuracy and HDR contrast that standard projection simply cannot match.",
          features: [
            '1.5mm Fine Pixel Pitch for 4K/8K clarity',
            'High Dynamic Range (HDR10) Support',
            'Custom Aspect Ratios (32:9 Ultra-Wide)',
            'Curved & Corner Configurations',
            'Full Redundancy for Mission-Critical Events',
          ],
        },
      },
      {
        id: 'lighting',
        iconKey: 'zap',
        title: 'Intelligent Lighting',
        description: 'Architectural and atmospheric lighting design.',
        image:
          'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Atmosphere & Emotion',
          text: "Lighting is the heartbeat of any event. Our intelligent lighting systems go beyond simple illumination to create dynamic, emotional landscapes. From subtle, brand-aligned ambient washes to high-energy, music-synchronized strobe sequences, we design lighting that guides the audience's attention and amplifies the impact of every moment.",
          features: [
            'Moving Head Beam & Spot Fixtures',
            'Pixel-Mapped LED Bars & Tubes',
            'Wireless Uplighting for Architectural Highlights',
            'Timecode Synchronization with Video & Audio',
            'Haze & Atmospheric Effects',
          ],
        },
      },
      {
        id: 'stage',
        iconKey: 'layers',
        title: 'Stage Design',
        description: 'Custom fabrication blending physical and digital worlds.',
        image:
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Physical meets Digital',
          text: "We believe the stage is more than a platform; it's a statement. Our scenic design team combines custom fabrication with digital elements to build stages that feel like modern art installations. We integrate LED surfaces into physical structures, create multi-dimensional depth, and ensure every angle looks perfect for both the live audience and the camera.",
          features: [
            'Custom Scenic Fabrication & Carpentry',
            'Integrated LED & Projection Surfaces',
            'Modular Staging Systems',
            'High-Gloss & Matte Flooring Options',
            '3D Renderings & CAD Planning',
          ],
        },
      },
      {
        id: 'audio',
        iconKey: 'mic2',
        title: 'Precision Audio',
        description: 'Crystal clear line-array systems for immersive sound.',
        image:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Sonic Perfection',
          text: "In a corporate environment, clarity is king. Our precision audio systems are tuned to ensure every word of a keynote is heard with crystal-clear intelligibility, no matter where you sit. But we also bring the power. When the walk-on music hits or the video plays, our line-array systems deliver a full-range, immersive soundscape that you can feel.",
          features: [
            'Premium Line-Array Systems (L-Acoustics, d&b)',
            'Digital Mixing Consoles with Redundancy',
            'RF Coordination & Wireless Microphones',
            'Immersive Surround Sound Configurations',
            'Acoustic Analysis & Room Tuning',
          ],
        },
      },
      {
        id: 'scenic',
        iconKey: 'boxes',
        title: 'Scenic Design',
        description: 'Custom fabrication and scenic elements that transform spaces.',
        image:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Artistry Meets Engineering',
          text: "Every event deserves a stage that tells a story. Our scenic design team brings your vision to life through custom fabrication, intricate set pieces, and transformative backdrops. We build everything from elegant corporate environments and branded entrance arches to bold product launch structures and immersive installation spaces. Our craftspeople combine carpentry, metalwork, and finishing with fabric draping and hand-painted details—creating scenic elements that seamlessly integrate with LED, lighting, and audio. Whether you need a commanding keynote backdrop, modular structures for multiple breakout zones, or photo-worthy installations for brand activations, we deliver scenic design that elevates the entire experience.",
          features: [
            'Custom Scenic Fabrication & Carpentry',
            'Hand-Painted Backdrops & Murals',
            'Modular Set Pieces & Reconfigurable Structures',
            'Fabric Draping, Soft Goods & Tension Fabrics',
            'Props, Signage & Decorative Elements',
            'Full Installation, Strike & Storage Solutions',
          ],
        },
      },
      {
        id: 'projection',
        iconKey: 'projector',
        title: 'Projection Mapping',
        description: '3D projection mapping that transforms surfaces into dynamic canvases.',
        image:
          'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Surfaces Come Alive',
          text: "Projection mapping turns any surface into a dynamic storytelling medium. Our team specializes in architectural projection, 3D mapping, and custom content that transforms buildings, stages, and scenic structures into breathtaking visual experiences. We warp and blend imagery precisely to physical geometry—so content fits curves, angles, and irregular shapes without distortion. From brand logos that appear to emerge from walls, to product reveals that unfold across 3D set pieces, to immersive environments that envelop the audience, we create illusions that blur the line between reality and digital art. Partner with us for product launches, keynotes, brand activations, and experiential installations where projection is the hero.",
          features: [
            '3D Architectural & Stage Projection Mapping',
            'Custom Content Creation, Animation & Media Design',
            'Multi-Projector Blending, Warping & Edge Blending',
            'Interactive & Touch-Responsive Projection',
            'Real-Time Content Control (Resolume, TouchDesigner)',
            'Mapping on Buildings, Props, Floors & Custom Structures',
          ],
        },
      },
    ],
  },

  /** Event Types section — types of events we create */
  eventTypes: {
    sectionTitle: 'Events We Create',
    sectionSubhead: 'From high-stakes keynotes to immersive brand activations.',
    items: [
      {
        id: 'corporate-keynotes',
        iconKey: 'mic2',
        title: 'Corporate Keynotes',
        description: 'Executive presentations, all-hands, and leadership summits with cinematic production value.',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Executive Impact',
          text: 'From C-suite reveals to all-hands meetings, we deliver main-stage productions that command attention. Our LED walls, intelligent lighting, and precision audio ensure every word lands—whether you’re addressing 50 or 5,000. Leadership summits and town halls become moments that move people.',
          features: [
            'Main stage keynote production',
            'All-hands & town hall events',
            'Leadership summits',
            'LED reveal moments',
            'Multi-camera live stream',
            'Executive coaching & rehearsals',
          ],
        },
      },
      {
        id: 'product-launches',
        iconKey: 'package',
        title: 'Product Launches',
        description: 'Reveal moments that make products unforgettable—LED reveals, projection mapping, and stage drama.',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Reveal the Moment',
          text: 'Product launches deserve a stage that matches the hype. We create reveal moments—dramatic LED walls, projection-mapped surfaces, and theatrical staging—that make your product the hero. From intimate press events to massive launch parties, we turn announcements into unforgettable experiences.',
          features: [
            'LED & projection reveal moments',
            'Product demo staging',
            'Press conference setup',
            'Virtual & hybrid integration',
            'Brand activation zones',
            'Pre-launch teaser experiences',
          ],
        },
      },
      {
        id: 'galas-awards',
        iconKey: 'award',
        title: 'Galas & Awards',
        description: 'Red-carpet elegance meets dynamic lighting and audio for nights that inspire.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Red Carpet Excellence',
          text: 'Galas and awards ceremonies demand elegance and energy in equal measure. We bring red-carpet polish, dramatic lighting transitions, and crystal-clear audio so every acceptance speech and trophy moment feels cinematic. From dinner to awards to after-party, we keep the energy flowing.',
          features: [
            'Red carpet & photo ops',
            'Awards ceremony staging',
            'Trophy reveal moments',
            'Dinner and program flow',
            'After-party transitions',
            'Live video to screens',
          ],
        },
      },
      {
        id: 'conferences',
        iconKey: 'users',
        title: 'Conferences',
        description: 'Multi-day events with main stages, breakout sessions, and seamless AV transitions.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Multi-Day Mastery',
          text: 'Conferences are marathons, not sprints. We manage main stages, breakout rooms, speaker-ready spaces, and networking zones with seamless AV transitions throughout. Whether it’s a two-day summit or a week-long industry gathering, we keep every session sharp and every transition smooth.',
          features: [
            'Main stage & breakout sessions',
            'Speaker-ready rooms',
            'Registration & lobby experiences',
            'Networking zones',
            'Streaming & on-demand capture',
            'Hybrid audience integration',
          ],
        },
      },
      {
        id: 'brand-activations',
        iconKey: 'sparkles',
        title: 'Brand Activations',
        description: 'Pop-ups, installations, and experiential marketing that stops people in their tracks.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        ] as string[],
        details: {
          headline: 'Experiential Impact',
          text: 'Brand activations turn spaces into experiences. We design pop-ups, installations, and experiential moments that create shareable, memorable encounters with your brand. From retail takeovers to festival activations, we build environments that stop people in their tracks.',
          features: [
            'Pop-up & installation design',
            'Photo-worthy moments',
            'Product sampling zones',
            'Retail & event integration',
            'Interactive tech experiences',
            'Activation-to-event handoffs',
          ],
        },
      },
    ] as Array<{
      id: string;
      iconKey?: string;
      title: string;
      description: string;
      image: string;
      gallery?: string[];
      details?: { headline: string; text: string; features: string[] };
    }>,
  },

  /** FAQ section */
  faq: {
    sectionTitle: 'Frequently Asked Questions',
    items: [
      {
        question: 'What types of events does Latest Craze Productions handle?',
        answer: 'We specialize in corporate keynotes, product launches, galas and awards ceremonies, conferences, and brand activations. Our services include LED video walls, intelligent lighting, stage design, precision audio, scenic design, and projection mapping.',
      },
      {
        question: 'Where is Latest Craze Productions based?',
        answer: 'We are based in Phoenix, Arizona, and serve corporate events across North America. Our team travels to venues nationwide for high-profile productions.',
      },
      {
        question: 'What is the typical lead time for an event?',
        answer: 'We recommend 4–8 weeks for standard corporate events. Large-scale productions with custom fabrication may require 8–12 weeks. Contact us as soon as your event is confirmed to secure availability.',
      },
      {
        question: 'How much does an AV setup cost for my event?',
        answer: 'We work closely with you to understand your budget and design an AV solution that fits within your means. Every event is different, so pricing depends on factors like size, scope, and technical requirements. With our extensive inventory and flexible options, we’re able to tailor the right setup to maximize impact without overspending.',
      },
      {
        question: 'Do you provide LED video wall rentals?',
        answer: 'Yes. We offer ultra-wide LED walls (40ft+), fine pixel pitch displays for 4K/8K clarity, and custom configurations including curved and corner setups. All displays include full redundancy for mission-critical events.',
      },
      {
        question: 'How does Latest Craze Productions handle lighting design?',
        answer: 'Our intelligent lighting systems include moving heads, pixel-mapped LED bars, wireless uplighting, timecode sync with video and audio, and atmospheric effects. We design lighting that creates emotion and guides audience attention.',
      },
      {
        question: 'What audio equipment do you use?',
        answer: 'We deploy premium line-array systems from L-Acoustics and d&b, digital mixing consoles with redundancy, RF coordination for wireless mics, and immersive surround configurations. Every system is tuned for crystal-clear intelligibility.',
      }
    ]
  },

  /** Contact section */
  contact: {
    headline: "LET'S MAKE YOU\nTHE HERO.",
    subhead:
      "The pressure is on. We're here to carry it. Reach out to discuss how we can turn your vision into a career-defining moment.",
    email: 'info@latestcrazeproductions.com',
    phone: '+1 (480) 626-5231',
    address: '4035 E Magnolia St Phoenix, AZ 85034',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Contact Us',
    copyright: '© 2025 Latest Craze Productions. All rights reserved.',
    footerLinks: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Instagram', href: 'https://www.instagram.com/latestcrazeproductions/?hl=en' },
    ],
  },
} as const;
