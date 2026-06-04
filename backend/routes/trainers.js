import { Router } from 'express'

const router = Router()

const trainersData = [
  {
    id: 1,
    name: 'Aryan Kapoor',
    role: 'Strength & Conditioning Coach',
    cert: 'NSCA-CSCS',
    exp: '8 years',
    specialties: ['Powerlifting', 'Olympic Weightlifting', 'Body Composition', 'Athletic Performance'],
    bio: 'Aryan has helped 500+ athletes and everyday fitness enthusiasts build functional strength. Former national-level powerlifter turned coach, he blends biomechanics science with practical programming.',
    achievements: ['National Powerlifting Bronze 2018', 'NSCA Certified Strength & Conditioning Specialist', '500+ client transformations'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    rating: 4.9,
    reviews: 148,
    img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80',
    instagram: '@aryankapoor_trains',
    email: 'aryan@Sam Fitness.in',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Yoga & Mobility Specialist',
    cert: 'RYT-500',
    exp: '10 years',
    specialties: ['Hatha Yoga', 'Yin & Restorative', 'Injury Rehab', 'Pre/Postnatal Yoga'],
    bio: 'Priya studied yoga in Rishikesh and blends traditional Hatha techniques with modern movement science. Her approach focuses on long-term joint health, stress management, and mindful performance.',
    achievements: ['RYT-500 Yoga Alliance Certified', 'BASI Pilates Certified', '10+ years teaching internationally'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat', 'Sun'],
    rating: 5.0,
    reviews: 203,
    img: 'https://images.unsplash.com/photo-1609899537878-48e5c1f47b5c?w=400&q=80',
    instagram: '@priyayogamove',
    email: 'priya@Sam Fitness.in',
  },
  {
    id: 3,
    name: 'Dev Malhotra',
    role: 'CrossFit & HIIT Coach',
    cert: 'CrossFit Level 3',
    exp: '7 years',
    specialties: ['CrossFit WODs', 'HIIT', 'Gymnastics', 'Competition Prep'],
    bio: 'Dev is a CrossFit Level 3 Trainer and former Games competitor. He runs Sam Fitness\'s flagship CrossFit programming and has coached athletes to regional and national podium finishes.',
    achievements: ['CrossFit Level 3 Certified Trainer', 'CrossFit South Asia Regional Competitor', '7 athletes coached to Nationals'],
    availability: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    rating: 4.8,
    reviews: 165,
    img: 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400&q=80',
    instagram: '@dev.crossfit',
    email: 'dev@Sam Fitness.in',
  },
  {
    id: 4,
    name: 'Riya Mehta',
    role: 'Nutrition Coach & Dietitian',
    cert: 'RD, CSSD',
    exp: '6 years',
    specialties: ['Sports Nutrition', 'Weight Management', 'Medical Nutrition Therapy', 'Supplement Guidance'],
    bio: 'Riya is a Registered Dietitian specializing in sports performance nutrition. She combines evidence-based nutritional science with practical, real-world meal planning for sustainable results.',
    achievements: ['MSc Clinical Nutrition, AIIMS', 'Board Certified Sports Dietitian (CSSD)', '300+ nutrition plans designed'],
    availability: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    rating: 4.9,
    reviews: 127,
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    instagram: '@riya.nutrition',
    email: 'riya@Sam Fitness.in',
  },
]

// GET /api/trainers
router.get('/', (req, res) => {
  const { specialty, available } = req.query
  let result = trainersData

  if (specialty) {
    result = result.filter(t =>
      t.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    )
  }
  if (available) {
    result = result.filter(t => t.availability.includes(available))
  }

  res.json({ success: true, data: result, total: result.length })
})

// GET /api/trainers/:id
router.get('/:id', (req, res) => {
  const trainer = trainersData.find(t => t.id === parseInt(req.params.id))
  if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' })
  res.json({ success: true, data: trainer })
})

export default router
