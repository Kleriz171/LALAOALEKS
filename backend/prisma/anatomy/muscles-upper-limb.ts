// UPPER LIMB MUSCLES (Shoulder, Arm, Forearm, Hand)

export const UPPER_LIMB_MUSCLES = [
  // ==================== ROTATOR CUFF ====================
  {
    name: 'Supraspinatus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Rotator cuff muscle in the supraspinous fossa of the scapula, inserts on the greater tubercle.',
    function: 'Initiates shoulder abduction (first 15°), stabilizes the humeral head in the glenoid.',
    importance: 'Most commonly torn rotator cuff muscle. Critical for starting arm elevation.',
    movement: 'Contraction initiates arm raising to the side.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 1.34, z: -0.1 },
    exercises: [
      { name: 'Empty Can Exercise', rank: 1, description: 'Supraspinatus isolation.' },
      { name: 'Lateral Raise', rank: 2, description: 'Involves supraspinatus in abduction.' },
    ]
  },
  {
    name: 'Infraspinatus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Rotator cuff muscle in the infraspinous fossa, inserts on the greater tubercle.',
    function: 'External rotation of the shoulder, stabilizes the humeral head posteriorly.',
    importance: 'Primary external rotator. Second most commonly torn rotator cuff muscle.',
    movement: 'Contraction rotates arm outward.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 1.26, z: -0.12 },
    exercises: [
      { name: 'External Rotation', rank: 1, description: 'Direct infraspinatus work.' },
      { name: 'Face Pulls', rank: 2, description: 'External rotation with retraction.' },
    ]
  },
  {
    name: 'Teres Minor',
    type: 'muscle',
    category: 'upper_body',
    description: 'Small rotator cuff muscle below infraspinatus, from lateral scapular border to greater tubercle.',
    function: 'External rotation of the shoulder, assists in shoulder adduction.',
    importance: 'Works synergistically with infraspinatus for external rotation.',
    movement: 'Contraction rotates arm outward.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 1.22, z: -0.1 },
    exercises: [
      { name: 'Side-Lying External Rotation', rank: 1, description: 'Isolates teres minor.' },
    ]
  },
  {
    name: 'Subscapularis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Largest rotator cuff muscle, fills the subscapular fossa, inserts on the lesser tubercle.',
    function: 'Internal rotation of the shoulder, adduction, stabilizes humeral head anteriorly.',
    importance: 'Primary internal rotator. Tears cause anterior shoulder instability.',
    movement: 'Contraction rotates arm inward.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 1.26, z: 0.02 },
    exercises: [
      { name: 'Internal Rotation', rank: 1, description: 'Subscapularis strengthening.' },
    ]
  },

  // ==================== SHOULDER MUSCLES ====================
  {
    name: 'Deltoid (Anterior)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Front portion of the deltoid from lateral clavicle to deltoid tuberosity of humerus.',
    function: 'Shoulder flexion, horizontal adduction, assists internal rotation.',
    importance: 'Active in all pressing movements. Creates front shoulder roundness.',
    movement: 'Contraction raises arm forward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.18, y: 1.34, z: 0.06 },
    exercises: [
      { name: 'Overhead Press', rank: 1, description: 'Primary front delt movement.' },
      { name: 'Front Raise', rank: 2, description: 'Isolation for anterior deltoid.' },
    ]
  },
  {
    name: 'Deltoid (Lateral)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Middle portion of the deltoid from acromion to deltoid tuberosity.',
    function: 'Shoulder abduction (raising arm to the side).',
    importance: 'Creates shoulder width and capped appearance.',
    movement: 'Contraction raises arm out to the side.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.22, y: 1.34, z: 0 },
    exercises: [
      { name: 'Lateral Raise', rank: 1, description: 'Primary lateral delt isolation.' },
      { name: 'Upright Row', rank: 2, description: 'Compound abduction movement.' },
    ]
  },
  {
    name: 'Deltoid (Posterior)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Rear portion of the deltoid from scapular spine to deltoid tuberosity.',
    function: 'Shoulder horizontal abduction, extension, assists external rotation.',
    importance: 'Often underdeveloped. Critical for shoulder balance and posture.',
    movement: 'Contraction pulls arm backward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.18, y: 1.34, z: -0.08 },
    exercises: [
      { name: 'Reverse Fly', rank: 1, description: 'Rear delt isolation.' },
      { name: 'Face Pulls', rank: 2, description: 'Rear delt with external rotation.' },
    ]
  },
  {
    name: 'Teres Major',
    type: 'muscle',
    category: 'upper_body',
    description: 'Thick muscle from inferior scapular angle to medial humerus near lat insertion.',
    function: 'Shoulder adduction, extension, and internal rotation. Called "lat\'s little helper."',
    importance: 'Assists lats in all pulling movements. Creates side thickness.',
    movement: 'Contraction pulls arm down and in.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.16, y: 1.2, z: -0.08 },
    exercises: [
      { name: 'Lat Pulldown', rank: 1, description: 'Works with lats for adduction.' },
      { name: 'Pull-Ups', rank: 2, description: 'Compound teres major work.' },
    ]
  },

  // ==================== ARM MUSCLES - ANTERIOR ====================
  {
    name: 'Biceps Brachii (Long Head)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Lateral head of biceps from supraglenoid tubercle, crosses the shoulder joint.',
    function: 'Elbow flexion, forearm supination, weak shoulder flexion.',
    importance: 'Creates the bicep peak. Tendon prone to tendinitis at shoulder.',
    movement: 'Contraction flexes the elbow and supinates forearm.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.24, y: 1.12, z: 0.05 },
    exercises: [
      { name: 'Incline Dumbbell Curl', rank: 1, description: 'Stretches long head for emphasis.' },
      { name: 'Barbell Curl', rank: 2, description: 'Overall bicep development.' },
    ]
  },
  {
    name: 'Biceps Brachii (Short Head)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Medial head of biceps from coracoid process, does not cross the shoulder joint.',
    function: 'Elbow flexion, forearm supination, assists shoulder flexion.',
    importance: 'Creates bicep thickness and inner fullness.',
    movement: 'Contraction flexes the elbow.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.22, y: 1.12, z: 0.06 },
    exercises: [
      { name: 'Preacher Curl', rank: 1, description: 'Emphasizes short head.' },
      { name: 'Concentration Curl', rank: 2, description: 'Peak contraction for short head.' },
    ]
  },
  {
    name: 'Brachialis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep to biceps, from distal anterior humerus to coronoid process of ulna.',
    function: 'Pure elbow flexion regardless of forearm position.',
    importance: 'Actually stronger elbow flexor than biceps. Adds arm thickness.',
    movement: 'Contraction flexes the elbow.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.24, y: 1.06, z: 0.03 },
    exercises: [
      { name: 'Hammer Curl', rank: 1, description: 'Neutral grip emphasizes brachialis.' },
      { name: 'Reverse Curl', rank: 2, description: 'Maximum brachialis activation.' },
    ]
  },
  {
    name: 'Coracobrachialis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Small muscle from coracoid process to mid-medial humerus.',
    function: 'Shoulder flexion and adduction.',
    importance: 'Assists in arm movements toward the body.',
    movement: 'Contraction brings arm forward and toward body.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.2, y: 1.18, z: 0.04 },
    exercises: []
  },

  // ==================== ARM MUSCLES - POSTERIOR ====================
  {
    name: 'Triceps Brachii (Long Head)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Only triceps head crossing the shoulder, from infraglenoid tubercle to olecranon.',
    function: 'Elbow extension, shoulder extension and adduction.',
    importance: 'Largest triceps head. Provides the "horseshoe" shape.',
    movement: 'Contraction extends the elbow and assists shoulder extension.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.22, y: 1.12, z: -0.06 },
    exercises: [
      { name: 'Overhead Tricep Extension', rank: 1, description: 'Stretches long head for emphasis.' },
      { name: 'Skull Crushers', rank: 2, description: 'Long head emphasis with overhead angle.' },
    ]
  },
  {
    name: 'Triceps Brachii (Lateral Head)',
    type: 'muscle',
    category: 'upper_body',
    description: 'From posterior humerus above radial groove to olecranon.',
    function: 'Elbow extension, strongest of the three heads.',
    importance: 'Creates the outer tricep sweep visible from the side.',
    movement: 'Contraction extends the elbow.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.26, y: 1.1, z: -0.04 },
    exercises: [
      { name: 'Tricep Pushdown', rank: 1, description: 'Lateral head emphasis.' },
      { name: 'Close-Grip Bench Press', rank: 2, description: 'Heavy compound tricep work.' },
    ]
  },
  {
    name: 'Triceps Brachii (Medial Head)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deepest head, from posterior humerus below radial groove to olecranon.',
    function: 'Elbow extension, active throughout all elbow extension movements.',
    importance: 'Most active in low-force extension. Provides tricep fullness.',
    movement: 'Contraction extends the elbow.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.23, y: 1.08, z: -0.03 },
    exercises: [
      { name: 'Diamond Push-Ups', rank: 1, description: 'Emphasizes medial head.' },
      { name: 'Tricep Kickback', rank: 2, description: 'Full extension for medial head.' },
    ]
  },
  {
    name: 'Anconeus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Small triangular muscle at the back of the elbow from lateral epicondyle to olecranon.',
    function: 'Assists elbow extension, stabilizes the elbow joint during pronation.',
    importance: 'Minor extensor but important elbow stabilizer.',
    movement: 'Contraction assists elbow extension.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.28, y: 0.98, z: -0.02 },
    exercises: []
  },

  // ==================== FOREARM MUSCLES - ANTERIOR SUPERFICIAL ====================
  {
    name: 'Pronator Teres',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm muscle from medial epicondyle and coronoid to mid-radius.',
    function: 'Pronates the forearm, assists elbow flexion.',
    importance: 'Primary pronator. Median nerve passes between its heads.',
    movement: 'Contraction turns palm downward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.27, y: 0.96, z: 0.03 },
    exercises: []
  },
  {
    name: 'Flexor Carpi Radialis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm flexor from medial epicondyle to base of 2nd and 3rd metacarpals.',
    function: 'Flexes the wrist, radial deviation (abduction).',
    importance: 'Key wrist flexor. Tendon is landmark for radial artery.',
    movement: 'Contraction flexes and abducts the wrist.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.28, y: 0.9, z: 0.04 },
    exercises: [
      { name: 'Wrist Curl', rank: 1, description: 'Wrist flexor strengthening.' },
    ]
  },
  {
    name: 'Palmaris Longus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm muscle from medial epicondyle to palmar aponeurosis. Absent in ~14% of people.',
    function: 'Weak wrist flexor, tenses the palmar aponeurosis.',
    importance: 'Commonly used for tendon grafts. Absence has no functional deficit.',
    movement: 'Contraction flexes the wrist slightly.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.29, y: 0.9, z: 0.03 },
    exercises: []
  },
  {
    name: 'Flexor Carpi Ulnaris',
    type: 'muscle',
    category: 'upper_body',
    description: 'Most medial superficial forearm flexor, from medial epicondyle and olecranon to pisiform.',
    function: 'Flexes the wrist, ulnar deviation (adduction).',
    importance: 'Strongest wrist flexor. Important for grip strength.',
    movement: 'Contraction flexes and adducts the wrist.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.9, z: 0.01 },
    exercises: []
  },
  {
    name: 'Flexor Digitorum Superficialis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Intermediate forearm flexor, four tendons to middle phalanges of fingers 2-5.',
    function: 'Flexes the PIP joints of fingers, assists wrist and MCP flexion.',
    importance: 'Primary finger flexor for grip. Essential for hand function.',
    movement: 'Contraction flexes fingers at the middle joint.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.29, y: 0.88, z: 0.02 },
    exercises: [
      { name: 'Grip Squeeze', rank: 1, description: 'Finger flexor strengthening.' },
    ]
  },

  // ==================== FOREARM MUSCLES - ANTERIOR DEEP ====================
  {
    name: 'Flexor Digitorum Profundus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep forearm flexor with four tendons to distal phalanges of fingers 2-5.',
    function: 'Flexes the DIP joints of fingers, assists in MCP and wrist flexion.',
    importance: 'Only muscle that flexes the fingertips. Essential for pinch grip.',
    movement: 'Contraction flexes the fingertips.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.28, y: 0.86, z: 0.01 },
    exercises: []
  },
  {
    name: 'Flexor Pollicis Longus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep forearm muscle from radius and interosseous membrane to distal phalanx of thumb.',
    function: 'Flexes the thumb IP joint, assists in MCP and CMC flexion.',
    importance: 'Only muscle flexing the thumb tip. Critical for precision grip.',
    movement: 'Contraction flexes the thumb tip.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.27, y: 0.86, z: 0.02 },
    exercises: []
  },
  {
    name: 'Pronator Quadratus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep square muscle at the distal forearm between radius and ulna.',
    function: 'Primary pronator of the forearm.',
    importance: 'Main pronator, especially during slow or unresisted pronation.',
    movement: 'Contraction turns palm downward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.82, z: 0 },
    exercises: []
  },

  // ==================== FOREARM MUSCLES - POSTERIOR SUPERFICIAL ====================
  {
    name: 'Brachioradialis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm muscle from lateral supracondylar ridge to distal radius.',
    function: 'Flexes the elbow, especially in neutral forearm position.',
    importance: 'Forearm flexor active in hammer curl position. Creates forearm bulk.',
    movement: 'Contraction flexes the elbow.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.29, y: 0.96, z: 0.01 },
    exercises: [
      { name: 'Hammer Curl', rank: 1, description: 'Primary brachioradialis exercise.' },
    ]
  },
  {
    name: 'Extensor Carpi Radialis Longus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm extensor from lateral supracondylar ridge to 2nd metacarpal base.',
    function: 'Extends and abducts the wrist.',
    importance: 'Key wrist extensor for backhand movements.',
    movement: 'Contraction extends and abducts the wrist.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.94, z: -0.01 },
    exercises: [
      { name: 'Reverse Wrist Curl', rank: 1, description: 'Wrist extensor strengthening.' },
    ]
  },
  {
    name: 'Extensor Carpi Radialis Brevis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm extensor from lateral epicondyle to 3rd metacarpal base.',
    function: 'Extends the wrist, slight abduction.',
    importance: 'Origin is common site for lateral epicondylitis (tennis elbow).',
    movement: 'Contraction extends the wrist.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.92, z: -0.02 },
    exercises: []
  },
  {
    name: 'Extensor Digitorum',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm extensor with four tendons to fingers 2-5.',
    function: 'Extends the MCP joints, assists in wrist extension.',
    importance: 'Primary finger extensor. Essential for opening the hand.',
    movement: 'Contraction extends the fingers at the knuckles.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.9, z: -0.02 },
    exercises: [
      { name: 'Finger Extensions', rank: 1, description: 'Extensor strengthening.' },
    ]
  },
  {
    name: 'Extensor Digiti Minimi',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm extensor specifically for the little finger.',
    function: 'Extends the little finger at MCP joint.',
    importance: 'Allows independent extension of the pinky.',
    movement: 'Contraction extends the little finger.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.31, y: 0.88, z: -0.02 },
    exercises: []
  },
  {
    name: 'Extensor Carpi Ulnaris',
    type: 'muscle',
    category: 'upper_body',
    description: 'Superficial forearm extensor from lateral epicondyle and ulna to 5th metacarpal base.',
    function: 'Extends and adducts the wrist.',
    importance: 'Key for ulnar deviation. Important in power grip.',
    movement: 'Contraction extends and adducts the wrist.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.31, y: 0.9, z: -0.03 },
    exercises: []
  },

  // ==================== FOREARM MUSCLES - POSTERIOR DEEP ====================
  {
    name: 'Supinator',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep forearm muscle wrapping around the proximal radius.',
    function: 'Supinates the forearm (turns palm up).',
    importance: 'Primary supinator with biceps relaxed. Radial nerve passes through it.',
    movement: 'Contraction turns palm upward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.29, y: 0.94, z: -0.01 },
    exercises: []
  },
  {
    name: 'Abductor Pollicis Longus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep forearm muscle from radius, ulna, and interosseous membrane to 1st metacarpal base.',
    function: 'Abducts the thumb, assists in wrist abduction.',
    importance: 'Key for hitchhiker position. Forms border of anatomical snuffbox.',
    movement: 'Contraction pulls thumb away from hand.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.29, y: 0.86, z: -0.01 },
    exercises: []
  },
  {
    name: 'Extensor Pollicis Brevis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep forearm muscle from radius to proximal phalanx of thumb.',
    function: 'Extends the thumb MCP joint.',
    importance: 'Forms lateral border of anatomical snuffbox.',
    movement: 'Contraction extends the thumb at the knuckle.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.84, z: -0.01 },
    exercises: []
  },
  {
    name: 'Extensor Pollicis Longus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep forearm muscle from ulna to distal phalanx of thumb.',
    function: 'Extends the thumb IP joint.',
    importance: 'Forms medial border of anatomical snuffbox. Extends thumb tip.',
    movement: 'Contraction extends the thumb tip.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.85, z: -0.02 },
    exercises: []
  },
  {
    name: 'Extensor Indicis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep forearm muscle from ulna to extensor expansion of index finger.',
    function: 'Extends the index finger independently.',
    importance: 'Allows pointing while other fingers are flexed.',
    movement: 'Contraction extends the index finger.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.3, y: 0.84, z: -0.02 },
    exercises: []
  },

  // ==================== HAND MUSCLES - THENAR EMINENCE ====================
  {
    name: 'Abductor Pollicis Brevis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Thenar muscle from scaphoid and trapezium to proximal phalanx of thumb.',
    function: 'Abducts the thumb perpendicular to the palm.',
    importance: 'Key for grip opening. Atrophy indicates median nerve damage.',
    movement: 'Contraction moves thumb away from palm.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.31, y: 0.76, z: 0.04 },
    exercises: []
  },
  {
    name: 'Flexor Pollicis Brevis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Thenar muscle from flexor retinaculum and carpal bones to proximal phalanx of thumb.',
    function: 'Flexes the thumb MCP joint.',
    importance: 'Key for power grip. Dual innervation (median and ulnar).',
    movement: 'Contraction flexes the thumb at the knuckle.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.32, y: 0.76, z: 0.03 },
    exercises: []
  },
  {
    name: 'Opponens Pollicis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep thenar muscle from trapezium to 1st metacarpal.',
    function: 'Opposition of the thumb (brings thumb to touch fingertips).',
    importance: 'Critical for human hand function. Enables precision grip.',
    movement: 'Contraction rotates thumb to face fingers.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.31, y: 0.76, z: 0.02 },
    exercises: []
  },
  {
    name: 'Adductor Pollicis',
    type: 'muscle',
    category: 'upper_body',
    description: 'Deep hand muscle with oblique and transverse heads, from 2nd-3rd metacarpals to proximal phalanx of thumb.',
    function: 'Adducts the thumb toward the palm.',
    importance: 'Key for pinch grip strength. Froment\'s sign tests this muscle.',
    movement: 'Contraction pulls thumb toward palm.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.33, y: 0.74, z: 0.02 },
    exercises: []
  },

  // ==================== HAND MUSCLES - HYPOTHENAR EMINENCE ====================
  {
    name: 'Abductor Digiti Minimi (Hand)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Hypothenar muscle from pisiform to proximal phalanx of little finger.',
    function: 'Abducts the little finger.',
    importance: 'Forms the ulnar border of the palm.',
    movement: 'Contraction spreads little finger away from ring finger.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.36, y: 0.76, z: 0 },
    exercises: []
  },
  {
    name: 'Flexor Digiti Minimi Brevis (Hand)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Hypothenar muscle from hamate to proximal phalanx of little finger.',
    function: 'Flexes the little finger MCP joint.',
    importance: 'Part of hypothenar group for little finger control.',
    movement: 'Contraction flexes the little finger knuckle.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.36, y: 0.76, z: -0.01 },
    exercises: []
  },
  {
    name: 'Opponens Digiti Minimi',
    type: 'muscle',
    category: 'upper_body',
    description: 'Hypothenar muscle from hamate to 5th metacarpal.',
    function: 'Rotates the 5th metacarpal to cup the palm.',
    importance: 'Enables cupping of the palm for grip.',
    movement: 'Contraction cups the palm.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.36, y: 0.75, z: -0.01 },
    exercises: []
  },

  // ==================== HAND MUSCLES - INTERMEDIATE ====================
  {
    name: 'Lumbricals (Hand)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Four small muscles from FDP tendons to extensor expansions of fingers 2-5.',
    function: 'Flex the MCP joints while extending the IP joints (intrinsic plus position).',
    importance: 'Critical for fine motor control. Enable writing grip.',
    movement: 'Contraction flexes knuckles while straightening fingers.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.34, y: 0.72, z: 0.02 },
    exercises: []
  },
  {
    name: 'Palmar Interossei',
    type: 'muscle',
    category: 'upper_body',
    description: 'Three muscles in the palm adducting fingers 2, 4, and 5 toward the middle finger.',
    function: 'Adduct the fingers toward the middle finger, assist in MCP flexion and IP extension.',
    importance: 'Key for bringing fingers together. Essential for precision movements.',
    movement: 'Contraction brings fingers together.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.34, y: 0.73, z: 0.01 },
    exercises: []
  },
  {
    name: 'Dorsal Interossei (Hand)',
    type: 'muscle',
    category: 'upper_body',
    description: 'Four bipennate muscles between the metacarpals abducting fingers 2-4 from midline.',
    function: 'Abduct the fingers from the midline, assist in MCP flexion and IP extension.',
    importance: 'Key for spreading fingers. First dorsal interosseous visible between thumb and index.',
    movement: 'Contraction spreads the fingers.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.34, y: 0.73, z: -0.01 },
    exercises: []
  },
];
