import { Router } from 'express'

const router = Router()

const classesData = [
  {
    id: 1, name: 'HIIT Blast',     category: 'Cardio',
    time: '6:00 AM', duration: '45 min', intensity: 'High',
    instructor: 'Dev Malhotra', instructorCert: 'CrossFit L3',
    spots: 4, maxSpots: 16, days: ['Mon', 'Wed', 'Fri'],
    emoji: '⚡', description: 'High-intensity interval training designed to torch calories and build explosive power.',
    requirements: 'Intermediate fitness level',
  },
  {
    id: 2, name: 'Power Yoga',     category: 'Mind & Body',
    time: '7:00 AM', duration: '60 min', intensity: 'Medium',
    instructor: 'Priya Sharma', instructorCert: 'RYT-500',
    spots: 8, maxSpots: 20, days: ['Tue', 'Thu', 'Sat'],
    emoji: '🧘', description: 'Dynamic yoga combining strength, flexibility, and mindful breathing.',
    requirements: 'All levels welcome',
  },
  {
    id: 3, name: 'Strength Forge', category: 'Strength',
    time: '8:00 AM', duration: '50 min', intensity: 'High',
    instructor: 'Aryan Kapoor', instructorCert: 'NSCA-CSCS',
    spots: 6, maxSpots: 12, days: ['Mon', 'Wed', 'Fri', 'Sat'],
    emoji: '💪', description: 'Barbell and compound movements focused on building raw strength and muscle.',
    requirements: 'Basic gym experience required',
  },
  {
    id: 4, name: 'Zumba Energy',   category: 'Dance',
    time: '9:00 AM', duration: '55 min', intensity: 'Medium',
    instructor: 'Priya Sharma', instructorCert: 'Zumba Certified',
    spots: 12, maxSpots: 25, days: ['Tue', 'Thu', 'Sun'],
    emoji: '💃', description: 'Latin-inspired dance fitness that feels like a party, not a workout.',
    requirements: 'All levels welcome',
  },
  {
    id: 5, name: 'CrossFit Open',  category: 'CrossFit',
    time: '6:30 PM', duration: '60 min', intensity: 'Elite',
    instructor: 'Dev Malhotra', instructorCert: 'CrossFit L3',
    spots: 2, maxSpots: 14, days: ['Mon', 'Tue', 'Thu', 'Fri'],
    emoji: '🏋️', description: 'Competition-standard WODs with full Olympic lifting and gymnastics.',
    requirements: 'Advanced level only',
  },
  {
    id: 6, name: 'Boxing Basics',  category: 'Combat',
    time: '7:30 PM', duration: '45 min', intensity: 'High',
    instructor: 'Aryan Kapoor', instructorCert: 'NSCA-CSCS',
    spots: 9, maxSpots: 18, days: ['Mon', 'Wed', 'Fri'],
    emoji: '🥊', description: 'Technical boxing skills combined with conditioning — no ring required.',
    requirements: 'All levels welcome',
  },
  {
    id: 7, name: 'Pilates Core',   category: 'Mind & Body',
    time: '5:30 PM', duration: '45 min', intensity: 'Low',
    instructor: 'Priya Sharma', instructorCert: 'BASI Pilates',
    spots: 10, maxSpots: 15, days: ['Mon', 'Wed', 'Fri'],
    emoji: '🌿', description: 'Targeted core work using Pilates principles for posture, stability, and strength.',
    requirements: 'All levels welcome',
  },
  {
    id: 8, name: 'Functional Fit', category: 'Functional',
    time: '6:00 PM', duration: '50 min', intensity: 'Medium',
    instructor: 'Aryan Kapoor', instructorCert: 'NSCA-CSCS',
    spots: 7, maxSpots: 20, days: ['Tue', 'Thu', 'Sat'],
    emoji: '🔥', description: 'Movement patterns that translate directly to everyday life and sport performance.',
    requirements: 'Beginner friendly',
  },
]

// GET /api/classes
router.get('/', (req, res) => {
  const { category, intensity, instructor, day } = req.query

  let result = classesData

  if (category)   result = result.filter(c => c.category.toLowerCase() === category.toLowerCase())
  if (intensity)  result = result.filter(c => c.intensity.toLowerCase() === intensity.toLowerCase())
  if (instructor) result = result.filter(c => c.instructor.toLowerCase().includes(instructor.toLowerCase()))
  if (day)        result = result.filter(c => c.days.includes(day))

  res.json({ success: true, data: result, total: result.length })
})

// GET /api/classes/:id
router.get('/:id', (req, res) => {
  const cls = classesData.find(c => c.id === parseInt(req.params.id))
  if (!cls) return res.status(404).json({ success: false, message: 'Class not found' })
  res.json({ success: true, data: cls })
})

// GET /api/classes/categories
router.get('/meta/categories', (req, res) => {
  const categories = [...new Set(classesData.map(c => c.category))]
  const intensities = [...new Set(classesData.map(c => c.intensity))]
  res.json({ success: true, categories, intensities })
})

export default router
