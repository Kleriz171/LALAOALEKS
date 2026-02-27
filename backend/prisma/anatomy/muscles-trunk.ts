// TRUNK MUSCLES (Back, Chest, Abdomen, Pelvis)

export const TRUNK_MUSCLES = [
  // ==================== SUPERFICIAL BACK MUSCLES ====================
  {
    name: 'Trapezius (Upper Fibers)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Upper portion of the trapezius from skull base and cervical spinous processes to the lateral clavicle.',
    function: 'Elevates the scapula (shrugging), upwardly rotates the scapula, extends the head and neck.',
    importance: 'Often overactive in poor posture. Tension causes neck and shoulder pain.',
    movement: 'Contraction elevates the shoulders upward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 1.42, z: -0.08 },
    exercises: [
      { name: 'Barbell Shrugs', rank: 1, description: 'Direct upper trap loading.' },
      { name: 'Farmer\'s Carry', rank: 2, description: 'Functional trap work.' },
    ]
  },
  {
    name: 'Trapezius (Middle Fibers)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Middle portion from thoracic spinous processes to the acromion and scapular spine.',
    function: 'Retracts the scapula (pulls shoulder blades together), stabilizes the scapula.',
    importance: 'Often weak compared to upper traps. Key for posture correction.',
    movement: 'Contraction squeezes the shoulder blades together.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 1.3, z: -0.1 },
    exercises: [
      { name: 'Face Pulls', rank: 1, description: 'Excellent for middle trap activation.' },
      { name: 'Seated Cable Row', rank: 2, description: 'Retraction with load.' },
    ]
  },
  {
    name: 'Trapezius (Lower Fibers)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Lower portion from lower thoracic spinous processes to the medial scapular spine.',
    function: 'Depresses the scapula, assists upward rotation, stabilizes during overhead movements.',
    importance: 'Often weakest trap region. Critical for shoulder health.',
    movement: 'Contraction pulls shoulders down and back.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 1.18, z: -0.1 },
    exercises: [
      { name: 'Prone Y Raises', rank: 1, description: 'Targets lower traps specifically.' },
      { name: 'Face Pulls', rank: 2, description: 'Involves lower traps with external rotation.' },
    ]
  },
  {
    name: 'Latissimus Dorsi',
    type: 'muscle',
    category: 'upper_body',
    description: 'Largest back muscle, from thoracolumbar fascia, iliac crest, and lower ribs to the humerus.',
    function: 'Shoulder adduction, extension, and internal rotation. Assists in trunk extension and lateral flexion.',
    importance: 'Creates the V-taper. Essential for all pulling movements.',
    movement: 'Contraction pulls the arm down and back toward the body.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 1.1, z: -0.12 },
    exercises: [
      { name: 'Pull-Ups', rank: 1, description: 'King of lat exercises.' },
      { name: 'Barbell Row', rank: 2, description: 'Heavy compound lat work.' },
      { name: 'Lat Pulldown', rank: 3, description: 'Machine isolation for lats.' },
    ]
  },
  {
    name: 'Rhomboid Major',
    type: 'muscle',
    category: 'upper_body',
    description: 'Rhombus-shaped muscle from T2-T5 spinous processes to medial scapular border.',
    function: 'Retracts and elevates the scapula, downwardly rotates the scapula.',
    importance: 'Key postural muscle. Weakness causes scapular winging.',
    movement: 'Contraction pulls scapula toward spine.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 1.24, z: -0.1 },
    exercises: [
      { name: 'Face Pulls', rank: 1, description: 'Excellent rhomboid activation.' },
      { name: 'Bent-Over Rows', rank: 2, description: 'Compound retraction movement.' },
    ]
  },
  {
    name: 'Rhomboid Minor',
    type: 'muscle',
    category: 'upper_body',
    description: 'Small muscle above rhomboid major, from C7-T1 spinous processes to scapular spine root.',
    function: 'Retracts and elevates the scapula, works with rhomboid major.',
    importance: 'Works synergistically with rhomboid major.',
    movement: 'Contraction pulls upper scapula toward spine.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 1.3, z: -0.1 },
    exercises: []
  },
  {
    name: 'Levator Scapulae',
    type: 'muscle',
    category: 'upper_body',
    description: 'Strap-like muscle from C1-C4 transverse processes to superior scapular angle.',
    function: 'Elevates the scapula, assists in downward rotation, lateral flexes the neck.',
    importance: 'Often tight in desk workers. Major contributor to neck pain.',
    movement: 'Contraction elevates the shoulder blade and tilts neck.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 1.38, z: -0.06 },
    exercises: [
      { name: 'Levator Stretch', rank: 1, description: 'Relieves tension in levator scapulae.' },
    ]
  },

  // ==================== DEEP BACK MUSCLES (Erector Spinae Group) ====================
  {
    name: 'Iliocostalis Cervicis',
    type: 'muscle',
    category: 'core',
    description: 'Lateral column of erector spinae in the neck, from upper ribs to cervical transverse processes.',
    function: 'Extends and laterally flexes the cervical spine.',
    importance: 'Part of the erector spinae supporting the cervical region.',
    movement: 'Contraction extends the neck.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.04, y: 1.42, z: -0.08 },
    exercises: []
  },
  {
    name: 'Iliocostalis Thoracis',
    type: 'muscle',
    category: 'core',
    description: 'Lateral column of erector spinae in thoracic region, from lower to upper ribs.',
    function: 'Extends and laterally flexes the thoracic spine.',
    importance: 'Maintains thoracic spinal posture.',
    movement: 'Contraction extends the thoracic spine.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 1.22, z: -0.1 },
    exercises: []
  },
  {
    name: 'Iliocostalis Lumborum',
    type: 'muscle',
    category: 'core',
    description: 'Lateral column of erector spinae in lumbar region, from iliac crest to lower ribs.',
    function: 'Extends and laterally flexes the lumbar spine.',
    importance: 'Key stabilizer of the lower back. Involved in lifting mechanics.',
    movement: 'Contraction extends the lower back.',
    recoveryTime: 72,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.95, z: -0.1 },
    exercises: [
      { name: 'Back Extension', rank: 1, description: 'Targets erector spinae.' },
    ]
  },
  {
    name: 'Longissimus Capitis',
    type: 'muscle',
    category: 'core',
    description: 'Intermediate column of erector spinae, from upper thoracic to mastoid process.',
    function: 'Extends and rotates the head, laterally flexes the neck.',
    importance: 'Contributes to head extension and rotation.',
    movement: 'Contraction extends and rotates the head.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.03, y: 1.48, z: -0.08 },
    exercises: []
  },
  {
    name: 'Longissimus Cervicis',
    type: 'muscle',
    category: 'core',
    description: 'Intermediate column of erector spinae, from upper thoracic to cervical transverse processes.',
    function: 'Extends and laterally flexes the cervical spine.',
    importance: 'Supports cervical spinal posture.',
    movement: 'Contraction extends the cervical spine.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.03, y: 1.42, z: -0.08 },
    exercises: []
  },
  {
    name: 'Longissimus Thoracis',
    type: 'muscle',
    category: 'core',
    description: 'Largest portion of the intermediate erector spinae column, from sacrum to ribs and transverse processes.',
    function: 'Extends the vertebral column, laterally flexes the spine.',
    importance: 'Major trunk extensor. Essential for maintaining upright posture.',
    movement: 'Contraction extends the spine.',
    recoveryTime: 72,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 1.1, z: -0.1 },
    exercises: [
      { name: 'Deadlift', rank: 1, description: 'Heavy erector loading.' },
      { name: 'Good Morning', rank: 2, description: 'Hip hinge for erectors.' },
    ]
  },
  {
    name: 'Spinalis Cervicis',
    type: 'muscle',
    category: 'core',
    description: 'Medial column of erector spinae in the neck, often poorly developed.',
    function: 'Extends the cervical spine.',
    importance: 'Most medial erector spinae component in neck.',
    movement: 'Contraction extends the neck.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.015, y: 1.42, z: -0.07 },
    exercises: []
  },
  {
    name: 'Spinalis Thoracis',
    type: 'muscle',
    category: 'core',
    description: 'Medial column of erector spinae, from lower thoracic to upper thoracic spinous processes.',
    function: 'Extends the thoracic spine.',
    importance: 'Most medial erector spinae in thorax.',
    movement: 'Contraction extends thoracic spine.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.02, y: 1.18, z: -0.09 },
    exercises: []
  },

  // ==================== TRANSVERSOSPINALIS GROUP ====================
  {
    name: 'Semispinalis Thoracis',
    type: 'muscle',
    category: 'core',
    description: 'Deep back muscle from thoracic transverse processes to cervical/thoracic spinous processes.',
    function: 'Extends and rotates the thoracic spine.',
    importance: 'Deep stabilizer of the thoracic spine.',
    movement: 'Contraction extends and rotates thorax.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.025, y: 1.2, z: -0.08 },
    exercises: []
  },
  {
    name: 'Semispinalis Cervicis',
    type: 'muscle',
    category: 'core',
    description: 'Deep back muscle from upper thoracic transverse processes to cervical spinous processes.',
    function: 'Extends and rotates the cervical spine.',
    importance: 'Deep cervical stabilizer.',
    movement: 'Contraction extends and rotates neck.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.02, y: 1.4, z: -0.07 },
    exercises: []
  },
  {
    name: 'Multifidus',
    type: 'muscle',
    category: 'core',
    description: 'Deep segmental muscle spanning 2-4 vertebrae, from sacrum to C2.',
    function: 'Stabilizes individual vertebral segments, extends and rotates the spine.',
    importance: 'Critical segmental stabilizer. Atrophy linked to chronic low back pain.',
    movement: 'Contraction stabilizes and extends individual segments.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.03, y: 1.0, z: -0.08 },
    exercises: [
      { name: 'Bird Dog', rank: 1, description: 'Activates multifidus for stability.' },
      { name: 'Dead Bug', rank: 2, description: 'Core stability with multifidus activation.' },
    ]
  },
  {
    name: 'Rotatores',
    type: 'muscle',
    category: 'core',
    description: 'Deepest back muscles, spanning 1-2 vertebrae throughout the spine.',
    function: 'Proprioception and fine rotational control of individual vertebrae.',
    importance: 'Primary proprioceptive function for spinal position sense.',
    movement: 'Provide feedback about spinal position.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.025, y: 1.1, z: -0.07 },
    exercises: []
  },
  {
    name: 'Interspinales',
    type: 'muscle',
    category: 'core',
    description: 'Small paired muscles connecting adjacent spinous processes.',
    function: 'Extend adjacent vertebrae, proprioception.',
    importance: 'Segmental stabilizers and proprioceptors.',
    movement: 'Fine extension between segments.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 1.05, z: -0.07 },
    exercises: []
  },
  {
    name: 'Intertransversarii',
    type: 'muscle',
    category: 'core',
    description: 'Small muscles connecting adjacent transverse processes.',
    function: 'Lateral flexion of spine, proprioception.',
    importance: 'Segmental stabilizers and position sensors.',
    movement: 'Fine lateral movements between segments.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.04, y: 1.05, z: -0.07 },
    exercises: []
  },

  // ==================== CHEST MUSCLES ====================
  {
    name: 'Pectoralis Major (Clavicular Head)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Upper portion of pec major from medial clavicle to humerus.',
    function: 'Shoulder flexion, horizontal adduction, internal rotation. Emphasized with incline pressing.',
    importance: 'Upper chest development for complete pectoral appearance.',
    movement: 'Contraction brings arm up and across the body.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 1.32, z: 0.12 },
    exercises: [
      { name: 'Incline Bench Press', rank: 1, description: 'Primary upper chest exercise.' },
      { name: 'Incline Dumbbell Press', rank: 2, description: 'Greater upper chest stretch.' },
    ]
  },
  {
    name: 'Pectoralis Major (Sternal Head)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Lower and larger portion of pec major from sternum and ribs to humerus.',
    function: 'Horizontal adduction, shoulder extension from flexed position, internal rotation.',
    importance: 'Main mass of the chest. Essential for pushing strength.',
    movement: 'Contraction brings arm across body.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 1.2, z: 0.14 },
    exercises: [
      { name: 'Flat Bench Press', rank: 1, description: 'Primary chest exercise.' },
      { name: 'Dips', rank: 2, description: 'Lower chest emphasis.' },
      { name: 'Cable Crossover', rank: 3, description: 'Constant tension for chest.' },
    ]
  },
  {
    name: 'Pectoralis Minor',
    type: 'muscle',
    category: 'upper_body',
    description: 'Thin triangular muscle beneath pec major, from ribs 3-5 to coracoid process.',
    function: 'Protracts and depresses the scapula, tilts scapula anteriorly.',
    importance: 'Tightness causes rounded shoulders and shoulder impingement.',
    movement: 'Contraction pulls scapula forward and down.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 1.22, z: 0.1 },
    exercises: [
      { name: 'Dips', rank: 1, description: 'Pec minor active in deep dips.' },
    ]
  },
  {
    name: 'Serratus Anterior',
    type: 'muscle',
    category: 'upper_body',
    description: 'Fan-shaped muscle from ribs 1-9 to medial scapular border. Creates serrated appearance.',
    function: 'Protracts the scapula, holds scapula against ribcage, upwardly rotates for overhead movement.',
    importance: 'Critical for overhead pressing. Weakness causes scapular winging.',
    movement: 'Contraction pushes scapula forward around ribcage.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 1.15, z: 0.08 },
    exercises: [
      { name: 'Scapular Push-Ups', rank: 1, description: 'Direct serratus activation.' },
      { name: 'Serratus Punch', rank: 2, description: 'Protraction with resistance.' },
    ]
  },
  {
    name: 'Subclavius',
    type: 'muscle',
    category: 'upper_body',
    description: 'Small muscle from first rib to underside of clavicle.',
    function: 'Depresses and stabilizes the clavicle, protects subclavian vessels.',
    importance: 'Protects underlying neurovascular structures.',
    movement: 'Contraction pulls clavicle down.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 1.36, z: 0.08 },
    exercises: []
  },

  // ==================== ABDOMINAL MUSCLES ====================
  {
    name: 'Rectus Abdominis',
    type: 'muscle',
    category: 'core',
    description: 'Paired strap muscle from pubis to xiphoid process and costal cartilages 5-7. Divided by tendinous intersections.',
    function: 'Flexes the trunk, compresses abdominal contents, tilts pelvis posteriorly.',
    importance: 'The "six-pack" muscle. Essential for core stability and spinal flexion.',
    movement: 'Contraction brings ribs toward pelvis.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.04, y: 1.0, z: 0.12 },
    exercises: [
      { name: 'Hanging Leg Raise', rank: 1, description: 'Full rectus abdominis activation.' },
      { name: 'Cable Crunch', rank: 2, description: 'Loaded spinal flexion.' },
      { name: 'Ab Wheel Rollout', rank: 3, description: 'Eccentric ab loading.' },
    ]
  },
  {
    name: 'External Oblique',
    type: 'muscle',
    category: 'core',
    description: 'Largest lateral abdominal muscle, fibers run downward and medially from ribs to iliac crest and linea alba.',
    function: 'Trunk rotation to opposite side, lateral flexion, flexion, compression of abdomen.',
    importance: 'Primary trunk rotator. Creates the V-taper at the waist.',
    movement: 'Contraction rotates trunk to opposite side.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 0.95, z: 0.1 },
    exercises: [
      { name: 'Woodchop', rank: 1, description: 'Rotational oblique work.' },
      { name: 'Side Plank', rank: 2, description: 'Lateral core stability.' },
      { name: 'Russian Twist', rank: 3, description: 'Rotational endurance.' },
    ]
  },
  {
    name: 'Internal Oblique',
    type: 'muscle',
    category: 'core',
    description: 'Deep to external oblique, fibers run upward and medially from iliac crest to lower ribs.',
    function: 'Trunk rotation to same side, lateral flexion, compression, supports abdominal wall.',
    importance: 'Works with external oblique for powerful rotation.',
    movement: 'Contraction rotates trunk to same side.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.92, z: 0.08 },
    exercises: [
      { name: 'Pallof Press', rank: 1, description: 'Anti-rotation for obliques.' },
      { name: 'Side Plank', rank: 2, description: 'Isometric oblique work.' },
    ]
  },
  {
    name: 'Transverse Abdominis',
    type: 'muscle',
    category: 'core',
    description: 'Deepest abdominal muscle, horizontal fibers wrapping around torso like a corset.',
    function: 'Compresses abdominal contents, increases intra-abdominal pressure, stabilizes spine.',
    importance: 'Most important core stabilizer. Weakness linked to low back pain.',
    movement: 'Contraction draws belly button toward spine.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.9, z: 0.06 },
    exercises: [
      { name: 'Dead Bug', rank: 1, description: 'TVA activation with anti-extension.' },
      { name: 'Plank', rank: 2, description: 'Isometric TVA work.' },
      { name: 'Stomach Vacuum', rank: 3, description: 'Direct TVA activation.' },
    ]
  },
  {
    name: 'Quadratus Lumborum',
    type: 'muscle',
    category: 'core',
    description: 'Deep muscle of the posterior abdominal wall from iliac crest to 12th rib and lumbar transverse processes.',
    function: 'Lateral flexion of the spine, extends the lumbar spine, fixes the 12th rib during breathing.',
    importance: 'Often a source of lower back pain when tight or weak. Key for lateral stability.',
    movement: 'Contraction tilts pelvis up or bends trunk to the side.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.88, z: -0.04 },
    exercises: [
      { name: 'Side Plank', rank: 1, description: 'QL strengthening.' },
      { name: 'Suitcase Carry', rank: 2, description: 'Loaded lateral stability.' },
    ]
  },

  // ==================== RESPIRATORY MUSCLES ====================
  {
    name: 'Diaphragm',
    type: 'muscle',
    category: 'core',
    description: 'Dome-shaped muscle separating thoracic and abdominal cavities. Primary muscle of respiration.',
    function: 'Primary inspiration muscle - contraction flattens dome, increasing thoracic volume.',
    importance: 'Essential for breathing. Also critical for core stability and intra-abdominal pressure.',
    movement: 'Contraction draws diaphragm down, expanding lungs.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 1.05, z: 0.05 },
    exercises: [
      { name: 'Diaphragmatic Breathing', rank: 1, description: 'Strengthens breathing mechanics.' },
      { name: '90/90 Breathing', rank: 2, description: 'Diaphragm position and function.' },
    ]
  },
  {
    name: 'External Intercostals',
    type: 'muscle',
    category: 'core',
    description: 'Muscles between ribs, fibers run downward and forward from rib above to rib below.',
    function: 'Elevate the ribs during inspiration, expanding the thoracic cavity.',
    importance: 'Accessory muscles of breathing, active during deep inspiration.',
    movement: 'Contraction lifts the ribcage.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 1.15, z: 0.06 },
    exercises: []
  },
  {
    name: 'Internal Intercostals',
    type: 'muscle',
    category: 'core',
    description: 'Muscles between ribs deep to external intercostals, fibers run downward and backward.',
    function: 'Depress the ribs during forced expiration.',
    importance: 'Active during forced breathing and coughing.',
    movement: 'Contraction pulls ribs down.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.11, y: 1.15, z: 0.05 },
    exercises: []
  },
  {
    name: 'Innermost Intercostals',
    type: 'muscle',
    category: 'core',
    description: 'Deepest layer of intercostal muscles, similar orientation to internal intercostals.',
    function: 'Assist in depression of ribs during forced expiration.',
    importance: 'Deepest intercostal layer.',
    movement: 'Contraction depresses ribs.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 1.15, z: 0.04 },
    exercises: []
  },

  // ==================== PELVIC FLOOR MUSCLES ====================
  {
    name: 'Levator Ani',
    type: 'muscle',
    category: 'core',
    description: 'Primary pelvic floor muscle comprising pubococcygeus, puborectalis, and iliococcygeus.',
    function: 'Supports pelvic organs, maintains continence, core stabilization.',
    importance: 'Essential for continence and pelvic organ support. Weakness causes pelvic floor dysfunction.',
    movement: 'Contraction lifts and squeezes the pelvic floor.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 0.72, z: 0 },
    exercises: [
      { name: 'Kegel Exercises', rank: 1, description: 'Direct pelvic floor strengthening.' },
    ]
  },
  {
    name: 'Coccygeus',
    type: 'muscle',
    category: 'core',
    description: 'Triangular muscle from ischial spine to coccyx and lower sacrum.',
    function: 'Supports pelvic organs, flexes the coccyx.',
    importance: 'Part of the pelvic diaphragm supporting pelvic contents.',
    movement: 'Contraction pulls coccyx forward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.04, y: 0.72, z: -0.06 },
    exercises: []
  },
];
