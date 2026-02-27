// LOWER LIMB MUSCLES (Hip, Thigh, Leg, Foot)

export const LOWER_LIMB_MUSCLES = [
  // ==================== HIP MUSCLES - GLUTEAL GROUP ====================
  {
    name: 'Gluteus Maximus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Largest and most superficial gluteal muscle, from ilium, sacrum, and coccyx to IT band and gluteal tuberosity.',
    function: 'Primary hip extensor, external rotator. Upper fibers abduct, lower fibers adduct.',
    importance: 'Largest muscle in body. Essential for standing, climbing, running. Weak glutes cause back pain.',
    movement: 'Contraction extends the hip and rotates thigh outward.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 0.72, z: -0.12 },
    exercises: [
      { name: 'Hip Thrust', rank: 1, description: 'Maximum glute activation.' },
      { name: 'Barbell Squat', rank: 2, description: 'Compound glute work.' },
      { name: 'Romanian Deadlift', rank: 3, description: 'Hip hinge for glutes.' },
    ]
  },
  {
    name: 'Gluteus Medius',
    type: 'muscle',
    category: 'lower_body',
    description: 'Fan-shaped muscle on outer pelvis, partially covered by glute max, from ilium to greater trochanter.',
    function: 'Primary hip abductor. Anterior fibers internally rotate, posterior fibers externally rotate.',
    importance: 'Critical for pelvic stability in gait. Weakness causes Trendelenburg gait.',
    movement: 'Contraction raises leg out to the side.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.15, y: 0.78, z: -0.06 },
    exercises: [
      { name: 'Side-Lying Hip Abduction', rank: 1, description: 'Direct glute med isolation.' },
      { name: 'Clamshell', rank: 2, description: 'Glute med with external rotation.' },
      { name: 'Lateral Band Walk', rank: 3, description: 'Functional glute med work.' },
    ]
  },
  {
    name: 'Gluteus Minimus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Smallest and deepest gluteal muscle, from ilium to greater trochanter.',
    function: 'Hip abduction and internal rotation.',
    importance: 'Works with glute med for pelvic stability.',
    movement: 'Contraction assists in raising leg to side.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 0.76, z: -0.04 },
    exercises: []
  },
  {
    name: 'Tensor Fasciae Latae',
    type: 'muscle',
    category: 'lower_body',
    description: 'Muscle at the anterior lateral hip, from ASIS to IT band.',
    function: 'Hip flexion, abduction, and internal rotation. Tenses the IT band.',
    importance: 'Often overactive compensating for weak glutes. TFL tightness causes IT band syndrome.',
    movement: 'Contraction flexes and abducts the hip.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 0.78, z: 0.02 },
    exercises: [
      { name: 'TFL Stretch', rank: 1, description: 'Releases tight TFL.' },
    ]
  },

  // ==================== HIP MUSCLES - DEEP LATERAL ROTATORS ====================
  {
    name: 'Piriformis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep hip rotator from anterior sacrum through sciatic notch to greater trochanter.',
    function: 'External rotation when hip extended, abduction when hip flexed.',
    importance: 'Sciatic nerve often passes through or under it. Piriformis syndrome mimics sciatica.',
    movement: 'Contraction rotates thigh outward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.74, z: -0.08 },
    exercises: [
      { name: 'Piriformis Stretch', rank: 1, description: 'Relieves piriformis tightness.' },
    ]
  },
  {
    name: 'Obturator Internus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep hip rotator from obturator membrane, exits through lesser sciatic foramen.',
    function: 'External rotation of the hip.',
    importance: 'Part of the deep six external rotators.',
    movement: 'Contraction rotates thigh outward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.72, z: -0.06 },
    exercises: []
  },
  {
    name: 'Obturator Externus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep hip muscle from external obturator membrane to trochanteric fossa.',
    function: 'External rotation of the hip.',
    importance: 'Deepest of the external rotators.',
    movement: 'Contraction rotates thigh outward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.07, y: 0.7, z: -0.02 },
    exercises: []
  },
  {
    name: 'Gemellus Superior',
    type: 'muscle',
    category: 'lower_body',
    description: 'Small muscle above obturator internus tendon from ischial spine.',
    function: 'External rotation of the hip.',
    importance: 'Part of the triceps coxae with obturator internus.',
    movement: 'Contraction rotates thigh outward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.09, y: 0.73, z: -0.07 },
    exercises: []
  },
  {
    name: 'Gemellus Inferior',
    type: 'muscle',
    category: 'lower_body',
    description: 'Small muscle below obturator internus tendon from ischial tuberosity.',
    function: 'External rotation of the hip.',
    importance: 'Part of the triceps coxae with obturator internus.',
    movement: 'Contraction rotates thigh outward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.09, y: 0.71, z: -0.07 },
    exercises: []
  },
  {
    name: 'Quadratus Femoris',
    type: 'muscle',
    category: 'lower_body',
    description: 'Flat, quadrilateral muscle from ischial tuberosity to intertrochanteric crest.',
    function: 'External rotation and adduction of the hip.',
    importance: 'Most inferior of the deep six external rotators.',
    movement: 'Contraction rotates thigh outward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.68, z: -0.06 },
    exercises: []
  },

  // ==================== HIP MUSCLES - ILIOPSOAS ====================
  {
    name: 'Psoas Major',
    type: 'muscle',
    category: 'lower_body',
    description: 'Long muscle from lumbar vertebrae through pelvis to lesser trochanter.',
    function: 'Hip flexion, external rotation. Also flexes and laterally flexes the lumbar spine.',
    importance: 'Powerful hip flexor. Tightness causes anterior pelvic tilt and back pain.',
    movement: 'Contraction flexes the hip.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.85, z: 0.04 },
    exercises: [
      { name: 'Hanging Leg Raise', rank: 1, description: 'Hip flexor strengthening.' },
      { name: 'Hip Flexor Stretch', rank: 2, description: 'Releases tight psoas.' },
    ]
  },
  {
    name: 'Iliacus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Fan-shaped muscle from iliac fossa joining psoas to insert on lesser trochanter.',
    function: 'Hip flexion with psoas as the iliopsoas complex.',
    importance: 'Works synergistically with psoas for hip flexion.',
    movement: 'Contraction flexes the hip.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.8, z: 0.03 },
    exercises: []
  },

  // ==================== THIGH MUSCLES - ANTERIOR (QUADRICEPS) ====================
  {
    name: 'Rectus Femoris',
    type: 'muscle',
    category: 'lower_body',
    description: 'Superficial central quad from AIIS and superior acetabulum to patella.',
    function: 'Knee extension and hip flexion (only quad crossing hip joint).',
    importance: 'Active in kicking. Most prone to strain of the quads.',
    movement: 'Contraction extends knee and flexes hip.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.55, z: 0.08 },
    exercises: [
      { name: 'Leg Extension', rank: 1, description: 'Quad isolation.' },
      { name: 'Front Squat', rank: 2, description: 'Quad-dominant compound.' },
    ]
  },
  {
    name: 'Vastus Lateralis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Largest quad muscle on outer thigh from greater trochanter and linea aspera to patella.',
    function: 'Knee extension.',
    importance: 'Creates the outer thigh sweep. Common injection site.',
    movement: 'Contraction extends the knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.15, y: 0.5, z: 0.05 },
    exercises: [
      { name: 'Back Squat', rank: 1, description: 'Heavy quad loading.' },
      { name: 'Leg Press', rank: 2, description: 'Machine quad work.' },
    ]
  },
  {
    name: 'Vastus Medialis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Inner thigh quad with VMO (oblique) portion creating teardrop above knee.',
    function: 'Knee extension, especially final degrees. VMO stabilizes patella.',
    importance: 'VMO critical for patellar tracking. Weakness causes patellofemoral pain.',
    movement: 'Contraction extends the knee and stabilizes the kneecap.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.45, z: 0.06 },
    exercises: [
      { name: 'Terminal Knee Extension', rank: 1, description: 'VMO targeting.' },
      { name: 'Step-Up', rank: 2, description: 'Full range quad work.' },
    ]
  },
  {
    name: 'Vastus Intermedius',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep quad beneath rectus femoris from anterior femur to patella.',
    function: 'Knee extension.',
    importance: 'Works throughout full range of knee extension.',
    movement: 'Contraction extends the knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.5, z: 0.04 },
    exercises: []
  },

  // ==================== THIGH MUSCLES - POSTERIOR (HAMSTRINGS) ====================
  {
    name: 'Biceps Femoris (Long Head)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Lateral hamstring long head from ischial tuberosity to fibular head.',
    function: 'Hip extension and knee flexion. External rotation of tibia when knee flexed.',
    importance: 'Common hamstring strain site. Important for running speed.',
    movement: 'Contraction extends hip and flexes knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 0.52, z: -0.08 },
    exercises: [
      { name: 'Romanian Deadlift', rank: 1, description: 'Hip hinge for hamstrings.' },
      { name: 'Lying Leg Curl', rank: 2, description: 'Knee flexion isolation.' },
      { name: 'Nordic Curl', rank: 3, description: 'Eccentric hamstring work.' },
    ]
  },
  {
    name: 'Biceps Femoris (Short Head)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Lateral hamstring short head from linea aspera to fibular head.',
    function: 'Knee flexion only (does not cross hip).',
    importance: 'Only hamstring not crossing the hip joint.',
    movement: 'Contraction flexes the knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 0.45, z: -0.06 },
    exercises: []
  },
  {
    name: 'Semitendinosus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Medial hamstring with long tendon from ischial tuberosity to pes anserinus.',
    function: 'Hip extension, knee flexion, internal rotation of tibia.',
    importance: 'Commonly used for ACL reconstruction graft.',
    movement: 'Contraction extends hip and flexes knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.52, z: -0.07 },
    exercises: [
      { name: 'Seated Leg Curl', rank: 1, description: 'Emphasizes medial hamstrings.' },
    ]
  },
  {
    name: 'Semimembranosus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deepest medial hamstring from ischial tuberosity to posterior medial tibia.',
    function: 'Hip extension, knee flexion, internal rotation of tibia.',
    importance: 'Provides medial knee stability.',
    movement: 'Contraction extends hip and flexes knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.5, z: -0.08 },
    exercises: []
  },

  // ==================== THIGH MUSCLES - MEDIAL (ADDUCTORS) ====================
  {
    name: 'Adductor Magnus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Largest adductor with two parts: adductor portion and hamstring portion.',
    function: 'Hip adduction, flexion (adductor part), extension (hamstring part).',
    importance: 'Powerful adductor and extensor. Hamstring part assists in hip extension.',
    movement: 'Contraction pulls thigh toward midline.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.55, z: 0 },
    exercises: [
      { name: 'Sumo Deadlift', rank: 1, description: 'Heavy adductor loading.' },
      { name: 'Copenhagen Plank', rank: 2, description: 'Adductor strengthening.' },
    ]
  },
  {
    name: 'Adductor Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Most anterior adductor from pubic tubercle to linea aspera.',
    function: 'Hip adduction, flexion, assists in internal rotation.',
    importance: 'Most commonly strained adductor. Groin pull usually involves this muscle.',
    movement: 'Contraction pulls thigh toward midline.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.6, z: 0.03 },
    exercises: [
      { name: 'Cable Hip Adduction', rank: 1, description: 'Adductor isolation.' },
    ]
  },
  {
    name: 'Adductor Brevis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep to adductor longus, from pubis to upper linea aspera.',
    function: 'Hip adduction and flexion.',
    importance: 'Works synergistically with other adductors.',
    movement: 'Contraction pulls thigh toward midline.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 0.58, z: 0.02 },
    exercises: []
  },
  {
    name: 'Gracilis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Long thin muscle from pubis to pes anserinus on tibia.',
    function: 'Hip adduction, hip flexion, knee flexion, internal rotation of tibia.',
    importance: 'Only adductor crossing the knee. Used for ACL reconstruction.',
    movement: 'Contraction adducts hip and flexes knee.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.04, y: 0.5, z: 0.03 },
    exercises: []
  },
  {
    name: 'Pectineus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Flat quadrilateral muscle from pubic pecten to pectineal line of femur.',
    function: 'Hip flexion and adduction.',
    importance: 'Both hip flexor and adductor. Dual innervation (femoral and obturator).',
    movement: 'Contraction flexes and adducts the hip.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.68, z: 0.04 },
    exercises: []
  },

  // ==================== THIGH MUSCLES - ANTERIOR (OTHER) ====================
  {
    name: 'Sartorius',
    type: 'muscle',
    category: 'lower_body',
    description: 'Longest muscle in body, from ASIS to pes anserinus, crossing hip and knee.',
    function: 'Hip flexion, abduction, external rotation. Knee flexion, internal rotation.',
    importance: 'Creates tailor sitting position. Part of pes anserinus at knee.',
    movement: 'Contraction flexes and externally rotates the hip.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.6, z: 0.06 },
    exercises: []
  },

  // ==================== LEG MUSCLES - ANTERIOR ====================
  {
    name: 'Tibialis Anterior',
    type: 'muscle',
    category: 'lower_body',
    description: 'Prominent muscle on the front of the shin from lateral tibia to medial cuneiform.',
    function: 'Dorsiflexion of the ankle, inversion of the foot.',
    importance: 'Essential for clearing foot during gait. Weakness causes foot drop.',
    movement: 'Contraction pulls foot up and in.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.25, z: 0.04 },
    exercises: [
      { name: 'Tibialis Raise', rank: 1, description: 'Direct tibialis anterior work.' },
    ]
  },
  {
    name: 'Extensor Hallucis Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep anterior leg muscle from fibula to distal phalanx of great toe.',
    function: 'Extends the great toe, assists in dorsiflexion and inversion.',
    importance: 'Key for toe clearance in walking. Tendon visible at ankle.',
    movement: 'Contraction extends the big toe upward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.09, y: 0.2, z: 0.04 },
    exercises: []
  },
  {
    name: 'Extensor Digitorum Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Anterior leg muscle from tibia and fibula to toes 2-5.',
    function: 'Extends toes 2-5, assists in dorsiflexion and eversion.',
    importance: 'Extends the lesser toes during swing phase of gait.',
    movement: 'Contraction extends the toes upward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.11, y: 0.22, z: 0.03 },
    exercises: []
  },
  {
    name: 'Peroneus Tertius',
    type: 'muscle',
    category: 'lower_body',
    description: 'Small muscle from distal fibula to 5th metatarsal, part of EDL.',
    function: 'Dorsiflexion and eversion of the foot.',
    importance: 'Absent in some individuals. Assists in ankle dorsiflexion.',
    movement: 'Contraction pulls foot up and out.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 0.18, z: 0.03 },
    exercises: []
  },

  // ==================== LEG MUSCLES - LATERAL ====================
  {
    name: 'Peroneus Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Superficial lateral leg muscle from fibular head to 1st metatarsal base.',
    function: 'Eversion and plantarflexion. Supports transverse arch.',
    importance: 'Primary evertor. Weakness leads to ankle instability.',
    movement: 'Contraction turns sole of foot outward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 0.28, z: 0 },
    exercises: [
      { name: 'Ankle Eversion', rank: 1, description: 'Peroneal strengthening.' },
    ]
  },
  {
    name: 'Peroneus Brevis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep to peroneus longus, from distal fibula to 5th metatarsal base.',
    function: 'Eversion and plantarflexion of the foot.',
    importance: 'Commonly injured with ankle sprains.',
    movement: 'Contraction turns sole of foot outward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.13, y: 0.22, z: 0 },
    exercises: []
  },

  // ==================== LEG MUSCLES - POSTERIOR SUPERFICIAL ====================
  {
    name: 'Gastrocnemius (Medial Head)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Medial head of gastrocnemius from medial femoral condyle to calcaneus via Achilles.',
    function: 'Plantarflexion of the ankle, assists in knee flexion.',
    importance: 'Powerful plantarflexor. Creates the medial calf bulge.',
    movement: 'Contraction points the foot down.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.32, z: -0.06 },
    exercises: [
      { name: 'Standing Calf Raise', rank: 1, description: 'Gastrocnemius emphasis.' },
    ]
  },
  {
    name: 'Gastrocnemius (Lateral Head)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Lateral head of gastrocnemius from lateral femoral condyle to calcaneus via Achilles.',
    function: 'Plantarflexion of the ankle, assists in knee flexion.',
    importance: 'Creates the lateral calf contour.',
    movement: 'Contraction points the foot down.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.32, z: -0.06 },
    exercises: []
  },
  {
    name: 'Soleus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep to gastrocnemius, from tibia and fibula to calcaneus via Achilles.',
    function: 'Plantarflexion of the ankle. Primary postural muscle against gravity.',
    importance: 'More active than gastroc in standing. Key endurance plantarflexor.',
    movement: 'Contraction points the foot down.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.25, z: -0.05 },
    exercises: [
      { name: 'Seated Calf Raise', rank: 1, description: 'Soleus isolation.' },
    ]
  },
  {
    name: 'Plantaris',
    type: 'muscle',
    category: 'lower_body',
    description: 'Small muscle with long tendon from lateral femoral condyle to calcaneus.',
    function: 'Weak plantarflexion and knee flexion.',
    importance: 'Vestigial muscle. Absent in 7-10% of people.',
    movement: 'Contraction assists in pointing foot down.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.35, z: -0.05 },
    exercises: []
  },

  // ==================== LEG MUSCLES - POSTERIOR DEEP ====================
  {
    name: 'Tibialis Posterior',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deepest posterior leg muscle from tibia, fibula, and interosseous membrane to navicular and cuneiforms.',
    function: 'Plantarflexion and inversion. Primary support for medial longitudinal arch.',
    importance: 'Key arch supporter. Dysfunction causes flat foot.',
    movement: 'Contraction points foot down and in.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.22, z: -0.03 },
    exercises: [
      { name: 'Arch Lifts', rank: 1, description: 'Tibialis posterior strengthening.' },
    ]
  },
  {
    name: 'Flexor Hallucis Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep posterior leg muscle from fibula to distal phalanx of great toe.',
    function: 'Flexes the great toe, assists plantarflexion and inversion.',
    importance: 'Key for push-off in walking. Important for dancers.',
    movement: 'Contraction curls the big toe down.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.2, z: -0.02 },
    exercises: []
  },
  {
    name: 'Flexor Digitorum Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Deep posterior leg muscle from tibia to distal phalanges of toes 2-5.',
    function: 'Flexes toes 2-5, assists plantarflexion and inversion.',
    importance: 'Grips the ground during walking.',
    movement: 'Contraction curls the lesser toes down.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.07, y: 0.2, z: -0.02 },
    exercises: []
  },
  {
    name: 'Popliteus',
    type: 'muscle',
    category: 'lower_body',
    description: 'Small triangular muscle at the back of the knee from lateral femoral condyle to proximal tibia.',
    function: 'Unlocks the extended knee by internal rotation of tibia, assists knee flexion.',
    importance: 'Initiates knee flexion from full extension.',
    movement: 'Contraction unlocks the knee for flexion.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.38, z: -0.04 },
    exercises: []
  },

  // ==================== FOOT MUSCLES - DORSAL ====================
  {
    name: 'Extensor Digitorum Brevis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Intrinsic foot muscle on dorsum of foot from calcaneus to toes 2-4.',
    function: 'Extends toes 2-4 at MTP joints.',
    importance: 'Only muscle on dorsum of foot. Assists toe extension.',
    movement: 'Contraction extends the middle toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.06, z: 0.05 },
    exercises: []
  },
  {
    name: 'Extensor Hallucis Brevis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Intrinsic foot muscle from calcaneus to proximal phalanx of great toe.',
    function: 'Extends the great toe at MTP joint.',
    importance: 'Assists in great toe extension.',
    movement: 'Contraction extends the big toe.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.06, z: 0.06 },
    exercises: []
  },

  // ==================== FOOT MUSCLES - PLANTAR LAYER 1 ====================
  {
    name: 'Abductor Hallucis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Medial plantar muscle from calcaneus to proximal phalanx of great toe.',
    function: 'Abducts and flexes the great toe, supports medial arch.',
    importance: 'Key arch supporter. Weakness contributes to bunion formation.',
    movement: 'Contraction spreads the big toe away from other toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.04, y: 0.04, z: 0.02 },
    exercises: [
      { name: 'Toe Yoga', rank: 1, description: 'Intrinsic foot muscle activation.' },
    ]
  },
  {
    name: 'Flexor Digitorum Brevis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Central plantar muscle from calcaneus to middle phalanges of toes 2-5.',
    function: 'Flexes the PIP joints of lateral four toes.',
    importance: 'Supports the longitudinal arch.',
    movement: 'Contraction curls the middle of the toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.04, z: 0.01 },
    exercises: []
  },
  {
    name: 'Abductor Digiti Minimi (Foot)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Lateral plantar muscle from calcaneus to proximal phalanx of little toe.',
    function: 'Abducts and flexes the little toe.',
    importance: 'Forms lateral border of sole.',
    movement: 'Contraction spreads the little toe.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 0.04, z: 0.01 },
    exercises: []
  },

  // ==================== FOOT MUSCLES - PLANTAR LAYERS 2-4 ====================
  {
    name: 'Quadratus Plantae',
    type: 'muscle',
    category: 'lower_body',
    description: 'Second layer muscle from calcaneus to FDL tendons.',
    function: 'Assists FDL in flexing toes, corrects oblique pull of FDL.',
    importance: 'Allows straight toe flexion despite oblique FDL pull.',
    movement: 'Contraction assists in curling the toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.05, z: -0.01 },
    exercises: []
  },
  {
    name: 'Lumbricals (Foot)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Four small muscles from FDL tendons to extensor expansions of toes 2-5.',
    function: 'Flex MTP joints while extending IP joints.',
    importance: 'Fine motor control of toes.',
    movement: 'Contraction flexes toe knuckles while straightening toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.03, z: 0 },
    exercises: []
  },
  {
    name: 'Flexor Hallucis Brevis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Third layer muscle from cuboid to proximal phalanx of great toe via sesamoids.',
    function: 'Flexes the MTP joint of the great toe.',
    importance: 'Key for push-off. Sesamoids within its tendons.',
    movement: 'Contraction flexes the big toe at the base.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.04, y: 0.03, z: 0.02 },
    exercises: []
  },
  {
    name: 'Adductor Hallucis',
    type: 'muscle',
    category: 'lower_body',
    description: 'Third layer muscle with oblique and transverse heads to proximal phalanx of great toe.',
    function: 'Adducts the great toe, supports transverse arch.',
    importance: 'Maintains transverse arch. Contracture contributes to bunion.',
    movement: 'Contraction pulls big toe toward other toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.03, z: 0.01 },
    exercises: []
  },
  {
    name: 'Flexor Digiti Minimi Brevis (Foot)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Third layer muscle from 5th metatarsal to proximal phalanx of little toe.',
    function: 'Flexes the MTP joint of the little toe.',
    importance: 'Part of hypothenar region of foot.',
    movement: 'Contraction flexes the little toe base.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 0.03, z: 0.01 },
    exercises: []
  },
  {
    name: 'Plantar Interossei',
    type: 'muscle',
    category: 'lower_body',
    description: 'Three muscles in fourth layer adducting toes 3-5 toward second toe.',
    function: 'Adduct toes toward second toe, flex MTP joints.',
    importance: 'Keep toes aligned during walking.',
    movement: 'Contraction brings toes together.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.02, z: 0 },
    exercises: []
  },
  {
    name: 'Dorsal Interossei (Foot)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Four bipennate muscles in fourth layer abducting toes 2-4 from second toe.',
    function: 'Abduct toes from second toe, flex MTP joints.',
    importance: 'Spread toes for balance.',
    movement: 'Contraction spreads the toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.02, z: -0.01 },
    exercises: [
      { name: 'Toe Spreads', rank: 1, description: 'Foot intrinsic strengthening.' },
    ]
  },
];
