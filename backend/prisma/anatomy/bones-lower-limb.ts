// LOWER LIMB BONES (62 bones: 31 per leg)
// Hip bone, Femur, Patella, Tibia, Fibula, 7 Tarsals, 5 Metatarsals, 14 Phalanges

export const LOWER_LIMB_BONES = [
  // ==================== PELVIC GIRDLE (2) ====================
  {
    name: 'Hip Bone (Left Os Coxa)',
    type: 'bone',
    category: 'skeletal',
    description: 'Large irregular bone formed by fusion of ilium, ischium, and pubis. Forms the lateral and anterior walls of the pelvis.',
    function: 'Bears body weight, forms hip joint (acetabulum), provides attachment for trunk and leg muscles.',
    importance: 'Foundation for posture and locomotion. Pelvic fractures are serious injuries.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 0.78, z: 0 },
    exercises: [
      { name: 'Hip Thrust', rank: 1, description: 'Strengthens glutes supporting the pelvis.' },
    ]
  },
  {
    name: 'Hip Bone (Right Os Coxa)',
    type: 'bone',
    category: 'skeletal',
    description: 'Large irregular bone formed by fusion of ilium, ischium, and pubis. Forms the lateral and anterior walls of the pelvis.',
    function: 'Bears body weight, forms hip joint (acetabulum), provides attachment for trunk and leg muscles.',
    importance: 'Foundation for posture and locomotion. Pelvic fractures are serious injuries.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.78, z: 0 },
    exercises: [
      { name: 'Hip Thrust', rank: 1, description: 'Strengthens glutes supporting the pelvis.' },
    ]
  },

  // ==================== THIGH BONES (4) ====================
  {
    name: 'Femur (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'The longest and strongest bone in the body. Contains head, neck, greater/lesser trochanters, shaft, and condyles.',
    function: 'Bears body weight, forms hip and knee joints, provides extensive muscle attachment.',
    importance: 'Critical for walking and running. Femoral neck fractures are serious, especially in elderly.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 0.5, z: 0 },
    exercises: []
  },
  {
    name: 'Femur (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'The longest and strongest bone in the body. Contains head, neck, greater/lesser trochanters, shaft, and condyles.',
    function: 'Bears body weight, forms hip and knee joints, provides extensive muscle attachment.',
    importance: 'Critical for walking and running. Femoral neck fractures are serious, especially in elderly.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.5, z: 0 },
    exercises: []
  },
  {
    name: 'Patella (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest sesamoid bone, triangular and embedded in the quadriceps tendon at the front of the knee.',
    function: 'Protects knee joint, increases mechanical advantage of quadriceps by 30-50%.',
    importance: 'Essential for efficient knee extension. Patellar tracking problems cause significant pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 0.4, z: 0.04 },
    exercises: []
  },
  {
    name: 'Patella (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest sesamoid bone, triangular and embedded in the quadriceps tendon at the front of the knee.',
    function: 'Protects knee joint, increases mechanical advantage of quadriceps by 30-50%.',
    importance: 'Essential for efficient knee extension. Patellar tracking problems cause significant pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.4, z: 0.04 },
    exercises: []
  },

  // ==================== LEG BONES (4) ====================
  {
    name: 'Tibia (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'The larger medial bone of the lower leg (shinbone). Bears most of the body weight.',
    function: 'Primary weight-bearing bone of the leg, forms knee and ankle joints.',
    importance: 'Critical for walking. Stress fractures common in runners. Tibial plateau fractures are serious.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 0.25, z: 0.02 },
    exercises: []
  },
  {
    name: 'Tibia (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'The larger medial bone of the lower leg (shinbone). Bears most of the body weight.',
    function: 'Primary weight-bearing bone of the leg, forms knee and ankle joints.',
    importance: 'Critical for walking. Stress fractures common in runners. Tibial plateau fractures are serious.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.25, z: 0.02 },
    exercises: []
  },
  {
    name: 'Fibula (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'The smaller lateral bone of the lower leg. Does not bear significant weight.',
    function: 'Provides muscle attachment, forms lateral ankle (lateral malleolus), critical for ankle stability.',
    importance: 'Essential for ankle stability. Commonly fractured with ankle sprains.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.12, y: 0.25, z: 0 },
    exercises: []
  },
  {
    name: 'Fibula (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'The smaller lateral bone of the lower leg. Does not bear significant weight.',
    function: 'Provides muscle attachment, forms lateral ankle (lateral malleolus), critical for ankle stability.',
    importance: 'Essential for ankle stability. Commonly fractured with ankle sprains.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.25, z: 0 },
    exercises: []
  },

  // ==================== TARSAL BONES - LEFT (7) ====================
  {
    name: 'Calcaneus (Left Heel Bone)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest tarsal bone forming the heel. Receives Achilles tendon attachment.',
    function: 'Forms heel for weight-bearing and push-off, lever arm for calf muscles via Achilles.',
    importance: 'Critical for walking and running. Calcaneal fractures often from falls.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 0.05, z: -0.04 },
    exercises: []
  },
  {
    name: 'Talus (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Second largest tarsal, sits atop the calcaneus. No muscle attachments. Forms the ankle mortise.',
    function: 'Transmits body weight to foot, forms ankle joint with tibia and fibula.',
    importance: 'Critical for ankle motion. Talar fractures have high risk of avascular necrosis.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 0.08, z: 0 },
    exercises: []
  },
  {
    name: 'Navicular (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Boat-shaped bone on the medial side of the foot between the talus and cuneiforms.',
    function: 'Key to the medial longitudinal arch, articulates with talus and cuneiforms.',
    importance: 'Navicular stress fractures common in athletes. Critical for arch support.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.06, y: 0.08, z: 0.03 },
    exercises: []
  },
  {
    name: 'Cuboid (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Cube-shaped bone on the lateral side of the foot, articulating with calcaneus and metatarsals 4-5.',
    function: 'Keystone of lateral longitudinal arch, allows peroneus longus tendon passage.',
    importance: 'Critical for lateral foot stability. Cuboid syndrome causes lateral foot pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.11, y: 0.08, z: 0.02 },
    exercises: []
  },
  {
    name: 'Medial Cuneiform (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest cuneiform, wedge-shaped on the medial foot. Articulates with navicular and first metatarsal.',
    function: 'Supports medial arch, provides stable base for first metatarsal.',
    importance: 'Key to first ray stability and arch support.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.05, y: 0.06, z: 0.04 },
    exercises: []
  },
  {
    name: 'Intermediate Cuneiform (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Smallest cuneiform, wedge-shaped in the center. Articulates with second metatarsal.',
    function: 'Supports the stable second ray, contributes to transverse arch.',
    importance: 'Creates the keystone of the midfoot for stability.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.07, y: 0.06, z: 0.04 },
    exercises: []
  },
  {
    name: 'Lateral Cuneiform (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle-sized cuneiform on the lateral aspect of the cuneiform row. Articulates with third metatarsal.',
    function: 'Supports third ray, bridges medial and lateral foot columns.',
    importance: 'Transitional bone between medial and lateral columns.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.09, y: 0.06, z: 0.04 },
    exercises: []
  },

  // ==================== TARSAL BONES - RIGHT (7) ====================
  {
    name: 'Calcaneus (Right Heel Bone)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest tarsal bone forming the heel. Receives Achilles tendon attachment.',
    function: 'Forms heel for weight-bearing and push-off, lever arm for calf muscles via Achilles.',
    importance: 'Critical for walking and running. Calcaneal fractures often from falls.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.05, z: -0.04 },
    exercises: []
  },
  {
    name: 'Talus (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Second largest tarsal, sits atop the calcaneus. No muscle attachments. Forms the ankle mortise.',
    function: 'Transmits body weight to foot, forms ankle joint with tibia and fibula.',
    importance: 'Critical for ankle motion. Talar fractures have high risk of avascular necrosis.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.08, z: 0 },
    exercises: []
  },
  {
    name: 'Navicular (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Boat-shaped bone on the medial side of the foot between the talus and cuneiforms.',
    function: 'Key to the medial longitudinal arch, articulates with talus and cuneiforms.',
    importance: 'Navicular stress fractures common in athletes. Critical for arch support.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.08, z: 0.03 },
    exercises: []
  },
  {
    name: 'Cuboid (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Cube-shaped bone on the lateral side of the foot, articulating with calcaneus and metatarsals 4-5.',
    function: 'Keystone of lateral longitudinal arch, allows peroneus longus tendon passage.',
    importance: 'Critical for lateral foot stability. Cuboid syndrome causes lateral foot pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.11, y: 0.08, z: 0.02 },
    exercises: []
  },
  {
    name: 'Medial Cuneiform (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest cuneiform, wedge-shaped on the medial foot. Articulates with navicular and first metatarsal.',
    function: 'Supports medial arch, provides stable base for first metatarsal.',
    importance: 'Key to first ray stability and arch support.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 0.06, z: 0.04 },
    exercises: []
  },
  {
    name: 'Intermediate Cuneiform (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Smallest cuneiform, wedge-shaped in the center. Articulates with second metatarsal.',
    function: 'Supports the stable second ray, contributes to transverse arch.',
    importance: 'Creates the keystone of the midfoot for stability.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.07, y: 0.06, z: 0.04 },
    exercises: []
  },
  {
    name: 'Lateral Cuneiform (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle-sized cuneiform on the lateral aspect of the cuneiform row. Articulates with third metatarsal.',
    function: 'Supports third ray, bridges medial and lateral foot columns.',
    importance: 'Transitional bone between medial and lateral columns.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.09, y: 0.06, z: 0.04 },
    exercises: []
  },

  // ==================== METATARSALS - LEFT (5) ====================
  {
    name: 'First Metatarsal (Left Big Toe)',
    type: 'bone',
    category: 'skeletal',
    description: 'Shortest but thickest metatarsal, forming the great toe ray. Bears significant weight during push-off.',
    function: 'Primary weight-bearing during toe-off, essential for propulsion.',
    importance: 'Critical for walking and running. Bunions affect the first metatarsal head.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.04, y: 0.04, z: 0.06 },
    exercises: []
  },
  {
    name: 'Second Metatarsal (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Longest metatarsal, recessed into the cuneiform mortise making it the most stable.',
    function: 'Keystone of the transverse arch, most stable metatarsal.',
    importance: 'Stress fractures common due to its length and rigidity (march fracture).',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.06, y: 0.04, z: 0.06 },
    exercises: []
  },
  {
    name: 'Third Metatarsal (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Third metatarsal, intermediate in length and stability.',
    function: 'Weight-bearing, contributes to forefoot stability.',
    importance: 'Part of the central forefoot column.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 0.04, z: 0.06 },
    exercises: []
  },
  {
    name: 'Fourth Metatarsal (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Fourth metatarsal, part of the mobile lateral column.',
    function: 'Weight-bearing, allows some forefoot flexibility.',
    importance: 'Part of the mobile lateral column.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 0.04, z: 0.05 },
    exercises: []
  },
  {
    name: 'Fifth Metatarsal (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Most lateral metatarsal with a prominent styloid process (base). Attachment for peroneus brevis.',
    function: 'Lateral foot weight-bearing, muscle attachment for eversion.',
    importance: 'Jones fracture (base) and dancer\'s fracture (styloid) are common injuries.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.12, y: 0.04, z: 0.04 },
    exercises: []
  },

  // ==================== METATARSALS - RIGHT (5) ====================
  {
    name: 'First Metatarsal (Right Big Toe)',
    type: 'bone',
    category: 'skeletal',
    description: 'Shortest but thickest metatarsal, forming the great toe ray. Bears significant weight during push-off.',
    function: 'Primary weight-bearing during toe-off, essential for propulsion.',
    importance: 'Critical for walking and running. Bunions affect the first metatarsal head.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 0.04, z: 0.06 },
    exercises: []
  },
  {
    name: 'Second Metatarsal (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Longest metatarsal, recessed into the cuneiform mortise making it the most stable.',
    function: 'Keystone of the transverse arch, most stable metatarsal.',
    importance: 'Stress fractures common due to its length and rigidity (march fracture).',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.04, z: 0.06 },
    exercises: []
  },
  {
    name: 'Third Metatarsal (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Third metatarsal, intermediate in length and stability.',
    function: 'Weight-bearing, contributes to forefoot stability.',
    importance: 'Part of the central forefoot column.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.04, z: 0.06 },
    exercises: []
  },
  {
    name: 'Fourth Metatarsal (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Fourth metatarsal, part of the mobile lateral column.',
    function: 'Weight-bearing, allows some forefoot flexibility.',
    importance: 'Part of the mobile lateral column.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.04, z: 0.05 },
    exercises: []
  },
  {
    name: 'Fifth Metatarsal (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Most lateral metatarsal with a prominent styloid process (base). Attachment for peroneus brevis.',
    function: 'Lateral foot weight-bearing, muscle attachment for eversion.',
    importance: 'Jones fracture (base) and dancer\'s fracture (styloid) are common injuries.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.04, z: 0.04 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT GREAT TOE (2) ====================
  {
    name: 'Proximal Phalanx - Left Great Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the great toe, largest toe phalanx.',
    function: 'Flexion and extension for push-off during gait.',
    importance: 'Critical for walking mechanics and balance.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.03, y: 0.02, z: 0.08 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left Great Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the great toe.',
    function: 'Ground contact and push-off, nail bed support.',
    importance: 'Final point of ground contact during gait.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.02, y: 0.01, z: 0.1 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT 2ND TOE (3) ====================
  {
    name: 'Proximal Phalanx - Left 2nd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the second toe.',
    function: 'Toe flexion and extension during gait.',
    importance: 'Part of forefoot stability.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.05, y: 0.02, z: 0.08 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left 2nd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the second toe.',
    function: 'Contributes to toe grip during gait.',
    importance: 'Hammer toe commonly affects this joint.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.05, y: 0.01, z: 0.09 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left 2nd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the second toe.',
    function: 'Ground contact during toe-off.',
    importance: 'Part of toe gripping function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.05, y: 0.005, z: 0.1 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT 3RD TOE (3) ====================
  {
    name: 'Proximal Phalanx - Left 3rd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the third toe.',
    function: 'Toe flexion for gait.',
    importance: 'Central toe function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.07, y: 0.02, z: 0.08 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left 3rd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the third toe.',
    function: 'Toe grip contribution.',
    importance: 'Part of forefoot function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.07, y: 0.01, z: 0.09 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left 3rd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the third toe.',
    function: 'Ground contact.',
    importance: 'Toe grip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.07, y: 0.005, z: 0.1 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT 4TH TOE (3) ====================
  {
    name: 'Proximal Phalanx - Left 4th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the fourth toe.',
    function: 'Toe flexion.',
    importance: 'Part of lateral forefoot.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.09, y: 0.02, z: 0.07 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left 4th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the fourth toe.',
    function: 'Toe grip.',
    importance: 'Part of forefoot stability.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.09, y: 0.01, z: 0.08 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left 4th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the fourth toe.',
    function: 'Ground contact.',
    importance: 'Toe function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.09, y: 0.005, z: 0.09 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT 5TH TOE (3) ====================
  {
    name: 'Proximal Phalanx - Left 5th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the little toe.',
    function: 'Toe flexion, lateral foot stability.',
    importance: 'Lateral forefoot balance.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.11, y: 0.02, z: 0.06 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left 5th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the little toe (often fused with distal).',
    function: 'Toe grip.',
    importance: 'Often fused or vestigial.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.11, y: 0.01, z: 0.07 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left 5th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the little toe.',
    function: 'Ground contact.',
    importance: 'Commonly stubbed.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.11, y: 0.005, z: 0.08 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT GREAT TOE (2) ====================
  {
    name: 'Proximal Phalanx - Right Great Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the great toe, largest toe phalanx.',
    function: 'Flexion and extension for push-off during gait.',
    importance: 'Critical for walking mechanics and balance.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.03, y: 0.02, z: 0.08 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right Great Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the great toe.',
    function: 'Ground contact and push-off, nail bed support.',
    importance: 'Final point of ground contact during gait.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 0.01, z: 0.1 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT 2ND TOE (3) ====================
  {
    name: 'Proximal Phalanx - Right 2nd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the second toe.',
    function: 'Toe flexion and extension during gait.',
    importance: 'Part of forefoot stability.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 0.02, z: 0.08 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right 2nd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the second toe.',
    function: 'Contributes to toe grip during gait.',
    importance: 'Hammer toe commonly affects this joint.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 0.01, z: 0.09 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right 2nd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the second toe.',
    function: 'Ground contact during toe-off.',
    importance: 'Part of toe gripping function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 0.005, z: 0.1 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT 3RD TOE (3) ====================
  {
    name: 'Proximal Phalanx - Right 3rd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the third toe.',
    function: 'Toe flexion for gait.',
    importance: 'Central toe function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.07, y: 0.02, z: 0.08 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right 3rd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the third toe.',
    function: 'Toe grip contribution.',
    importance: 'Part of forefoot function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.07, y: 0.01, z: 0.09 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right 3rd Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the third toe.',
    function: 'Ground contact.',
    importance: 'Toe grip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.07, y: 0.005, z: 0.1 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT 4TH TOE (3) ====================
  {
    name: 'Proximal Phalanx - Right 4th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the fourth toe.',
    function: 'Toe flexion.',
    importance: 'Part of lateral forefoot.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.09, y: 0.02, z: 0.07 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right 4th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the fourth toe.',
    function: 'Toe grip.',
    importance: 'Part of forefoot stability.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.09, y: 0.01, z: 0.08 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right 4th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the fourth toe.',
    function: 'Ground contact.',
    importance: 'Toe function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.09, y: 0.005, z: 0.09 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT 5TH TOE (3) ====================
  {
    name: 'Proximal Phalanx - Right 5th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the little toe.',
    function: 'Toe flexion, lateral foot stability.',
    importance: 'Lateral forefoot balance.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.11, y: 0.02, z: 0.06 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right 5th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the little toe (often fused with distal).',
    function: 'Toe grip.',
    importance: 'Often fused or vestigial.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.11, y: 0.01, z: 0.07 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right 5th Toe',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the little toe.',
    function: 'Ground contact.',
    importance: 'Commonly stubbed.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.11, y: 0.005, z: 0.08 },
    exercises: []
  },

  // ==================== AUDITORY OSSICLES (6) ====================
  {
    name: 'Malleus (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Hammer-shaped bone, the largest of the auditory ossicles. Attached to the tympanic membrane.',
    function: 'Receives vibrations from the eardrum and transmits to incus.',
    importance: 'Essential for hearing. Part of the sound conduction chain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 1.62, z: 0.01 },
    exercises: []
  },
  {
    name: 'Malleus (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Hammer-shaped bone, the largest of the auditory ossicles. Attached to the tympanic membrane.',
    function: 'Receives vibrations from the eardrum and transmits to incus.',
    importance: 'Essential for hearing. Part of the sound conduction chain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 1.62, z: 0.01 },
    exercises: []
  },
  {
    name: 'Incus (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Anvil-shaped bone, the middle of the auditory ossicles. Bridges malleus and stapes.',
    function: 'Transmits vibrations from malleus to stapes with mechanical advantage.',
    importance: 'Essential for hearing. Middle link in sound conduction.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.082, y: 1.62, z: 0.01 },
    exercises: []
  },
  {
    name: 'Incus (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Anvil-shaped bone, the middle of the auditory ossicles. Bridges malleus and stapes.',
    function: 'Transmits vibrations from malleus to stapes with mechanical advantage.',
    importance: 'Essential for hearing. Middle link in sound conduction.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.082, y: 1.62, z: 0.01 },
    exercises: []
  },
  {
    name: 'Stapes (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Stirrup-shaped bone, the smallest bone in the human body. Fits into the oval window of the cochlea.',
    function: 'Transmits vibrations to the inner ear fluid via the oval window.',
    importance: 'Smallest bone in the body. Essential for hearing. Otosclerosis affects this bone.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.084, y: 1.62, z: 0.01 },
    exercises: []
  },
  {
    name: 'Stapes (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Stirrup-shaped bone, the smallest bone in the human body. Fits into the oval window of the cochlea.',
    function: 'Transmits vibrations to the inner ear fluid via the oval window.',
    importance: 'Smallest bone in the body. Essential for hearing. Otosclerosis affects this bone.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.084, y: 1.62, z: 0.01 },
    exercises: []
  },

  // ==================== HYOID (1) ====================
  {
    name: 'Hyoid Bone',
    type: 'bone',
    category: 'skeletal',
    description: 'U-shaped bone in the neck, the only bone that does not articulate with any other bone. Suspended by muscles and ligaments.',
    function: 'Supports the tongue, provides attachment for tongue and throat muscles, essential for swallowing and speech.',
    importance: 'Critical for swallowing and speech. Fracture is associated with strangulation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.48, z: 0.04 },
    exercises: []
  },
];
