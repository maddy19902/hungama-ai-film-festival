/**
 * HUNGAMA FESTIVAL - SHARED DATA STRUCTURE
 * Single source of truth for nominees/winners data
 * Used by: nominees.html, winners.html
 */

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
