// UPPER LIMB BONES (64 bones: 32 per arm)
// Clavicle, Scapula, Humerus, Radius, Ulna, 8 Carpals, 5 Metacarpals, 14 Phalanges

export const UPPER_LIMB_BONES = [
  // ==================== SHOULDER GIRDLE (4) ====================
  {
    name: 'Clavicle (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'S-shaped bone connecting the sternum to the scapula. The only bony connection between the upper limb and axial skeleton.',
    function: 'Acts as a strut holding the arm away from the body, transmits forces from arm to trunk, protects neurovascular structures.',
    importance: 'One of the most commonly fractured bones. Enables wide range of shoulder motion.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 1.38, z: 0.05 },
    exercises: []
  },
  {
    name: 'Clavicle (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'S-shaped bone connecting the sternum to the scapula. The only bony connection between the upper limb and axial skeleton.',
    function: 'Acts as a strut holding the arm away from the body, transmits forces from arm to trunk, protects neurovascular structures.',
    importance: 'One of the most commonly fractured bones. Enables wide range of shoulder motion.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.38, z: 0.05 },
    exercises: []
  },
  {
    name: 'Scapula (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Triangular flat bone on the posterior thorax. Contains the glenoid fossa (shoulder socket), acromion, coracoid process, and spine.',
    function: 'Provides attachment for 17 muscles, forms glenohumeral joint, allows extensive arm movement through its mobility on the ribcage.',
    importance: 'Scapular stability and mobility are critical for shoulder health. Poor control leads to impingement.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.12, y: 1.25, z: -0.12 },
    exercises: [
      { name: 'Scapular Push-Ups', rank: 1, description: 'Improves serratus anterior and scapular control.' },
      { name: 'Face Pulls', rank: 2, description: 'Strengthens scapular retractors.' },
    ]
  },
  {
    name: 'Scapula (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Triangular flat bone on the posterior thorax. Contains the glenoid fossa (shoulder socket), acromion, coracoid process, and spine.',
    function: 'Provides attachment for 17 muscles, forms glenohumeral joint, allows extensive arm movement through its mobility on the ribcage.',
    importance: 'Scapular stability and mobility are critical for shoulder health. Poor control leads to impingement.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 1.25, z: -0.12 },
    exercises: [
      { name: 'Scapular Push-Ups', rank: 1, description: 'Improves serratus anterior and scapular control.' },
      { name: 'Face Pulls', rank: 2, description: 'Strengthens scapular retractors.' },
    ]
  },

  // ==================== ARM BONES (6) ====================
  {
    name: 'Humerus (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'The single bone of the upper arm. Contains the head, greater and lesser tubercles, deltoid tuberosity, and condyles.',
    function: 'Forms the shoulder and elbow joints, provides attachment for arm and shoulder muscles.',
    importance: 'Essential for all arm movements. Fractures can damage the radial nerve causing wrist drop.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.22, y: 1.15, z: 0 },
    exercises: []
  },
  {
    name: 'Humerus (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'The single bone of the upper arm. Contains the head, greater and lesser tubercles, deltoid tuberosity, and condyles.',
    function: 'Forms the shoulder and elbow joints, provides attachment for arm and shoulder muscles.',
    importance: 'Essential for all arm movements. Fractures can damage the radial nerve causing wrist drop.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.22, y: 1.15, z: 0 },
    exercises: []
  },
  {
    name: 'Radius (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'The lateral bone of the forearm (thumb side). Allows forearm rotation (pronation/supination).',
    function: 'Primary bone for forearm rotation, articulates with carpals, bears most load from hand.',
    importance: 'Distal radius fractures are the most common forearm fractures, especially from falls.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.28, y: 0.95, z: 0.02 },
    exercises: []
  },
  {
    name: 'Radius (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'The lateral bone of the forearm (thumb side). Allows forearm rotation (pronation/supination).',
    function: 'Primary bone for forearm rotation, articulates with carpals, bears most load from hand.',
    importance: 'Distal radius fractures are the most common forearm fractures, especially from falls.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.28, y: 0.95, z: 0.02 },
    exercises: []
  },
  {
    name: 'Ulna (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'The medial bone of the forearm (pinky side). Forms the point of the elbow (olecranon).',
    function: 'Forms the stable hinge joint of the elbow, provides axis for radius rotation.',
    importance: 'Critical for elbow stability. The olecranon is vulnerable to direct trauma.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.28, y: 0.95, z: -0.02 },
    exercises: []
  },
  {
    name: 'Ulna (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'The medial bone of the forearm (pinky side). Forms the point of the elbow (olecranon).',
    function: 'Forms the stable hinge joint of the elbow, provides axis for radius rotation.',
    importance: 'Critical for elbow stability. The olecranon is vulnerable to direct trauma.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.28, y: 0.95, z: -0.02 },
    exercises: []
  },

  // ==================== CARPAL BONES - LEFT (8) ====================
  {
    name: 'Scaphoid (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Boat-shaped carpal bone in the proximal row on the thumb side. Largest of the proximal carpals.',
    function: 'Links the proximal and distal carpal rows, key to wrist mobility and stability.',
    importance: 'Most commonly fractured carpal bone. Poor blood supply leads to avascular necrosis risk.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.32, y: 0.82, z: 0.02 },
    exercises: []
  },
  {
    name: 'Lunate (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Moon-shaped carpal bone in the proximal row between scaphoid and triquetrum.',
    function: 'Key to wrist flexion and extension, articulates with radius directly.',
    importance: 'Second most commonly fractured carpal. Kienböck disease (avascular necrosis) affects this bone.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.33, y: 0.82, z: 0 },
    exercises: []
  },
  {
    name: 'Triquetrum (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Pyramidal carpal bone in the proximal row on the ulnar side.',
    function: 'Articulates with pisiform, contributes to wrist ulnar deviation.',
    importance: 'Third most common carpal fracture, usually from direct trauma.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.34, y: 0.82, z: -0.02 },
    exercises: []
  },
  {
    name: 'Pisiform (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Pea-shaped sesamoid bone in the proximal carpal row, located on the palmar surface.',
    function: 'Sesamoid bone in flexor carpi ulnaris tendon, increases mechanical advantage.',
    importance: 'Protects ulnar nerve at Guyon canal. Palpable at base of hypothenar eminence.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.35, y: 0.82, z: 0.01 },
    exercises: []
  },
  {
    name: 'Trapezium (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Distal carpal bone at the base of the thumb. Has a saddle-shaped surface for thumb metacarpal.',
    function: 'Forms the carpometacarpal joint of the thumb allowing opposition.',
    importance: 'Critical for thumb function. Arthritis here (CMC arthritis) is very common.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.32, y: 0.79, z: 0.03 },
    exercises: []
  },
  {
    name: 'Trapezoid (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Smallest carpal bone in the distal row, wedge-shaped.',
    function: 'Articulates with second metacarpal, contributes to wrist stability.',
    importance: 'Rarely fractured due to protected position.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.33, y: 0.79, z: 0.01 },
    exercises: []
  },
  {
    name: 'Capitate (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest carpal bone, located centrally in the distal row with a rounded head.',
    function: 'Keystone of the wrist, articulates with third metacarpal, central axis of wrist motion.',
    importance: 'Central to wrist mechanics. Fractures are uncommon but serious.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.34, y: 0.79, z: 0 },
    exercises: []
  },
  {
    name: 'Hamate (Left)',
    type: 'bone',
    category: 'skeletal',
    description: 'Wedge-shaped carpal bone with a hook-like projection (hamulus) on its palmar surface.',
    function: 'Hook provides attachment for flexor retinaculum, articulates with 4th and 5th metacarpals.',
    importance: 'Hook fractures occur in racket sports. Ulnar nerve passes near the hook.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.35, y: 0.79, z: -0.01 },
    exercises: []
  },

  // ==================== CARPAL BONES - RIGHT (8) ====================
  {
    name: 'Scaphoid (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Boat-shaped carpal bone in the proximal row on the thumb side. Largest of the proximal carpals.',
    function: 'Links the proximal and distal carpal rows, key to wrist mobility and stability.',
    importance: 'Most commonly fractured carpal bone. Poor blood supply leads to avascular necrosis risk.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.32, y: 0.82, z: 0.02 },
    exercises: []
  },
  {
    name: 'Lunate (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Moon-shaped carpal bone in the proximal row between scaphoid and triquetrum.',
    function: 'Key to wrist flexion and extension, articulates with radius directly.',
    importance: 'Second most commonly fractured carpal. Kienböck disease (avascular necrosis) affects this bone.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.33, y: 0.82, z: 0 },
    exercises: []
  },
  {
    name: 'Triquetrum (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Pyramidal carpal bone in the proximal row on the ulnar side.',
    function: 'Articulates with pisiform, contributes to wrist ulnar deviation.',
    importance: 'Third most common carpal fracture, usually from direct trauma.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.34, y: 0.82, z: -0.02 },
    exercises: []
  },
  {
    name: 'Pisiform (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Pea-shaped sesamoid bone in the proximal carpal row, located on the palmar surface.',
    function: 'Sesamoid bone in flexor carpi ulnaris tendon, increases mechanical advantage.',
    importance: 'Protects ulnar nerve at Guyon canal. Palpable at base of hypothenar eminence.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.35, y: 0.82, z: 0.01 },
    exercises: []
  },
  {
    name: 'Trapezium (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Distal carpal bone at the base of the thumb. Has a saddle-shaped surface for thumb metacarpal.',
    function: 'Forms the carpometacarpal joint of the thumb allowing opposition.',
    importance: 'Critical for thumb function. Arthritis here (CMC arthritis) is very common.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.32, y: 0.79, z: 0.03 },
    exercises: []
  },
  {
    name: 'Trapezoid (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Smallest carpal bone in the distal row, wedge-shaped.',
    function: 'Articulates with second metacarpal, contributes to wrist stability.',
    importance: 'Rarely fractured due to protected position.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.33, y: 0.79, z: 0.01 },
    exercises: []
  },
  {
    name: 'Capitate (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Largest carpal bone, located centrally in the distal row with a rounded head.',
    function: 'Keystone of the wrist, articulates with third metacarpal, central axis of wrist motion.',
    importance: 'Central to wrist mechanics. Fractures are uncommon but serious.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.34, y: 0.79, z: 0 },
    exercises: []
  },
  {
    name: 'Hamate (Right)',
    type: 'bone',
    category: 'skeletal',
    description: 'Wedge-shaped carpal bone with a hook-like projection (hamulus) on its palmar surface.',
    function: 'Hook provides attachment for flexor retinaculum, articulates with 4th and 5th metacarpals.',
    importance: 'Hook fractures occur in racket sports. Ulnar nerve passes near the hook.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.35, y: 0.79, z: -0.01 },
    exercises: []
  },

  // ==================== METACARPALS - LEFT (5) ====================
  {
    name: 'First Metacarpal (Left Thumb)',
    type: 'bone',
    category: 'skeletal',
    description: 'Shortest and most mobile metacarpal, forming the thumb ray. Rotated 90° compared to other metacarpals.',
    function: 'Allows thumb opposition essential for grip, articulates with trapezium via saddle joint.',
    importance: 'Critical for hand function. Bennett fracture affects the base.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.31, y: 0.75, z: 0.04 },
    exercises: []
  },
  {
    name: 'Second Metacarpal (Left Index)',
    type: 'bone',
    category: 'skeletal',
    description: 'Longest metacarpal, most firmly attached to the carpal bones.',
    function: 'Most stable metacarpal, primary for pinch grip with thumb.',
    importance: 'Acts as a fixed point for hand mechanics. Fractures disrupt grip.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.33, y: 0.74, z: 0.02 },
    exercises: []
  },
  {
    name: 'Third Metacarpal (Left Middle)',
    type: 'bone',
    category: 'skeletal',
    description: 'Central metacarpal articulating with the capitate. Has a styloid process.',
    function: 'Central axis of the hand, primary for power grip.',
    importance: 'Central to hand alignment and grip mechanics.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.34, y: 0.74, z: 0 },
    exercises: []
  },
  {
    name: 'Fourth Metacarpal (Left Ring)',
    type: 'bone',
    category: 'skeletal',
    description: 'Fourth metacarpal, slightly mobile at the carpometacarpal joint.',
    function: 'Contributes to grip, allows slight cupping of the palm.',
    importance: 'Part of mobile ulnar column of the hand.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.35, y: 0.74, z: -0.02 },
    exercises: []
  },
  {
    name: 'Fifth Metacarpal (Left Little)',
    type: 'bone',
    category: 'skeletal',
    description: 'Most ulnar metacarpal, most mobile at the CMC joint. Common fracture site (boxer\'s fracture).',
    function: 'Allows palm cupping for grip, contributes to power grip.',
    importance: 'Boxer\'s fracture at the neck is very common from punching.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.36, y: 0.74, z: -0.03 },
    exercises: []
  },

  // ==================== METACARPALS - RIGHT (5) ====================
  {
    name: 'First Metacarpal (Right Thumb)',
    type: 'bone',
    category: 'skeletal',
    description: 'Shortest and most mobile metacarpal, forming the thumb ray. Rotated 90° compared to other metacarpals.',
    function: 'Allows thumb opposition essential for grip, articulates with trapezium via saddle joint.',
    importance: 'Critical for hand function. Bennett fracture affects the base.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.31, y: 0.75, z: 0.04 },
    exercises: []
  },
  {
    name: 'Second Metacarpal (Right Index)',
    type: 'bone',
    category: 'skeletal',
    description: 'Longest metacarpal, most firmly attached to the carpal bones.',
    function: 'Most stable metacarpal, primary for pinch grip with thumb.',
    importance: 'Acts as a fixed point for hand mechanics. Fractures disrupt grip.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.33, y: 0.74, z: 0.02 },
    exercises: []
  },
  {
    name: 'Third Metacarpal (Right Middle)',
    type: 'bone',
    category: 'skeletal',
    description: 'Central metacarpal articulating with the capitate. Has a styloid process.',
    function: 'Central axis of the hand, primary for power grip.',
    importance: 'Central to hand alignment and grip mechanics.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.34, y: 0.74, z: 0 },
    exercises: []
  },
  {
    name: 'Fourth Metacarpal (Right Ring)',
    type: 'bone',
    category: 'skeletal',
    description: 'Fourth metacarpal, slightly mobile at the carpometacarpal joint.',
    function: 'Contributes to grip, allows slight cupping of the palm.',
    importance: 'Part of mobile ulnar column of the hand.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.35, y: 0.74, z: -0.02 },
    exercises: []
  },
  {
    name: 'Fifth Metacarpal (Right Little)',
    type: 'bone',
    category: 'skeletal',
    description: 'Most ulnar metacarpal, most mobile at the CMC joint. Common fracture site (boxer\'s fracture).',
    function: 'Allows palm cupping for grip, contributes to power grip.',
    importance: 'Boxer\'s fracture at the neck is very common from punching.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.36, y: 0.74, z: -0.03 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT THUMB (2) ====================
  {
    name: 'Proximal Phalanx - Left Thumb',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the thumb, larger than other proximal phalanges.',
    function: 'Flexion and extension of thumb, critical for grip and pinch.',
    importance: 'Essential for thumb function in gripping and manipulation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.3, y: 0.7, z: 0.05 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left Thumb',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the thumb with a tuft for soft tissue attachment.',
    function: 'Tip of thumb for fine manipulation and pinch.',
    importance: 'Critical for fine motor control and sensation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.29, y: 0.66, z: 0.06 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT INDEX (3) ====================
  {
    name: 'Proximal Phalanx - Left Index',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the index finger, articulating with second metacarpal.',
    function: 'Primary flexion at MCP joint, extension and fine motor control.',
    importance: 'Essential for pointing, pinch grip, and fine manipulation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.33, y: 0.68, z: 0.02 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left Index',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the index finger at the PIP joint.',
    function: 'Flexion at PIP joint, critical for grip closure.',
    importance: 'PIP joint most important for grip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.33, y: 0.64, z: 0.02 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left Index',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the index finger with nail bed.',
    function: 'Fine motor control, tip pinch, sensation.',
    importance: 'Critical for fine manipulation and touch.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.33, y: 0.6, z: 0.02 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT MIDDLE (3) ====================
  {
    name: 'Proximal Phalanx - Left Middle',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the middle finger, longest proximal phalanx.',
    function: 'Primary flexion at MCP joint, power grip contribution.',
    importance: 'Central digit for grip strength.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.34, y: 0.68, z: 0 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left Middle',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the middle finger.',
    function: 'Flexion at PIP joint for grip.',
    importance: 'Essential for power grip closure.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.34, y: 0.63, z: 0 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left Middle',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the middle finger.',
    function: 'Fine motor control and sensation.',
    importance: 'Critical for fingertip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.34, y: 0.58, z: 0 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT RING (3) ====================
  {
    name: 'Proximal Phalanx - Left Ring',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the ring finger.',
    function: 'Flexion at MCP joint, grip contribution.',
    importance: 'Part of power grip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.35, y: 0.68, z: -0.02 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left Ring',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the ring finger.',
    function: 'Flexion at PIP joint.',
    importance: 'Essential for grip closure.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.35, y: 0.64, z: -0.02 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left Ring',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the ring finger.',
    function: 'Fine motor control and sensation.',
    importance: 'Fingertip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.35, y: 0.6, z: -0.02 },
    exercises: []
  },

  // ==================== PHALANGES - LEFT LITTLE (3) ====================
  {
    name: 'Proximal Phalanx - Left Little',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the little finger, smallest proximal phalanx.',
    function: 'Flexion at MCP joint, grip support.',
    importance: 'Contributes to grip strength and hand span.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.36, y: 0.68, z: -0.04 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Left Little',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the little finger.',
    function: 'Flexion at PIP joint.',
    importance: 'Grip contribution.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.36, y: 0.64, z: -0.04 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Left Little',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the little finger.',
    function: 'Fine motor control.',
    importance: 'Fingertip sensation and function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.36, y: 0.6, z: -0.04 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT THUMB (2) ====================
  {
    name: 'Proximal Phalanx - Right Thumb',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the thumb, larger than other proximal phalanges.',
    function: 'Flexion and extension of thumb, critical for grip and pinch.',
    importance: 'Essential for thumb function in gripping and manipulation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.3, y: 0.7, z: 0.05 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right Thumb',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the thumb with a tuft for soft tissue attachment.',
    function: 'Tip of thumb for fine manipulation and pinch.',
    importance: 'Critical for fine motor control and sensation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.29, y: 0.66, z: 0.06 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT INDEX (3) ====================
  {
    name: 'Proximal Phalanx - Right Index',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the index finger.',
    function: 'Primary flexion at MCP joint, fine motor control.',
    importance: 'Essential for pointing and pinch grip.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.33, y: 0.68, z: 0.02 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right Index',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the index finger.',
    function: 'Flexion at PIP joint.',
    importance: 'PIP joint critical for grip.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.33, y: 0.64, z: 0.02 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right Index',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the index finger.',
    function: 'Fine motor control and sensation.',
    importance: 'Critical for fine manipulation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.33, y: 0.6, z: 0.02 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT MIDDLE (3) ====================
  {
    name: 'Proximal Phalanx - Right Middle',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the middle finger.',
    function: 'Primary flexion at MCP joint.',
    importance: 'Central digit for grip.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.34, y: 0.68, z: 0 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right Middle',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the middle finger.',
    function: 'Flexion at PIP joint.',
    importance: 'Essential for grip closure.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.34, y: 0.63, z: 0 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right Middle',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the middle finger.',
    function: 'Fine motor control.',
    importance: 'Fingertip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.34, y: 0.58, z: 0 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT RING (3) ====================
  {
    name: 'Proximal Phalanx - Right Ring',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the ring finger.',
    function: 'Flexion at MCP joint.',
    importance: 'Part of power grip.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.35, y: 0.68, z: -0.02 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right Ring',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the ring finger.',
    function: 'Flexion at PIP joint.',
    importance: 'Grip closure.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.35, y: 0.64, z: -0.02 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right Ring',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the ring finger.',
    function: 'Fine motor control.',
    importance: 'Fingertip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.35, y: 0.6, z: -0.02 },
    exercises: []
  },

  // ==================== PHALANGES - RIGHT LITTLE (3) ====================
  {
    name: 'Proximal Phalanx - Right Little',
    type: 'bone',
    category: 'skeletal',
    description: 'First phalanx of the little finger.',
    function: 'Flexion at MCP joint.',
    importance: 'Grip support.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.36, y: 0.68, z: -0.04 },
    exercises: []
  },
  {
    name: 'Middle Phalanx - Right Little',
    type: 'bone',
    category: 'skeletal',
    description: 'Middle phalanx of the little finger.',
    function: 'Flexion at PIP joint.',
    importance: 'Grip contribution.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.36, y: 0.64, z: -0.04 },
    exercises: []
  },
  {
    name: 'Distal Phalanx - Right Little',
    type: 'bone',
    category: 'skeletal',
    description: 'Terminal phalanx of the little finger.',
    function: 'Fine motor control.',
    importance: 'Fingertip function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.36, y: 0.6, z: -0.04 },
    exercises: []
  },
];
