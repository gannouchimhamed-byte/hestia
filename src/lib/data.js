export const properties = [
  {
    id: 0, price: '850,000 TND', priceValue: 850000, priceLabel: '850K',
    title: 'Modern Villa with Sea View', location: 'Gammarth, Tunis', city: 'Tunis',
    type: 'sale', rooms: 4, beds: 4, baths: 3, area: 320,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85',
    ],
    description: 'Stunning modern villa in prestigious Gammarth with Mediterranean sea views. Open-plan living area, private infinity pool, landscaped garden, and smart home technology throughout.',
    amenities: ['Swimming Pool', 'Garden', 'Smart Home', 'Sea View', 'Garage', 'Security', 'Air Conditioning', 'Fully Furnished'],
    agent: { name: 'Karim Jaziri', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', phone: '+216 98 123 456', verified: true, rating: 4.9, reviewCount: 47, responseTime: '< 1 hour' },
    reviews: [
      { author: 'Nadia F.', initials: 'NF', rating: 5, date: 'Mar 2026', text: 'Karim was incredibly professional. Found us the perfect villa within 2 weeks.' },
      { author: 'Omar D.', initials: 'OD', rating: 5, date: 'Jan 2026', text: 'Great communication throughout. Made everything so easy.' },
    ],
    featured: true, condition: 'renovated', furnished: 'furnished', parking: true, elevator: false, terrace: true, floor: 'ground',
    floorPlan: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    priceHistory: [780000, 800000, 820000, 835000, 850000],
    neighborhood: [
      { type: 'school', name: 'Gammarth International School', dist: '0.4 km' },
      { type: 'hospital', name: 'Clinique Les Oliviers', dist: '1.2 km' },
      { type: 'transport', name: 'TGM Station Gammarth', dist: '0.6 km' },
      { type: 'shop', name: 'Carrefour Market', dist: '0.8 km' },
    ],
    listedAt: '2026-05-10', viewCount: 312, priceReduced: false,
    coords: [36.9173, 10.3157],
  },
  {
    id: 1, price: '1,200 TND/mo', priceValue: 1200, priceLabel: '1.2K/mo',
    title: 'Downtown Luxury Apartment', location: 'Avenue Habib Bourguiba, Tunis', city: 'Tunis',
    type: 'rent', rooms: 2, beds: 2, baths: 2, area: 120,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
    ],
    description: 'Elegant apartment in the heart of Tunis, steps from iconic Avenue Habib Bourguiba. Premium finishes, city views, fully furnished, walking distance to restaurants and cultural landmarks.',
    amenities: ['Elevator', 'Balcony', 'Modern Kitchen', 'Central Heating', 'Storage', 'Intercom', 'High-Speed WiFi'],
    agent: { name: 'Sana Mhenni', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', phone: '+216 92 456 789', verified: true, rating: 4.8, reviewCount: 31, responseTime: '< 2 hours' },
    reviews: [
      { author: 'Ahmed B.', initials: 'AB', rating: 5, date: 'Apr 2026', text: 'Perfect location and Sana was very helpful throughout the rental process.' },
    ],
    featured: false, condition: 'renovated', furnished: 'furnished', parking: false, elevator: true, terrace: true, floor: 'mid',
    floorPlan: null, videoUrl: null,
    priceHistory: [1050, 1100, 1150, 1200],
    neighborhood: [
      { type: 'transport', name: 'Metro Barcelone', dist: '0.1 km' },
      { type: 'shop', name: 'Monoprix Bourguiba', dist: '0.2 km' },
      { type: 'school', name: 'Lycée Pilote Bourguiba', dist: '0.9 km' },
      { type: 'hospital', name: 'Hôpital Charles Nicolle', dist: '1.5 km' },
    ],
    listedAt: '2026-05-11', viewCount: 87, priceReduced: false,
    coords: [36.8065, 10.1815],
  },
  {
    id: 2, price: '420,000 TND', priceValue: 420000, priceLabel: '420K',
    title: 'Family Villa with Pool', location: 'Hammamet Nord, Nabeul', city: 'Hammamet',
    type: 'sale', rooms: 5, beds: 5, baths: 3, area: 280,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85',
    ],
    description: 'Spacious family villa in Hammamet Nord, 5 minutes from the beach. Private pool, mature garden, large terraces, and a separate guest suite. Excellent investment with strong rental yields.',
    amenities: ['Swimming Pool', 'Garden', 'Sea View', 'Terrace', 'Guest Suite', 'Garage', 'BBQ Area'],
    agent: { name: 'Youssef Ben Amor', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', phone: '+216 97 789 012', verified: true, rating: 4.7, reviewCount: 28, responseTime: '< 3 hours' },
    reviews: [
      { author: 'Sophie M.', initials: 'SM', rating: 5, date: 'Feb 2026', text: 'Youssef helped us find our dream holiday home in just 3 viewings.' },
    ],
    featured: true, condition: 'good', furnished: 'semi', parking: true, elevator: false, terrace: true, floor: 'ground',
    floorPlan: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&q=80',
    videoUrl: null,
    priceHistory: [490000, 460000, 440000, 420000],
    neighborhood: [
      { type: 'shop', name: 'Hammamet Beach', dist: '0.4 km' },
      { type: 'transport', name: 'Bus Station', dist: '0.8 km' },
      { type: 'school', name: 'Collège Hammamet', dist: '1.1 km' },
      { type: 'hospital', name: 'Clinique Hammamet', dist: '2.0 km' },
    ],
    listedAt: '2026-04-28', viewCount: 143, priceReduced: true, originalPrice: 490000,
    coords: [36.4167, 10.6000],
  },
  {
    id: 3, price: '1,200,000 TND', priceValue: 1200000, priceLabel: '1.2M',
    title: 'Penthouse with Rooftop Pool', location: 'Les Berges du Lac, Tunis', city: 'Tunis',
    type: 'sale', rooms: 5, beds: 5, baths: 4, area: 450,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
    ],
    description: 'Ultra-luxury penthouse in Les Berges du Lac featuring a private rooftop pool, 360° city views, home cinema, and staff quarters. The epitome of upscale urban living in Tunis.',
    amenities: ['Rooftop Pool', 'Home Cinema', '360° View', 'Staff Quarters', 'Smart Home', 'Private Elevator', 'Wine Cellar', 'Gym'],
    agent: { name: 'Ahmed Ben Ali', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', phone: '+216 99 333 444', verified: true, rating: 5.0, reviewCount: 63, responseTime: '< 30 min' },
    reviews: [
      { author: 'Nour B.', initials: 'NB', rating: 5, date: 'May 2026', text: 'Ahmed is the best agent in Tunis. Negotiated a great price and handled everything perfectly.' },
    ],
    featured: true, condition: 'new', furnished: 'furnished', parking: true, elevator: true, terrace: true, floor: 'top',
    floorPlan: null, videoUrl: null,
    priceHistory: [1050000, 1100000, 1150000, 1200000],
    neighborhood: [
      { type: 'shop', name: 'Mall du Lac', dist: '0.3 km' },
      { type: 'school', name: 'International School of Tunis', dist: '1.1 km' },
      { type: 'hospital', name: 'Clinique Taoufik', dist: '1.8 km' },
      { type: 'transport', name: 'Bus Lac 2', dist: '0.4 km' },
    ],
    listedAt: '2026-05-09', viewCount: 524, priceReduced: false,
    coords: [36.8315, 10.2284],
  },
  {
    id: 4, price: '650 TND/mo', priceValue: 650, priceLabel: '650/mo',
    title: 'Cozy Studio Near the Beach', location: 'Hammamet Nord', city: 'Hammamet',
    type: 'rent', rooms: 1, beds: 1, baths: 1, area: 55,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
    ],
    description: 'Adorable studio apartment steps from Hammamet Nord beach. Ideal for singles or couples. Fully furnished with beach access, shared pool, and 24/7 security.',
    amenities: ['Beach Access', 'Shared Pool', 'Furnished', 'Security', 'WiFi', 'Air Conditioning'],
    agent: { name: 'Leila Bouzid', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', phone: '+216 95 777 888', verified: false, rating: 4.0, reviewCount: 9, responseTime: '< 3 hours' },
    reviews: [
      { author: 'Rania H.', initials: 'RH', rating: 4, date: 'Apr 2026', text: 'Nice studio, Leila was helpful and quick to respond.' },
    ],
    featured: false, condition: 'good', furnished: 'furnished', parking: false, elevator: false, terrace: false, floor: 'low',
    floorPlan: null, videoUrl: null,
    priceHistory: [580, 600, 630, 650],
    neighborhood: [
      { type: 'shop', name: 'Supermarché Hammamet', dist: '0.3 km' },
      { type: 'transport', name: 'Taxi Station', dist: '0.4 km' },
      { type: 'hospital', name: 'Clinique Hammamet', dist: '2.0 km' },
      { type: 'school', name: 'École Privée El Amal', dist: '1.2 km' },
    ],
    listedAt: '2026-03-21', viewCount: 38, priceReduced: false,
    coords: [36.4200, 10.6050],
  },
  {
    id: 5, price: '2,400,000 TND', priceValue: 2400000, priceLabel: '2.4M',
    title: 'Commercial Building — Sfax Centre', location: 'Centre Ville, Sfax', city: 'Sfax',
    type: 'sale', rooms: 0, beds: 0, baths: 8, area: 1200,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85',
    ],
    description: 'Prime commercial building in Sfax\'s business district. 8 floors of premium office space generating 18,000 TND/month. 40 underground parking spaces, modern infrastructure.',
    amenities: ['8 Floors', '40 Parking', 'Central HVAC', 'Security', 'Generator', 'Fiber Internet', 'Elevators'],
    agent: { name: 'Bilel Chaabane', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', phone: '+216 74 456 789', verified: true, rating: 4.8, reviewCount: 22, responseTime: '< 2 hours' },
    reviews: [
      { author: 'Tarek M.', initials: 'TM', rating: 5, date: 'Jan 2026', text: 'Excellent investment. Bilel provided detailed financials and made the process smooth.' },
    ],
    featured: false, condition: 'good', furnished: 'unfurnished', parking: true, elevator: true, terrace: false, floor: 'ground',
    floorPlan: null, videoUrl: null,
    priceHistory: [2800000, 2600000, 2500000, 2400000],
    neighborhood: [
      { type: 'transport', name: 'Gare de Sfax', dist: '0.5 km' },
      { type: 'shop', name: 'Sfax City Center', dist: '0.2 km' },
      { type: 'hospital', name: 'CHU Hédi Chaker', dist: '2.0 km' },
      { type: 'school', name: 'ISGI Sfax', dist: '1.5 km' },
    ],
    listedAt: '2026-05-05', viewCount: 91, priceReduced: true, originalPrice: 2800000,
    coords: [34.7400, 10.7600],
  },
]

export const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Hammamet', 'Monastir', 'Nabeul', 'Bizerte', 'Ariana', 'Ben Arous', 'La Marsa', 'Sidi Bou Said', 'Gammarth', 'Lac 2', 'Les Berges du Lac', 'Menzah', 'Ennasr', 'El Aouina', 'Carthage', 'Belvédère', 'Bardo']

export function getDaysOld(listedAt) {
  if (!listedAt) return 0
  return Math.floor((Date.now() - new Date(listedAt).getTime()) / 86400000)
}

export function getFreshnessTier(p) {
  const days = getDaysOld(p.listedAt)
  if (p.priceReduced) return 'reduced'
  if (days <= 3) return 'new'
  if ((p.viewCount || 0) >= 200) return 'hot'
  if (days >= 45) return 'stale'
  return 'fresh'
}

export function formatPrice(p) {
  return p.type === 'rent' ? `${p.priceValue.toLocaleString()} TND/mo` : `${p.priceValue.toLocaleString()} TND`
}
