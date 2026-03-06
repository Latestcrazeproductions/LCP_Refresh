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
    eyebrow: 'The Future of Live Events',
    headline: 'IMMERSIVE\nIMPACT',
    subhead:
      'We engineer 40ft video walls and lighting experiences that define moments.',
    /** Add images to public/images/hero/ and list paths. Use /images/hero/hero-1.jpg etc. when ready. */
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2000&auto=format&fit=crop',
    ] as string[],
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
      { type: 'text' as const, value: 'NEXUS_LABS' },
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
    ],
  },

  /** Contact section */
  contact: {
    headline: "LET'S MAKE YOU\nTHE HERO.",
    subhead:
      "The pressure is on. We're here to carry it. Reach out to discuss how we can turn your vision into a career-defining moment.",
    email: 'production@nexusav.com',
    phone: '+1 (555) 012-3456',
    address: '101 Tech Plaza, San Francisco, CA',
    ctaText: 'Initiate Project',
    copyright: '© 2026 Latest Craze Productions. All rights reserved.',
    footerLinks: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Instagram', href: '#' },
    ],
  },
} as const;
