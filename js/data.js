/**
 * HUNGAMA FESTIVAL - CONSOLIDATED DATA
 * Single source of truth for nominees/winners and jury data
 * Used by: nominees.html, winners.html, jury.html
 */

// ===== FESTIVAL DATA (nominees/winners) =====

const FESTIVAL_DATA = {
  categories: [
    {
      id: 'ai-short-film',
      name: 'AI Short Film',
      description: 'Innovative short films created with AI technology',
      nominees: [
        {
          id: 'nominee-1',
          title: 'Digital Dreams',
          director: 'AI Collective',
          category: 'ai-short-film',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-2',
          title: 'Neural Canvas',
          director: 'Tech Visionaries',
          category: 'ai-short-film',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-3',
          title: 'Code & Soul',
          director: 'Digital Artists',
          category: 'ai-short-film',
          thumbnail: './public/images/placeholder.png',
          award: 'Best Film',
          year: 2025
        },
        {
          id: 'nominee-4',
          title: 'Synthetic Motion',
          director: 'Future Studios',
          category: 'ai-short-film',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        }
      ]
    },
    {
      id: 'ai-micro-drama',
      name: 'AI Micro Drama',
      description: 'Compelling micro-dramas powered by artificial intelligence',
      nominees: [
        {
          id: 'nominee-5',
          title: 'Echoes',
          director: 'Story AI',
          category: 'ai-micro-drama',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-6',
          title: 'The Last Frame',
          director: 'Narrative Lab',
          category: 'ai-micro-drama',
          thumbnail: './public/images/placeholder.png',
          award: 'Best Drama',
          year: 2025
        },
        {
          id: 'nominee-7',
          title: 'Moments',
          director: 'Emotion Studios',
          category: 'ai-micro-drama',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-8',
          title: 'Between Us',
          director: 'Creative AI',
          category: 'ai-micro-drama',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        }
      ]
    },
    {
      id: 'ai-music-video',
      name: 'AI Music Video',
      description: 'Visually stunning music videos created with AI',
      nominees: [
        {
          id: 'nominee-9',
          title: 'Neon Pulse',
          director: 'Visual Collective',
          category: 'ai-music-video',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-10',
          title: 'Synesthetic',
          director: 'Audio Visual',
          category: 'ai-music-video',
          thumbnail: './public/images/placeholder.png',
          award: 'Best Music Video',
          year: 2025
        },
        {
          id: 'nominee-11',
          title: 'Chromatic',
          director: 'Sound & Light',
          category: 'ai-music-video',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-12',
          title: 'Wavelength',
          director: 'Digital Harmony',
          category: 'ai-music-video',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        }
      ]
    },
    {
      id: 'ai-commercial',
      name: 'AI Commercial Film',
      description: 'Innovative commercial films with AI-generated elements',
      nominees: [
        {
          id: 'nominee-13',
          title: 'Tomorrow',
          director: 'Brand AI',
          category: 'ai-commercial',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-14',
          title: 'Connected',
          director: 'Marketing Lab',
          category: 'ai-commercial',
          thumbnail: './public/images/placeholder.png',
          award: 'Best Commercial',
          year: 2025
        },
        {
          id: 'nominee-15',
          title: 'Imagine',
          director: 'Commerce Creative',
          category: 'ai-commercial',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        },
        {
          id: 'nominee-16',
          title: 'Future Now',
          director: 'Tech Commerce',
          category: 'ai-commercial',
          thumbnail: './public/images/placeholder.png',
          award: null,
          year: 2025
        }
      ]
    }
  ],

  // Convenience method to get all nominees
  getAllNominees() {
    return this.categories.flatMap(cat => cat.nominees);
  },

  // Get nominees by category
  getNomineesByCategory(categoryId) {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.nominees : [];
  },

  // Get all winners (nominees with awards)
  getWinners() {
    return this.getAllNominees().filter(nominee => nominee.award);
  },

  // Get nominee by ID
  getNomineeById(id) {
    return this.getAllNominees().find(nominee => nominee.id === id);
  }
};

// Export for use in HTML files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FESTIVAL_DATA;
}


// ===== JURY DATA =====

