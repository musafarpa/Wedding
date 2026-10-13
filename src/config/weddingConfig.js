// Central Wedding Configuration for Ananya & Rohan
// Easily edit couple details, dates, venue, events, and story here.

export const WEDDING_CONFIG = {
  couple: {
    bride: {
      name: "Ananya",
      fullName: "Ananya Menon",
      parents: "Daughter of Smt. Radhika & Sri. Suresh Menon",
      tagline: "The Radiance of Kasavu & Jasmine",
    },
    groom: {
      name: "Rohan",
      fullName: "Rohan Varma",
      parents: "Son of Smt. Malini & Sri. Govind Varma",
      tagline: "The Grace of Tradition & Warmth",
    },
    monogram: "A & R",
    title: "The Romantic 3D Wedding Journey",
    subtitle: "A Fairytale in God's Own Country",
    hashtag: "#AnanyaWedsRohan",
  },

  // Main Wedding Ceremony Muhurtham Date (ISO string for countdown)
  weddingDate: "2026-12-12T09:30:00+05:30",
  formattedDate: "Saturday, 12th December 2026",
  muhurthamTime: "09:30 AM – 10:45 AM IST",

  // Frame Sequence Details
  frames: {
    totalFrames: 192,
    basePath: "/frames/ezgif-frame-",
    fileExtension: ".jpg",
    getFrameUrl: (index) => {
      const padded = String(Math.max(1, Math.min(192, index))).padStart(3, "0");
      return `/frames/ezgif-frame-${padded}.jpg`;
    },
    narrativePhases: [
      {
        startFrame: 1,
        endFrame: 65,
        title: "The Serene Backwater Dawn",
        subtitle: "Ivory silk, water lilies, and the gentle breeze of God's Own Country.",
      },
      {
        startFrame: 66,
        endFrame: 135,
        title: "The Jasmine Blossom Offering",
        subtitle: "A tender smile, a fragrant bloom—the promise of eternal devotion.",
      },
      {
        startFrame: 136,
        endFrame: 192,
        title: "Two Souls, One Destiny",
        subtitle: "A whisper of forever in each other's warm embrace.",
      },
    ],
  },

  // Love Story Milestones
  story: [
    {
      chapter: "Chapter I",
      title: "First Glimpse by the Lake",
      date: "Spring 2023",
      text: "Under the golden glow of a Kerala sunset, two wandering souls met by the tranquil backwaters. What began as a gentle glance blossomed into an unspoken connection written in the stars.",
      frameAccent: "/frames/ezgif-frame-001.jpg",
    },
    {
      chapter: "Chapter II",
      title: "The Jasmine Promise",
      date: "Monsoon 2024",
      text: "With a fragrant white blossom and hearts beating in sync, a heartfelt promise was exchanged. In the courtyard of ancient heritage, they vowed to walk through all seasons hand-in-hand.",
      frameAccent: "/frames/ezgif-frame-090.jpg",
    },
    {
      chapter: "Chapter III",
      title: "Toward Sacred Forever",
      date: "December 2026",
      text: "Dressed in handwoven Kerala kasavu and golden ornaments, they prepare to step into the sacred circle around the nilavilakku, sealing two lifetimes into one eternal bond.",
      frameAccent: "/frames/ezgif-frame-180.jpg",
    },
  ],

  // Wedding Events Schedule
  events: [
    {
      id: "haldi-mehendi",
      title: "Haldi & Mehendi Fiesta",
      subtitle: "The Auspicious Turmeric & Henna Melodies",
      date: "Friday, 11th December 2026",
      time: "03:30 PM Onwards",
      venue: "The Mango Grove Courtyard, Kumarakom Lake Resort",
      dressCode: "Sunset Yellows & Vibrant Greens",
      description: "An afternoon filled with fragrant marigold flowers, auspicious haldi blessings, soulful folk music, and intricate henna designs.",
      icon: "Sparkles",
    },
    {
      id: "muhurtham",
      title: "The Sacred Muhurtham",
      subtitle: "Traditional Kerala Vedic Ceremony",
      date: "Saturday, 12th December 2026",
      time: "09:30 AM – 11:00 AM IST",
      venue: "The Grand Heritage Mandap, Kumarakom Lake Resort",
      dressCode: "Traditional Kerala Kasavu & Ivory Silks",
      description: "The divine solemnization amidst traditional nadaswaram chants, sacred nilavilakku lamps, exchanging floral garlands, and the holy saptapadi.",
      icon: "Heart",
      isPrimary: true,
    },
    {
      id: "sadhya",
      title: "The Royal Kerala Sadhya",
      subtitle: "Traditional Feast Served on Banana Leaf",
      date: "Saturday, 12th December 2026",
      time: "12:00 PM – 02:30 PM IST",
      venue: "Oottupura Dining Pavilion",
      dressCode: "Traditional Festive Attire",
      description: "An authentic 28-dish grand vegetarian banquet celebrating the rich culinary heritage of Kerala, concluding with golden ada pradhaman.",
      icon: "Utensils",
    },
    {
      id: "reception",
      title: "The Grand Twilight Reception",
      subtitle: "Cocktails, Dinner & Backwater Starlight",
      date: "Saturday, 12th December 2026",
      time: "07:00 PM Onwards",
      venue: "The Waterfront Palms Lawn & Amphitheatre",
      dressCode: "Formal Indian Glamour / Champagne Gold",
      description: "An enchanting evening of toasts, live acoustic fusion, gourmet dinner, and stargazing under illuminated coconut palms.",
      icon: "GlassWater",
    },
  ],

  // Venue Information
  venue: {
    name: "Kumarakom Lake Resort",
    subtitle: "Heritage Waterfront Sanctuary",
    address: "North Post, Kumarakom, Kottayam, Kerala 686563, India",
    city: "Kumarakom, Kerala",
    mapUrl: "https://maps.google.com/?q=Kumarakom+Lake+Resort+Kerala",
    coordinates: { lat: 9.6175, lng: 76.4312 },
    travelInfo: [
      { mode: "By Air", detail: "Cochin International Airport (COK) — ~72 km (approx 1 hr 45 min drive)" },
      { mode: "By Rail", detail: "Kottayam Railway Station (KTYM) — ~14 km (approx 25 min drive)" },
      { mode: "By Water", detail: "Special backwater private shikara transfers available from Muhamma jetty" },
    ],
  },

  // Contact & Support
  contacts: {
    hospitality: "+91 98470 12345 (Rahul Menon)",
    guestRelations: "+91 94471 67890 (Meera Varma)",
    email: "celebrate@ananyarohan.wedding",
  },
};