const juryMembers = [
  {
    id: 1,
    name: "Raj & DK",
    title: "Award-Winning Filmmaker Duo",
    company: "D2R Films",
    image: "/images/jury/raj_dk.jpg",
    bio: "Raj Nidimoru & Krishna D.K. are an acclaimed Indian filmmaker duo known for their bold, genre-bending storytelling. As writers, directors, and producers, they have redefined Indian series and cinema with their sharp writing, dark humour, and distinctive visual style. Their work spans hit films and globally recognised web series, earning them a reputation for creating smart, edgy, and culturally resonant content."
  },
  {
    id: 2,
    name: "Bhushan Kumar",
    title: "Chairman & Managing Director",
    company: "T-Series",
    image: "/images/jury/bhushan_kumar.jpg",
    bio: "Bhushan Kumar is an Indian film producer and the Chairman and Managing Director of T-Series. Under his leadership, T-Series has grown into India's leading music and film production company and a global digital powerhouse. He has produced several successful Bollywood films and continues to play a key role in shaping contemporary Indian entertainment."
  },
  {
    id: 3,
    name: "Ajay Devgn",
    title: "Award-Winning Actor, Producer & Filmmaker",
    company: "Devgn Films",
    image: "/images/jury/ajay-devgn.jpg",
    bio: "Ajay Devgn is one of India's most respected film actors and producers, known for his intense screen presence and versatility. With a career spanning three decades, he has delivered iconic performances across action, drama, romance, and thrillers. A multiple National Film Award winner, Ajay Devgn is also a successful filmmaker and the founder of Ajay Devgn FFilms, continuing to influence Indian cinema both in front of and behind the camera."
  },
  {
    id: 4,
    name: "Madhur Bhandarkar",
    title: "National Award-Winning Filmmaker",
    company: "Bhandarkar Entertainment",
    image: "/images/jury/Madhur_Bhandarkar.jpg",
    bio: "Madhur Bhandarkar is an acclaimed Indian filmmaker known for his hard-hitting, realistic cinema. Through films like Chandni Bar, Page 3, Fashion and Heroine, he exposes the darker truths behind glamour, power, and ambition, earning multiple National Film Awards for his fearless storytelling."
  },
  {
    id: 5,
    name: "Kailash Surendranath",
    title: "Filmmaker, Director & Producer",
    company: "Kailash Picture Company",
    image: "/images/jury/kailash_s.jpg",
    bio: "Kailash Surendranath is an Indian filmmaker, advertising director and producer. He has directed over 6,000 television commercials over several decades and has also worked on numerous films promoting national integration."
  },
  {
    id: 6,
    name: "Ken Ghosh",
    title: "Film Director",
    company: "Shadow Films",
    image: "/images/jury/ken_ghosh.jpg",
    bio: "Ken Ghosh is an Indian film director known for his work across romantic comedies, thrillers, and youth-centric films. He made his directorial debut with the cult romantic comedy Ishq Vishk and went on to direct several popular Hindi films. Recognised for his contemporary storytelling and ability to connect with young audiences, Ken Ghosh continues to explore diverse genres in Indian cinema."
  },

  // COMMENTED OUT - FUTURE JURORS (To be activated when needed)
  /*
  {
    id: 7,
    name: "Priya Nair",
    title: "Motion Capture Specialist",
    company: "CinemaMotion Studios",
    image: "/images/jury/priya-nair.jpg",
    bio: "Priya Nair is a pioneering motion capture specialist who has revolutionized the field by integrating AI-driven motion prediction and enhancement systems. At CinemaMotion Studios, she develops algorithms that can intelligently fill motion gaps and enhance captured performances in real-time. Her work has been crucial in reducing production timelines while maintaining artistic quality. Priya holds patents in AI-assisted motion synthesis and actively mentors the next generation of motion capture artists."
  },
  {
    id: 8,
    name: "Elena Rossi",
    title: "Color Grading & VFX Supervisor",
    company: "CinemaLabs",
    image: "/images/jury/elena-rossi.jpg",
    bio: "Elena Rossi leads the color and visual effects department at CinemaLabs, pioneering the use of machine learning in post-production workflows. Her AI-assisted color grading tools have significantly accelerated the post-production process while maintaining artistic consistency. Elena's work spans from feature films to commercial projects, and she is renowned for her ability to integrate AI tools seamlessly into traditional VFX pipelines. She is a regular speaker at industry conferences on AI-driven post-production innovation."
  },
  {
    id: 9,
    name: "Noah Kim",
    title: "Cinematography Director",
    company: "FrameArt Productions",
    image: "/images/jury/noah-kim.jpg",
    bio: "Noah Kim is a visionary cinematographer who embraces AI as a creative partner rather than a replacement for traditional cinematography. At FrameArt Productions, he develops AI-assisted camera systems that optimize composition and lighting in real-time. His innovative approach has been featured in major film festivals and has set new standards for the integration of computational methods in cinematography. Noah believes that AI should enhance artistic decision-making and expand creative possibilities for filmmakers."
  },
  {
    id: 10,
    name: "Zahra El-Sayed",
    title: "Sound Design & AI Audio",
    company: "AudioVerse Technologies",
    image: "/images/jury/zahra-el-sayed.jpg",
    bio: "Zahra El-Sayed is a multifaceted sound designer and AI audio engineer who creates immersive sonic experiences for film and interactive media. Her work at AudioVerse Technologies focuses on generative audio systems that respond dynamically to visual content and narrative context. Zahra's innovative soundscapes have been featured in acclaimed independent films and major motion pictures. She is passionate about exploring new frontiers in audio storytelling through artificial intelligence."
  },
  {
    id: 11,
    name: "Diego Martinez",
    title: "Editing & Post-Production Director",
    company: "CutEdge Studio",
    image: "/images/jury/diego-martinez.jpg",
    bio: "Diego Martinez revolutionizes editorial workflows at CutEdge Studio by implementing AI-assisted editing systems that accelerate the creative process. His expertise in rhythm, pacing, and narrative structure, combined with machine learning algorithms, creates an optimal editing pipeline. Diego's approach to AI in post-production has set industry benchmarks and influenced how major studios approach digital editing. He advocates for ethical AI implementation in creative industries and regularly consults with emerging filmmakers on leveraging technology for storytelling."
  },
  {
    id: 12,
    name: "Lucas van Dijk",
    title: "Narrative AI Researcher",
    company: "StoryWeave Labs",
    image: "/images/jury/lucas-van-dijk.jpg",
    bio: "Lucas van Dijk is a pioneering researcher in narrative AI and computational storytelling at StoryWeave Labs. His work focuses on developing AI systems that can analyze, generate, and enhance narrative structures for film and interactive media. Lucas holds a PhD in narratology and is deeply committed to understanding how machine learning can serve as a tool for exploring new storytelling possibilities. His research bridges academia and industry, influencing how filmmakers approach the intersection of technology and narrative craft."
  }
  */
];

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { juryMembers };
}
