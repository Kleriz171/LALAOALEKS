import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// COMPREHENSIVE ANATOMY DATABASE
// ============================================================================

const MUSCLES = [
  // ==================== CHEST ====================
  {
    name: 'Pectoralis Major',
    type: 'muscle',
    category: 'upper_body',
    description: 'The pectoralis major is a large, fan-shaped muscle that covers the front of the upper chest. It has two heads: the clavicular (upper) head and the sternal (lower) head, which work together for various pushing and hugging movements.',
    function: 'Primary functions include horizontal adduction (bringing the arm across the body), internal rotation of the shoulder, and flexion of the arm. The clavicular head assists in shoulder flexion while the sternal head assists in extension from a flexed position.',
    importance: 'Essential for pushing movements, throwing, and any activity requiring arm movement across the body. A well-developed chest improves posture and provides protection for the rib cage and vital organs.',
    movement: 'During a push-up or bench press, the pectoralis major contracts concentrically to push the weight away. The muscle fibers shorten as they pull the humerus toward the midline of the body.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 1.2, z: 0.15 },
    exercises: [
      { name: 'Barbell Bench Press', rank: 1, description: 'The gold standard for chest development. Allows for maximum loading and targets both heads of the pec major.' },
      { name: 'Incline Dumbbell Press', rank: 2, description: 'Emphasizes the clavicular head for upper chest development with greater range of motion.' },
      { name: 'Cable Crossover', rank: 3, description: 'Provides constant tension throughout the movement, excellent for the squeeze and stretch.' },
      { name: 'Dips', rank: 4, description: 'Compound movement that heavily loads the lower chest when performed with forward lean.' },
      { name: 'Push-Ups', rank: 5, description: 'Bodyweight classic that engages the entire chest with core stabilization.' },
    ]
  },
  {
    name: 'Pectoralis Minor',
    type: 'muscle',
    category: 'upper_body',
    description: 'A thin, triangular muscle located beneath the pectoralis major. It originates from ribs 3-5 and inserts on the coracoid process of the scapula.',
    function: 'Stabilizes the scapula by drawing it forward and downward against the thoracic wall. Also assists in forced inspiration by elevating the ribs when the scapula is fixed.',
    importance: 'Critical for shoulder blade stability and proper posture. Tightness can contribute to rounded shoulders and impingement syndromes.',
    movement: 'During movements like dips or when reaching forward, the pec minor contracts to protract and depress the scapula.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 1.15, z: 0.1 },
    exercises: [
      { name: 'Dips', rank: 1, description: 'Deep dips with scapular protraction heavily engage the pec minor.' },
      { name: 'Serratus Punch', rank: 2, description: 'Pushing movement with extra protraction at the end targets the pec minor.' },
      { name: 'Decline Push-Up Plus', rank: 3, description: 'Push-up with added protraction at the top for pec minor activation.' },
    ]
  },

  // ==================== BACK ====================
  {
    name: 'Latissimus Dorsi',
    type: 'muscle',
    category: 'upper_body',
    description: 'The largest muscle of the back, the "lats" are broad, flat muscles that span from the lower spine and iliac crest to the upper arm. They give the back its characteristic V-shape when well developed.',
    function: 'Primary mover in shoulder adduction, extension, and internal rotation. Also assists in trunk extension and lateral flexion. Critical for pulling movements and climbing.',
    importance: 'Essential for all pulling movements, swimming, climbing, and maintaining good posture. Strong lats protect the spine and improve athletic performance in nearly every sport.',
    movement: 'During a pull-up, the lats contract to pull the elbows down and back, bringing the body up toward the bar. The muscle fibers shorten as they adduct and extend the shoulder.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 1.1, z: -0.15 },
    exercises: [
      { name: 'Pull-Ups', rank: 1, description: 'The king of lat exercises. Bodyweight pulling that maximally activates the entire lat.' },
      { name: 'Barbell Row', rank: 2, description: 'Heavy compound rowing for thickness and strength throughout the back.' },
      { name: 'Lat Pulldown', rank: 3, description: 'Machine variation that allows for controlled, isolated lat work.' },
      { name: 'Single-Arm Dumbbell Row', rank: 4, description: 'Unilateral movement for addressing imbalances and full range of motion.' },
      { name: 'Straight-Arm Pulldown', rank: 5, description: 'Isolation exercise that targets the lats without bicep involvement.' },
    ]
  },
  {
    name: 'Trapezius',
    type: 'muscle',
    category: 'upper_body',
    description: 'A large, triangular muscle extending from the base of the skull to the middle of the back and out to the shoulder blade. It has three distinct regions: upper, middle, and lower fibers.',
    function: 'Upper fibers elevate the scapula (shrugging). Middle fibers retract the scapula (pulling shoulders back). Lower fibers depress the scapula. All portions rotate the scapula upward during arm elevation.',
    importance: 'Critical for shoulder blade control, neck stability, and posture. Weakness leads to rounded shoulders and neck pain. Strong traps protect the cervical spine.',
    movement: 'During a shrug, the upper traps contract to elevate the shoulders. During rows, the middle traps retract the scapula. During overhead pressing, all portions work to rotate the scapula.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 1.4, z: -0.1 },
    exercises: [
      { name: 'Barbell Shrugs', rank: 1, description: 'Direct upper trap work with heavy loading capability.' },
      { name: 'Face Pulls', rank: 2, description: 'Excellent for middle and lower traps with external rotation.' },
      { name: 'Dumbbell Shrugs', rank: 3, description: 'Greater range of motion than barbell variation.' },
      { name: 'Prone Y Raises', rank: 4, description: 'Targets lower traps for scapular depression strength.' },
      { name: 'Farmer\'s Carry', rank: 5, description: 'Functional trap work with grip and core benefits.' },
    ]
  },
  {
    name: 'Rhomboids',
    type: 'muscle',
    category: 'upper_body',
    description: 'Two muscles (rhomboid major and minor) located between the spine and scapula. They run diagonally from the thoracic vertebrae to the medial border of the scapula.',
    function: 'Retract the scapula (pull shoulder blades together), elevate the scapula, and rotate it downward. Work synergistically with middle trapezius.',
    importance: 'Essential for good posture and shoulder blade stability. Weakness contributes to rounded shoulders and scapular winging. Strong rhomboids protect against shoulder injuries.',
    movement: 'During rowing movements, the rhomboids contract to squeeze the shoulder blades together at the end of the pull.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 1.2, z: -0.12 },
    exercises: [
      { name: 'Seated Cable Row', rank: 1, description: 'Allows for full scapular protraction and retraction.' },
      { name: 'Face Pulls', rank: 2, description: 'Excellent rhomboid activation with external rotation.' },
      { name: 'Bent-Over Reverse Fly', rank: 3, description: 'Isolation work for the rhomboids and rear delts.' },
      { name: 'Inverted Rows', rank: 4, description: 'Bodyweight rowing with emphasis on scapular retraction.' },
    ]
  },
  {
    name: 'Erector Spinae',
    type: 'muscle',
    category: 'core',
    description: 'A group of three muscles (iliocostalis, longissimus, spinalis) running along the spine from the sacrum to the skull. They form two columns of muscle on either side of the vertebral column.',
    function: 'Primary function is spinal extension (straightening the back). Also involved in lateral flexion and rotation of the spine. Maintains erect posture against gravity.',
    importance: 'Critical for spinal health, posture, and all lifting activities. Weak erectors lead to back pain and injury risk. Strong erectors protect the spine during heavy lifting.',
    movement: 'During a deadlift, the erector spinae contract isometrically to keep the spine neutral, then concentrically to extend the spine as you stand up.',
    recoveryTime: 72,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.9, z: -0.1 },
    exercises: [
      { name: 'Deadlift', rank: 1, description: 'The ultimate posterior chain exercise, heavily loading the erectors.' },
      { name: 'Back Extension', rank: 2, description: 'Direct spinal extension work for erector strength and endurance.' },
      { name: 'Good Morning', rank: 3, description: 'Hip hinge with significant erector loading and stretch.' },
      { name: 'Romanian Deadlift', rank: 4, description: 'Emphasizes the stretch and isometric hold of the erectors.' },
      { name: 'Bird Dog', rank: 5, description: 'Low-load stability exercise for erector endurance and control.' },
    ]
  },

  // ==================== SHOULDERS ====================
  {
    name: 'Anterior Deltoid',
    type: 'muscle',
    category: 'upper_body',
    description: 'The front portion of the deltoid muscle, originating from the lateral third of the clavicle. It gives the front of the shoulder its rounded appearance.',
    function: 'Primary mover in shoulder flexion (raising arm forward) and horizontal adduction. Assists in internal rotation of the shoulder.',
    importance: 'Essential for pushing movements, throwing, and reaching forward. Overdevelopment relative to rear delts can cause postural imbalances.',
    movement: 'During a front raise or overhead press, the anterior deltoid contracts to flex the shoulder and raise the arm.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.18, y: 1.35, z: 0.05 },
    exercises: [
      { name: 'Overhead Press', rank: 1, description: 'Compound movement that heavily loads the front delts.' },
      { name: 'Arnold Press', rank: 2, description: 'Rotational press that emphasizes anterior delt throughout range.' },
      { name: 'Front Raise', rank: 3, description: 'Isolation exercise for direct anterior delt work.' },
      { name: 'Incline Bench Press', rank: 4, description: 'Chest exercise with significant anterior delt involvement.' },
    ]
  },
  {
    name: 'Lateral Deltoid',
    type: 'muscle',
    category: 'upper_body',
    description: 'The middle portion of the deltoid, originating from the acromion process. This portion gives the shoulder its width and capped appearance.',
    function: 'Primary mover in shoulder abduction (raising arm to the side). Creates the appearance of wide shoulders when developed.',
    importance: 'Critical for shoulder width aesthetics and functional overhead movements. Important for carrying objects away from the body.',
    movement: 'During a lateral raise, the lateral deltoid contracts to abduct the arm, raising it away from the body.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.22, y: 1.35, z: 0 },
    exercises: [
      { name: 'Lateral Raise', rank: 1, description: 'Primary isolation exercise for lateral delt development.' },
      { name: 'Cable Lateral Raise', rank: 2, description: 'Provides constant tension throughout the movement.' },
      { name: 'Upright Row', rank: 3, description: 'Compound movement with significant lateral delt activation.' },
      { name: 'Machine Lateral Raise', rank: 4, description: 'Controlled movement path for targeted lateral delt work.' },
    ]
  },
  {
    name: 'Posterior Deltoid',
    type: 'muscle',
    category: 'upper_body',
    description: 'The rear portion of the deltoid, originating from the spine of the scapula. Often underdeveloped compared to the front and middle portions.',
    function: 'Primary mover in shoulder horizontal abduction and extension. Assists in external rotation of the shoulder.',
    importance: 'Critical for balanced shoulder development and posture. Strong rear delts prevent shoulder injuries and counteract the forward pull of chest and front delt.',
    movement: 'During a reverse fly, the posterior deltoid contracts to pull the arm backward and outward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.18, y: 1.35, z: -0.08 },
    exercises: [
      { name: 'Reverse Fly', rank: 1, description: 'Primary isolation exercise for rear delt development.' },
      { name: 'Face Pulls', rank: 2, description: 'Excellent rear delt and external rotator work.' },
      { name: 'Rear Delt Row', rank: 3, description: 'Row variation targeting the posterior deltoid.' },
      { name: 'Cable Reverse Fly', rank: 4, description: 'Constant tension variation of the reverse fly.' },
    ]
  },

  // ==================== ARMS ====================
  {
    name: 'Biceps Brachii',
    type: 'muscle',
    category: 'upper_body',
    description: 'A two-headed muscle on the front of the upper arm. The long head originates from the supraglenoid tubercle, while the short head originates from the coracoid process. Both insert on the radial tuberosity.',
    function: 'Primary elbow flexor and forearm supinator. Also assists in shoulder flexion due to the long head crossing the shoulder joint.',
    importance: 'Essential for pulling and carrying movements. The biceps play a crucial role in daily activities like lifting groceries, opening doors, and carrying children.',
    movement: 'During a curl, the biceps contracts to flex the elbow and supinate the forearm, bringing the hand toward the shoulder.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.25, y: 1.1, z: 0.05 },
    exercises: [
      { name: 'Barbell Curl', rank: 1, description: 'Classic bicep builder allowing for heavy loading.' },
      { name: 'Incline Dumbbell Curl', rank: 2, description: 'Emphasizes the long head with a stretched starting position.' },
      { name: 'Preacher Curl', rank: 3, description: 'Eliminates momentum for strict bicep isolation.' },
      { name: 'Hammer Curl', rank: 4, description: 'Targets the brachialis and long head of biceps.' },
      { name: 'Concentration Curl', rank: 5, description: 'Maximum isolation for peak contraction.' },
    ]
  },
  {
    name: 'Triceps Brachii',
    type: 'muscle',
    category: 'upper_body',
    description: 'A three-headed muscle on the back of the upper arm. The long head originates from the scapula, while the lateral and medial heads originate from the humerus. All three heads insert on the olecranon of the ulna.',
    function: 'Primary elbow extensor. The long head also assists in shoulder extension and adduction due to crossing the shoulder joint.',
    importance: 'Makes up approximately 2/3 of upper arm mass. Essential for pushing movements and any activity requiring elbow extension.',
    movement: 'During a push-up or press, the triceps contracts to extend the elbow and straighten the arm.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.25, y: 1.1, z: -0.05 },
    exercises: [
      { name: 'Close-Grip Bench Press', rank: 1, description: 'Heavy compound movement for tricep strength and mass.' },
      { name: 'Tricep Dips', rank: 2, description: 'Bodyweight exercise heavily loading all three heads.' },
      { name: 'Skull Crushers', rank: 3, description: 'Emphasizes the long head with overhead arm position.' },
      { name: 'Tricep Pushdown', rank: 4, description: 'Cable isolation for the lateral and medial heads.' },
      { name: 'Overhead Tricep Extension', rank: 5, description: 'Stretches and targets the long head.' },
    ]
  },
  {
    name: 'Brachialis',
    type: 'muscle',
    category: 'upper_body',
    description: 'A muscle located beneath the biceps brachii. It originates from the lower half of the anterior humerus and inserts on the coronoid process of the ulna.',
    function: 'Pure elbow flexor regardless of forearm position. Actually contributes more to elbow flexion strength than the biceps in neutral grip positions.',
    importance: 'Developing the brachialis adds thickness to the upper arm and improves elbow flexion strength. It pushes the biceps up, making the arm appear larger.',
    movement: 'During a hammer curl or reverse curl, the brachialis is the primary flexor as the biceps is placed in a mechanically disadvantaged position.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.24, y: 1.05, z: 0.02 },
    exercises: [
      { name: 'Hammer Curl', rank: 1, description: 'Neutral grip emphasizes brachialis over biceps.' },
      { name: 'Reverse Curl', rank: 2, description: 'Pronated grip maximally activates the brachialis.' },
      { name: 'Cross-Body Hammer Curl', rank: 3, description: 'Variation that emphasizes the brachialis peak.' },
    ]
  },
  {
    name: 'Forearm Flexors',
    type: 'muscle',
    category: 'upper_body',
    description: 'A group of muscles on the anterior forearm including flexor carpi radialis, flexor carpi ulnaris, palmaris longus, and flexor digitorum superficialis. They originate from the medial epicondyle.',
    function: 'Flex the wrist and fingers. Essential for grip strength and any activity requiring holding or grasping.',
    importance: 'Grip strength is often the limiting factor in pulling exercises. Strong forearm flexors improve deadlift, row, and pull-up performance.',
    movement: 'During a wrist curl or when gripping a barbell, the forearm flexors contract to flex the wrist and maintain grip.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.28, y: 0.9, z: 0.03 },
    exercises: [
      { name: 'Wrist Curl', rank: 1, description: 'Direct forearm flexor work for size and strength.' },
      { name: 'Farmer\'s Carry', rank: 2, description: 'Functional grip work with heavy loading.' },
      { name: 'Dead Hang', rank: 3, description: 'Isometric grip endurance and forearm development.' },
      { name: 'Towel Pull-Up', rank: 4, description: 'Grip-intensive pulling for forearm strength.' },
    ]
  },
  {
    name: 'Forearm Extensors',
    type: 'muscle',
    category: 'upper_body',
    description: 'A group of muscles on the posterior forearm including extensor carpi radialis longus/brevis, extensor carpi ulnaris, and extensor digitorum. They originate from the lateral epicondyle.',
    function: 'Extend the wrist and fingers. Stabilize the wrist during gripping activities. Essential for balanced forearm development.',
    importance: 'Balanced forearm development prevents tennis elbow and improves wrist stability. Important for activities requiring wrist extension and stabilization.',
    movement: 'During a reverse wrist curl or when stabilizing the wrist during gripping, the forearm extensors contract.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.28, y: 0.9, z: -0.02 },
    exercises: [
      { name: 'Reverse Wrist Curl', rank: 1, description: 'Direct extensor work for balance and injury prevention.' },
      { name: 'Reverse Curl', rank: 2, description: 'Works extensors isometrically while flexing elbow.' },
      { name: 'Wrist Roller', rank: 3, description: 'Extension motion for extensor development.' },
    ]
  },

  // ==================== CORE ====================
  {
    name: 'Rectus Abdominis',
    type: 'muscle',
    category: 'core',
    description: 'The "six-pack" muscle running vertically from the pubic bone to the sternum and lower ribs. It is divided into segments by tendinous intersections, creating the characteristic blocks when developed.',
    function: 'Primary trunk flexor (brings ribs toward pelvis). Also important for forced expiration, maintaining intra-abdominal pressure, and stabilizing the pelvis during movement.',
    importance: 'Essential for core stability, posture, and spinal protection. Strong rectus abdominis improves performance in nearly all athletic activities and reduces lower back injury risk.',
    movement: 'During a crunch, the rectus abdominis contracts to flex the spine and bring the rib cage toward the pelvis.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 0.95, z: 0.12 },
    exercises: [
      { name: 'Hanging Leg Raise', rank: 1, description: 'Advanced exercise loading the full rectus abdominis.' },
      { name: 'Cable Crunch', rank: 2, description: 'Allows progressive overload for ab development.' },
      { name: 'Ab Wheel Rollout', rank: 3, description: 'Eccentric loading with anti-extension component.' },
      { name: 'Weighted Crunch', rank: 4, description: 'Classic ab exercise with added resistance.' },
      { name: 'Dead Bug', rank: 5, description: 'Anti-extension exercise for core stability.' },
    ]
  },
  {
    name: 'External Obliques',
    type: 'muscle',
    category: 'core',
    description: 'The largest and most superficial of the lateral abdominal muscles. Fibers run diagonally downward and forward from the lower ribs to the iliac crest and linea alba.',
    function: 'Trunk rotation to the opposite side, lateral flexion to the same side, and trunk flexion. Also assists in forced expiration and maintaining intra-abdominal pressure.',
    importance: 'Critical for rotational power in sports, protecting the spine during twisting movements, and creating a tapered waist appearance.',
    movement: 'During a bicycle crunch, the external oblique contracts to rotate the torso, bringing the opposite shoulder toward the hip.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.9, z: 0.1 },
    exercises: [
      { name: 'Woodchop', rank: 1, description: 'Rotational power movement for oblique development.' },
      { name: 'Side Plank', rank: 2, description: 'Isometric lateral core stability.' },
      { name: 'Russian Twist', rank: 3, description: 'Rotational exercise for oblique endurance.' },
      { name: 'Bicycle Crunch', rank: 4, description: 'Combines rotation with flexion for full oblique work.' },
      { name: 'Pallof Press', rank: 5, description: 'Anti-rotation exercise for oblique stability.' },
    ]
  },
  {
    name: 'Internal Obliques',
    type: 'muscle',
    category: 'core',
    description: 'Located beneath the external obliques with fibers running perpendicular to them (upward and forward). They work with the external obliques on the opposite side for rotation.',
    function: 'Trunk rotation to the same side, lateral flexion to the same side, and trunk flexion. Works synergistically with external obliques for powerful rotation.',
    importance: 'Essential for rotational stability and power. Works as a deep stabilizer to protect the spine during complex movements.',
    movement: 'During rotation, the internal oblique on one side contracts along with the external oblique on the opposite side.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.88, z: 0.08 },
    exercises: [
      { name: 'Woodchop', rank: 1, description: 'Full rotational movement engaging both oblique layers.' },
      { name: 'Bird Dog', rank: 2, description: 'Anti-rotation stability for deep core muscles.' },
      { name: 'Side Plank with Rotation', rank: 3, description: 'Combines lateral stability with rotation.' },
    ]
  },
  {
    name: 'Transverse Abdominis',
    type: 'muscle',
    category: 'core',
    description: 'The deepest abdominal muscle, wrapping around the torso like a corset. Fibers run horizontally from the lower ribs and thoracolumbar fascia to the linea alba.',
    function: 'Primary function is to compress the abdominal contents and increase intra-abdominal pressure. Critical stabilizer that activates before any limb movement.',
    importance: 'The most important core stabilizer. Weakness is linked to lower back pain. Proper TVA activation protects the spine during all movements.',
    movement: 'The TVA contracts when you brace your core or draw your belly button toward your spine. It activates anticipatorily before arm or leg movements.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 0.85, z: 0.05 },
    exercises: [
      { name: 'Dead Bug', rank: 1, description: 'Anti-extension exercise requiring TVA bracing.' },
      { name: 'Plank', rank: 2, description: 'Isometric hold requiring TVA activation for stability.' },
      { name: 'Hollow Body Hold', rank: 3, description: 'Advanced TVA exercise with anti-extension.' },
      { name: 'Stomach Vacuum', rank: 4, description: 'Direct TVA activation and control exercise.' },
    ]
  },

  // ==================== LEGS ====================
  {
    name: 'Quadriceps (Rectus Femoris)',
    type: 'muscle',
    category: 'lower_body',
    description: 'The only quad muscle that crosses both the hip and knee. Originates from the anterior inferior iliac spine and inserts via the patellar tendon on the tibial tuberosity.',
    function: 'Extends the knee and flexes the hip. Most active during activities requiring simultaneous hip flexion and knee extension, like kicking or sprinting.',
    importance: 'Critical for walking, running, jumping, and climbing. Essential for athletic performance and daily activities requiring leg strength.',
    movement: 'During a leg extension or the concentric phase of a squat, the rectus femoris contracts to extend the knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.55, z: 0.08 },
    exercises: [
      { name: 'Front Squat', rank: 1, description: 'Upright torso maximizes quad activation.' },
      { name: 'Leg Extension', rank: 2, description: 'Isolation exercise for direct quad work.' },
      { name: 'Sissy Squat', rank: 3, description: 'Advanced bodyweight quad exercise.' },
      { name: 'Bulgarian Split Squat', rank: 4, description: 'Unilateral quad-dominant movement.' },
    ]
  },
  {
    name: 'Quadriceps (Vastus Lateralis)',
    type: 'muscle',
    category: 'lower_body',
    description: 'The largest of the four quadriceps muscles, located on the outer thigh. Originates from the greater trochanter and linea aspera, inserting on the patella.',
    function: 'Pure knee extensor. Provides the bulk of knee extension strength and is most visible from the side view of the thigh.',
    importance: 'Primary muscle for knee extension strength. Critical for walking, running, and all leg-based activities. Creates the outer sweep of the thigh.',
    movement: 'During squats and leg press, the vastus lateralis contracts powerfully to extend the knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.15, y: 0.5, z: 0.05 },
    exercises: [
      { name: 'Back Squat', rank: 1, description: 'Heavy compound movement for overall quad development.' },
      { name: 'Leg Press', rank: 2, description: 'Allows heavy loading with reduced spinal stress.' },
      { name: 'Hack Squat', rank: 3, description: 'Machine squat emphasizing the outer quad.' },
      { name: 'Walking Lunge', rank: 4, description: 'Functional quad work with balance component.' },
    ]
  },
  {
    name: 'Quadriceps (Vastus Medialis)',
    type: 'muscle',
    category: 'lower_body',
    description: 'Located on the inner thigh, forming the teardrop shape above the knee. The VMO (vastus medialis oblique) portion is critical for patellar tracking.',
    function: 'Knee extension with particular importance in the final degrees of extension. Stabilizes the patella and prevents lateral tracking.',
    importance: 'Essential for knee health and stability. Weakness leads to patellofemoral pain and tracking issues. Important for complete quad development.',
    movement: 'The VMO is most active in the final 15 degrees of knee extension, locking out the knee.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.45, z: 0.06 },
    exercises: [
      { name: 'Close-Stance Leg Press', rank: 1, description: 'Foot position emphasizes inner quad.' },
      { name: 'Terminal Knee Extension', rank: 2, description: 'Targets the VMO specifically.' },
      { name: 'Step-Up', rank: 3, description: 'Full range extension for VMO activation.' },
      { name: 'Cyclist Squat', rank: 4, description: 'Heel-elevated squat for VMO emphasis.' },
    ]
  },
  {
    name: 'Quadriceps (Vastus Intermedius)',
    type: 'muscle',
    category: 'lower_body',
    description: 'The deepest of the four quadriceps muscles, lying beneath the rectus femoris. Originates from the anterior and lateral surfaces of the femur.',
    function: 'Pure knee extensor working throughout the full range of motion. Works synergistically with the other vasti.',
    importance: 'Contributes significantly to overall knee extension strength. Though not visible, it adds to thigh thickness and quad power.',
    movement: 'Active throughout knee extension movements, working with the other quadriceps muscles.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.5, z: 0.04 },
    exercises: [
      { name: 'Squat', rank: 1, description: 'Compound movement for all quad muscles.' },
      { name: 'Leg Extension', rank: 2, description: 'Isolation for direct quadriceps work.' },
      { name: 'Leg Press', rank: 3, description: 'Heavy quad loading with full range.' },
    ]
  },
  {
    name: 'Hamstrings (Biceps Femoris)',
    type: 'muscle',
    category: 'lower_body',
    description: 'The lateral hamstring with two heads: the long head originates from the ischial tuberosity, the short head from the linea aspera. Both insert on the fibular head.',
    function: 'Knee flexion and hip extension (long head). Also externally rotates the tibia when the knee is flexed. The short head only performs knee flexion.',
    importance: 'Critical for running speed, jumping, and preventing ACL injuries. Strong hamstrings balance the quadriceps and protect the knee.',
    movement: 'During a leg curl, the biceps femoris contracts to flex the knee. During hip extension, the long head pulls the thigh backward.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 0.5, z: -0.08 },
    exercises: [
      { name: 'Romanian Deadlift', rank: 1, description: 'Emphasizes hip extension with hamstring stretch.' },
      { name: 'Lying Leg Curl', rank: 2, description: 'Isolation for knee flexion portion.' },
      { name: 'Nordic Curl', rank: 3, description: 'Advanced eccentric hamstring exercise.' },
      { name: 'Good Morning', rank: 4, description: 'Hip hinge for hamstring and erector development.' },
    ]
  },
  {
    name: 'Hamstrings (Semitendinosus)',
    type: 'muscle',
    category: 'lower_body',
    description: 'One of the medial hamstrings, named for its long tendon. Originates from the ischial tuberosity and inserts on the medial tibia as part of the pes anserinus.',
    function: 'Knee flexion, hip extension, and internal rotation of the tibia when the knee is flexed. Works with semimembranosus for medial stability.',
    importance: 'Important for knee stability and running mechanics. Often used as a graft source for ACL reconstruction.',
    movement: 'During running, the semitendinosus helps pull the leg back during hip extension and flexes the knee during swing phase.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.5, z: -0.07 },
    exercises: [
      { name: 'Seated Leg Curl', rank: 1, description: 'Hip flexed position emphasizes medial hamstrings.' },
      { name: 'Stiff-Leg Deadlift', rank: 2, description: 'Hip extension with maximum hamstring stretch.' },
      { name: 'Glute Ham Raise', rank: 3, description: 'Combined hip extension and knee flexion.' },
    ]
  },
  {
    name: 'Hamstrings (Semimembranosus)',
    type: 'muscle',
    category: 'lower_body',
    description: 'The deepest of the hamstrings, lying beneath the semitendinosus. Named for its membranous tendon of origin from the ischial tuberosity.',
    function: 'Knee flexion, hip extension, and internal rotation of the tibia. Provides medial knee stability.',
    importance: 'Critical for knee stability, especially during rotation. Works with other hamstrings for powerful hip extension.',
    movement: 'Active during all hip extension and knee flexion movements, working synergistically with other hamstrings.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.48, z: -0.08 },
    exercises: [
      { name: 'Romanian Deadlift', rank: 1, description: 'Hip extension with deep hamstring stretch.' },
      { name: 'Lying Leg Curl', rank: 2, description: 'Knee flexion isolation movement.' },
      { name: 'Single-Leg RDL', rank: 3, description: 'Unilateral hip hinge for balance and strength.' },
    ]
  },
  {
    name: 'Gluteus Maximus',
    type: 'muscle',
    category: 'lower_body',
    description: 'The largest muscle in the human body, forming the bulk of the buttock. Originates from the posterior ilium, sacrum, and coccyx, inserting on the IT band and gluteal tuberosity of the femur.',
    function: 'Primary hip extensor and external rotator. Also performs abduction (upper fibers) and adduction (lower fibers). Critical for powerful movements like sprinting and jumping.',
    importance: 'Essential for posture, athletic performance, and preventing lower back pain. Weak glutes lead to compensation patterns and injuries. The main driver of hip extension power.',
    movement: 'During a hip thrust or the lockout of a deadlift, the glute max contracts powerfully to extend the hip and squeeze at the top.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.7, z: -0.12 },
    exercises: [
      { name: 'Hip Thrust', rank: 1, description: 'Maximum glute activation with peak tension at lockout.' },
      { name: 'Barbell Squat', rank: 2, description: 'Compound movement with significant glute involvement.' },
      { name: 'Romanian Deadlift', rank: 3, description: 'Hip hinge with emphasis on glute stretch and contraction.' },
      { name: 'Bulgarian Split Squat', rank: 4, description: 'Unilateral movement for glute development.' },
      { name: 'Cable Pull-Through', rank: 5, description: 'Hip hinge with constant tension on glutes.' },
    ]
  },
  {
    name: 'Gluteus Medius',
    type: 'muscle',
    category: 'lower_body',
    description: 'A fan-shaped muscle on the outer surface of the pelvis, partially covered by the glute max. Originates from the outer surface of the ilium and inserts on the greater trochanter.',
    function: 'Primary hip abductor. Also performs internal rotation (anterior fibers) and external rotation (posterior fibers). Critical for stabilizing the pelvis during single-leg stance.',
    importance: 'Essential for walking, running, and single-leg balance. Weakness causes hip drop (Trendelenburg sign) and contributes to knee and back pain.',
    movement: 'During walking, the glute med on the stance leg contracts to keep the pelvis level and prevent the opposite hip from dropping.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.15, y: 0.75, z: -0.08 },
    exercises: [
      { name: 'Side-Lying Hip Abduction', rank: 1, description: 'Isolation exercise for glute med activation.' },
      { name: 'Banded Clamshell', rank: 2, description: 'External rotation and abduction for glute med.' },
      { name: 'Single-Leg RDL', rank: 3, description: 'Stability challenge requiring glute med activation.' },
      { name: 'Lateral Band Walk', rank: 4, description: 'Functional glute med work with resistance.' },
    ]
  },
  {
    name: 'Gluteus Minimus',
    type: 'muscle',
    category: 'lower_body',
    description: 'The smallest and deepest of the gluteal muscles, lying beneath the glute med. Originates from the outer surface of the ilium and inserts on the greater trochanter.',
    function: 'Hip abduction and internal rotation. Works synergistically with glute med for pelvic stability during gait.',
    importance: 'Important stabilizer for walking and running. Weakness contributes to hip and knee dysfunction.',
    movement: 'Active during hip abduction and internal rotation, particularly during the stance phase of walking.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 0.73, z: -0.06 },
    exercises: [
      { name: 'Hip Abduction Machine', rank: 1, description: 'Seated abduction for glute min activation.' },
      { name: 'Monster Walk', rank: 2, description: 'Banded walking for deep glute activation.' },
      { name: 'Fire Hydrant', rank: 3, description: 'Abduction and rotation for glute min.' },
    ]
  },
  {
    name: 'Gastrocnemius',
    type: 'muscle',
    category: 'lower_body',
    description: 'The larger, superficial calf muscle with two heads (medial and lateral). Originates from the posterior femoral condyles and inserts via the Achilles tendon on the calcaneus.',
    function: 'Primary plantarflexor of the ankle. Also assists in knee flexion since it crosses both joints. Most active when the knee is straight.',
    importance: 'Essential for walking, running, and jumping. Provides the power for push-off during gait and explosive ankle extension.',
    movement: 'During a calf raise with straight legs, the gastrocnemius contracts to plantarflex the ankle and raise the heel.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.3, z: -0.06 },
    exercises: [
      { name: 'Standing Calf Raise', rank: 1, description: 'Straight-leg position maximizes gastrocnemius activation.' },
      { name: 'Donkey Calf Raise', rank: 2, description: 'Stretched position for maximum gastroc loading.' },
      { name: 'Single-Leg Calf Raise', rank: 3, description: 'Unilateral work for calf development.' },
      { name: 'Jump Rope', rank: 4, description: 'Dynamic calf work with cardiovascular benefits.' },
    ]
  },
  {
    name: 'Soleus',
    type: 'muscle',
    category: 'lower_body',
    description: 'A flat muscle lying beneath the gastrocnemius. Originates from the posterior tibia and fibula, inserting via the Achilles tendon on the calcaneus.',
    function: 'Plantarflexor of the ankle. More active when the knee is bent (seated position). Important postural muscle preventing forward toppling.',
    importance: 'Critical for endurance activities like walking and running. Contains mostly slow-twitch fibers for sustained contractions. Essential for calf fullness.',
    movement: 'During a seated calf raise, the soleus is the primary mover as the bent knee reduces gastrocnemius contribution.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.07, y: 0.25, z: -0.05 },
    exercises: [
      { name: 'Seated Calf Raise', rank: 1, description: 'Bent-knee position isolates the soleus.' },
      { name: 'Single-Leg Seated Calf Raise', rank: 2, description: 'Unilateral soleus work.' },
      { name: 'Calf Press on Leg Press', rank: 3, description: 'Heavy soleus loading with bent knees.' },
    ]
  },
  {
    name: 'Hip Flexors (Iliopsoas)',
    type: 'muscle',
    category: 'lower_body',
    description: 'A combination of the iliacus and psoas major muscles. The psoas originates from the lumbar vertebrae, the iliacus from the iliac fossa. Both insert on the lesser trochanter of the femur.',
    function: 'The most powerful hip flexor. Also assists in external rotation and slight abduction of the thigh. The psoas contributes to lumbar lordosis.',
    importance: 'Critical for walking, running, and any activity requiring hip flexion. Tight hip flexors cause anterior pelvic tilt and lower back pain. Important for athletic performance.',
    movement: 'During leg raises or the swing phase of running, the iliopsoas contracts to flex the hip and bring the thigh forward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.8, z: 0.05 },
    exercises: [
      { name: 'Hanging Leg Raise', rank: 1, description: 'Hip flexion against gravity for strength.' },
      { name: 'Mountain Climber', rank: 2, description: 'Dynamic hip flexion with core stability.' },
      { name: 'Psoas March', rank: 3, description: 'Controlled hip flexion for psoas activation.' },
      { name: 'Standing Knee Raise', rank: 4, description: 'Functional hip flexor strengthening.' },
    ]
  },
  {
    name: 'Adductors',
    type: 'muscle',
    category: 'lower_body',
    description: 'A group of five muscles on the inner thigh: adductor magnus, longus, brevis, gracilis, and pectineus. They originate from the pubis and insert along the medial femur.',
    function: 'Primary hip adductors (bring thigh toward midline). The adductor magnus also assists in hip extension. Important for lateral stability and change of direction.',
    importance: 'Critical for sports involving lateral movement, skating, and kicking. Weakness leads to groin strains and poor hip stability.',
    movement: 'During a sumo deadlift or when bringing the legs together, the adductors contract to adduct the thigh.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.55, z: 0.02 },
    exercises: [
      { name: 'Sumo Deadlift', rank: 1, description: 'Wide stance engages adductors heavily.' },
      { name: 'Copenhagen Plank', rank: 2, description: 'Advanced adductor strength and stability.' },
      { name: 'Cable Hip Adduction', rank: 3, description: 'Isolation exercise for adductor work.' },
      { name: 'Sumo Squat', rank: 4, description: 'Wide stance squat for adductor activation.' },
    ]
  },
  {
    name: 'Tibialis Anterior',
    type: 'muscle',
    category: 'lower_body',
    description: 'A muscle on the front of the shin, running from the lateral tibia to the medial cuneiform and first metatarsal.',
    function: 'Dorsiflexes the ankle (brings toes up) and inverts the foot. Active during the swing phase of gait to clear the toes.',
    importance: 'Prevents foot drop during walking and running. Weakness causes tripping and gait abnormalities. Important for ankle stability.',
    movement: 'During walking, the tibialis anterior contracts during swing phase to dorsiflex the foot and clear the ground.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.25, z: 0.04 },
    exercises: [
      { name: 'Tibialis Raise', rank: 1, description: 'Direct dorsiflexion exercise for tibialis anterior.' },
      { name: 'Tib Bar Raise', rank: 2, description: 'Equipment-based tibialis strengthening.' },
      { name: 'Banded Dorsiflexion', rank: 3, description: 'Resistance band work for ankle dorsiflexors.' },
    ]
  },
];

// ==================== BONES ====================
const BONES = [
  {
    name: 'Skull (Cranium)',
    type: 'bone',
    category: 'skeletal',
    description: 'The bony structure of the head consisting of 22 bones (8 cranial and 14 facial). The cranial bones protect the brain while facial bones form the structure of the face.',
    function: 'Protects the brain, houses and protects sensory organs (eyes, ears, nose), provides attachment for muscles of facial expression and mastication.',
    importance: 'The skull is the most critical protective structure in the body, safeguarding the brain from impact and trauma.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.65, z: 0 },
    exercises: []
  },
  {
    name: 'Cervical Vertebrae (C1-C7)',
    type: 'bone',
    category: 'skeletal',
    description: 'The seven vertebrae of the neck, including the atlas (C1) and axis (C2) which allow head rotation. They are the smallest and most mobile vertebrae.',
    function: 'Supports the head, allows extensive range of motion for the neck, protects the cervical spinal cord, and provides passage for vertebral arteries.',
    importance: 'Critical for head movement and protection of the spinal cord. Injuries here can result in paralysis or death.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.5, z: -0.05 },
    exercises: [
      { name: 'Neck Curl', rank: 1, description: 'Strengthens neck flexors protecting cervical spine.' },
      { name: 'Neck Extension', rank: 2, description: 'Strengthens neck extensors for posture.' },
    ]
  },
  {
    name: 'Thoracic Vertebrae (T1-T12)',
    type: 'bone',
    category: 'skeletal',
    description: 'The twelve vertebrae of the mid-back, each articulating with a pair of ribs. They have limited mobility due to rib attachments.',
    function: 'Provides attachment points for ribs, protects the thoracic spinal cord, supports the ribcage, and allows limited rotation.',
    importance: 'Forms the posterior wall of the thoracic cage protecting vital organs. Good thoracic mobility is essential for overhead movements.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.2, z: -0.08 },
    exercises: [
      { name: 'Thoracic Extension', rank: 1, description: 'Mobility work for thoracic spine.' },
      { name: 'Foam Roll Thoracic Spine', rank: 2, description: 'Self-myofascial release for mobility.' },
    ]
  },
  {
    name: 'Lumbar Vertebrae (L1-L5)',
    type: 'bone',
    category: 'skeletal',
    description: 'The five largest vertebrae in the lower back. They bear most of the body\'s weight and are the most common site of back pain.',
    function: 'Bears the weight of the upper body, allows flexion and extension of the spine, protects the lumbar spinal cord and cauda equina.',
    importance: 'The most stressed region of the spine due to weight-bearing. Proper training of surrounding muscles is critical for protection.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.9, z: -0.08 },
    exercises: [
      { name: 'Deadlift', rank: 1, description: 'Strengthens muscles supporting lumbar spine.' },
      { name: 'Bird Dog', rank: 2, description: 'Core stability protecting lumbar region.' },
    ]
  },
  {
    name: 'Sacrum',
    type: 'bone',
    category: 'skeletal',
    description: 'A triangular bone formed by five fused vertebrae, located at the base of the spine between the hip bones.',
    function: 'Transmits body weight to the pelvis, provides attachment for muscles and ligaments, forms the posterior wall of the pelvis.',
    importance: 'Critical link between the spine and pelvis. The sacroiliac joint is a common source of lower back pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.75, z: -0.1 },
    exercises: []
  },
  {
    name: 'Clavicle (Collarbone)',
    type: 'bone',
    category: 'skeletal',
    description: 'An S-shaped bone connecting the sternum to the scapula. It is the only bony connection between the arm and the axial skeleton.',
    function: 'Acts as a strut to hold the arm away from the body, transmits forces from the upper limb to the axial skeleton, protects underlying neurovascular structures.',
    importance: 'Enables a wide range of shoulder movement. One of the most commonly fractured bones, especially in falls.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.38, z: 0.05 },
    exercises: []
  },
  {
    name: 'Scapula (Shoulder Blade)',
    type: 'bone',
    category: 'skeletal',
    description: 'A flat, triangular bone on the posterior thorax. Contains the glenoid fossa (shoulder socket), acromion, and coracoid process.',
    function: 'Provides attachment for 17 muscles, forms the socket of the shoulder joint, allows for extensive arm movement through its mobility on the ribcage.',
    importance: 'Scapular stability and mobility are critical for healthy shoulder function. Poor scapular control leads to impingement and injury.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 1.25, z: -0.12 },
    exercises: [
      { name: 'Face Pulls', rank: 1, description: 'Strengthens scapular retractors and external rotators.' },
      { name: 'Scapular Push-Ups', rank: 2, description: 'Improves serratus anterior and scapular control.' },
    ]
  },
  {
    name: 'Humerus',
    type: 'bone',
    category: 'skeletal',
    description: 'The single bone of the upper arm, extending from the shoulder to the elbow. Contains the head (articulates with scapula), greater and lesser tubercles, and condyles.',
    function: 'Forms the shoulder and elbow joints, provides attachment for arm and shoulder muscles, transmits forces between shoulder and forearm.',
    importance: 'Essential for all arm movements. Fractures are common and can damage the radial nerve causing wrist drop.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.22, y: 1.15, z: 0 },
    exercises: []
  },
  {
    name: 'Radius',
    type: 'bone',
    category: 'skeletal',
    description: 'The lateral bone of the forearm (thumb side), shorter than the ulna. Allows forearm rotation (pronation/supination).',
    function: 'Primary bone for forearm rotation, articulates with the wrist bones (carpals), bears most of the load transmitted from the hand.',
    importance: 'Essential for wrist and hand function. Distal radius fractures (Colles fracture) are the most common forearm fractures.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.28, y: 0.95, z: 0.02 },
    exercises: []
  },
  {
    name: 'Ulna',
    type: 'bone',
    category: 'skeletal',
    description: 'The medial bone of the forearm (pinky side), forming the point of the elbow (olecranon). Forms the hinge joint at the elbow.',
    function: 'Forms the stable hinge joint of the elbow, provides the axis around which the radius rotates, attachment for forearm muscles.',
    importance: 'Critical for elbow stability and forearm function. The olecranon is vulnerable to direct trauma.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.28, y: 0.95, z: -0.02 },
    exercises: []
  },
  {
    name: 'Pelvis (Hip Bones)',
    type: 'bone',
    category: 'skeletal',
    description: 'A ring of bones consisting of the two hip bones (ilium, ischium, pubis), sacrum, and coccyx. Forms the bony pelvis.',
    function: 'Supports the weight of the upper body, protects pelvic organs, provides attachment for trunk and leg muscles, transmits forces between spine and legs.',
    importance: 'The foundation for posture and movement. Pelvic alignment affects the entire kinetic chain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.75, z: 0 },
    exercises: [
      { name: 'Hip Thrust', rank: 1, description: 'Strengthens glutes for pelvic stability.' },
      { name: 'Deadlift', rank: 2, description: 'Hip hinge strengthening pelvic stabilizers.' },
    ]
  },
  {
    name: 'Femur (Thigh Bone)',
    type: 'bone',
    category: 'skeletal',
    description: 'The longest and strongest bone in the body, forming the thigh. Contains the head (hip joint), neck, greater trochanter, and condyles (knee joint).',
    function: 'Bears body weight, forms the hip and knee joints, provides extensive attachment for thigh muscles, allows bipedal locomotion.',
    importance: 'Critical for walking, running, and all lower body activities. Femoral neck fractures are serious injuries, especially in elderly.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.5, z: 0 },
    exercises: []
  },
  {
    name: 'Patella (Kneecap)',
    type: 'bone',
    category: 'skeletal',
    description: 'A small, triangular sesamoid bone embedded in the quadriceps tendon, located at the front of the knee.',
    function: 'Protects the knee joint, increases the mechanical advantage of the quadriceps by increasing the moment arm, reduces friction.',
    importance: 'Essential for efficient knee extension. Patellar tracking problems cause significant knee pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.4, z: 0.04 },
    exercises: []
  },
  {
    name: 'Tibia (Shin Bone)',
    type: 'bone',
    category: 'skeletal',
    description: 'The larger of the two lower leg bones, bearing most of the body\'s weight. Forms the knee joint above and ankle joint below.',
    function: 'Bears body weight, forms the knee and ankle joints, provides attachment for lower leg muscles.',
    importance: 'Primary weight-bearing bone of the lower leg. Stress fractures are common in runners.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.25, z: 0.02 },
    exercises: []
  },
  {
    name: 'Fibula',
    type: 'bone',
    category: 'skeletal',
    description: 'The smaller, lateral bone of the lower leg. Does not bear significant weight but is important for ankle stability.',
    function: 'Provides attachment for muscles, forms the lateral part of the ankle joint (lateral malleolus), important for ankle stability.',
    importance: 'Critical for ankle stability. Fractures commonly occur with ankle sprains.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.25, z: 0 },
    exercises: []
  },
  {
    name: 'Ribs',
    type: 'bone',
    category: 'skeletal',
    description: 'Twelve pairs of curved bones forming the ribcage. Seven true ribs attach directly to sternum, three false ribs attach indirectly, two floating ribs have no anterior attachment.',
    function: 'Protect heart and lungs, assist in breathing by expanding and contracting, provide attachment for respiratory and trunk muscles.',
    importance: 'Essential protection for vital organs. Rib fractures are painful and can cause breathing complications.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 1.1, z: 0.08 },
    exercises: []
  },
  {
    name: 'Sternum (Breastbone)',
    type: 'bone',
    category: 'skeletal',
    description: 'A flat bone in the center of the chest consisting of three parts: manubrium (top), body, and xiphoid process (bottom).',
    function: 'Protects the heart and major vessels, provides attachment for ribs and clavicle, attachment point for respiratory muscles.',
    importance: 'Central protective structure for the heart. Site for CPR compressions.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.2, z: 0.1 },
    exercises: []
  },
];

// ==================== ORGANS ====================
const ORGANS = [
  {
    name: 'Heart',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A muscular organ about the size of a fist, located in the chest between the lungs. It has four chambers: two atria and two ventricles.',
    function: 'Pumps blood throughout the body, delivering oxygen and nutrients to tissues and removing waste products. Beats approximately 100,000 times per day.',
    importance: 'The central organ of the cardiovascular system. Heart health is directly influenced by exercise - regular cardio strengthens the heart muscle.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.15, z: 0.08 },
    exercises: [
      { name: 'Running', rank: 1, description: 'Aerobic exercise strengthening the heart muscle.' },
      { name: 'Cycling', rank: 2, description: 'Low-impact cardio for heart health.' },
      { name: 'Swimming', rank: 3, description: 'Full-body cardio excellent for heart conditioning.' },
      { name: 'HIIT', rank: 4, description: 'High-intensity intervals improving cardiac output.' },
    ]
  },
  {
    name: 'Lungs',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Paired organs in the chest responsible for gas exchange. The right lung has three lobes, the left has two (to accommodate the heart).',
    function: 'Exchange oxygen and carbon dioxide between air and blood. Contain approximately 300 million alveoli providing a surface area of about 70 square meters.',
    importance: 'Essential for oxygen delivery to working muscles. Lung capacity can be improved with cardiovascular training.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.15, z: 0.05 },
    exercises: [
      { name: 'Swimming', rank: 1, description: 'Breath control improves lung efficiency.' },
      { name: 'Running', rank: 2, description: 'Increases lung capacity and efficiency.' },
      { name: 'Cycling', rank: 3, description: 'Sustained cardio for pulmonary conditioning.' },
    ]
  },
  {
    name: 'Liver',
    type: 'organ',
    category: 'cardiovascular',
    description: 'The largest internal organ, located in the upper right abdomen. Weighs about 1.5 kg and performs over 500 functions.',
    function: 'Metabolizes nutrients, produces bile for fat digestion, stores glycogen, detoxifies blood, produces blood proteins, regulates blood sugar.',
    importance: 'Critical for nutrient metabolism and energy production. Stores glycogen for muscle fuel during exercise. Affected by alcohol and poor nutrition.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.95, z: 0.08 },
    exercises: []
  },
  {
    name: 'Kidneys',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Paired bean-shaped organs in the posterior abdomen. Each kidney contains about one million nephrons for blood filtration.',
    function: 'Filter blood to produce urine, regulate fluid and electrolyte balance, control blood pressure, produce hormones (erythropoietin, vitamin D activation).',
    importance: 'Essential for fluid balance during exercise. Adequate hydration is critical for kidney function, especially during intense training.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.9, z: -0.05 },
    exercises: []
  },
  {
    name: 'Stomach',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A J-shaped muscular organ between the esophagus and small intestine. Can expand to hold 1-1.5 liters of food.',
    function: 'Stores and mixes food with gastric juices, begins protein digestion with pepsin, produces intrinsic factor for B12 absorption.',
    importance: 'First stage of digestion affecting nutrient absorption. Pre-workout nutrition timing is important for stomach comfort during exercise.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 0.95, z: 0.05 },
    exercises: []
  },
  {
    name: 'Small Intestine',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A 6-7 meter long tube consisting of duodenum, jejunum, and ileum. Site of most nutrient absorption.',
    function: 'Digests food with enzymes from pancreas and bile from liver. Absorbs nutrients, vitamins, and minerals into bloodstream.',
    importance: 'Critical for absorbing the protein, carbs, and fats needed for muscle building and energy. Gut health affects overall performance.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.8, z: 0.05 },
    exercises: []
  },
  {
    name: 'Large Intestine (Colon)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'About 1.5 meters long, consisting of cecum, ascending, transverse, descending, and sigmoid colon, and rectum.',
    function: 'Absorbs water and electrolytes, houses gut microbiome, forms and stores feces, produces vitamins K and B through bacterial action.',
    importance: 'Fiber intake and gut microbiome health affect inflammation and overall health. Important for recovery and immune function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.75, z: 0.05 },
    exercises: []
  },
  {
    name: 'Brain',
    type: 'organ',
    category: 'cardiovascular',
    description: 'The control center of the nervous system, weighing about 1.4 kg. Contains approximately 86 billion neurons.',
    function: 'Controls all bodily functions, processes sensory information, enables thought, memory, emotion, motor control, and consciousness.',
    importance: 'Controls muscle activation and coordination. Exercise improves brain health through increased blood flow and neuroplasticity.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.6, z: 0 },
    exercises: [
      { name: 'Aerobic Exercise', rank: 1, description: 'Increases BDNF and promotes neuroplasticity.' },
      { name: 'Coordination Drills', rank: 2, description: 'Challenges the brain with complex movements.' },
    ]
  },
  {
    name: 'Pancreas',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A gland about 15 cm long located behind the stomach. Has both exocrine (digestive enzymes) and endocrine (hormones) functions.',
    function: 'Produces digestive enzymes (amylase, lipase, proteases), secretes insulin and glucagon for blood sugar regulation.',
    importance: 'Insulin regulation is critical for muscle growth and energy. Proper nutrition supports healthy pancreatic function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.9, z: 0.03 },
    exercises: []
  },
  {
    name: 'Spleen',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A fist-sized organ in the upper left abdomen. Acts as a blood filter and reservoir.',
    function: 'Filters blood, removes old red blood cells, stores blood and platelets, produces white blood cells, part of immune system.',
    importance: 'Releases stored red blood cells during exercise. Important for immune function and recovery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 0.95, z: 0 },
    exercises: []
  },
];

// ==================== BLOOD VESSELS ====================
const BLOOD_VESSELS = [
  {
    name: 'Aorta',
    type: 'vein',
    category: 'cardiovascular',
    description: 'The largest artery in the body, originating from the left ventricle. Approximately 30 cm long and 2.5 cm in diameter.',
    function: 'Carries oxygenated blood from the heart to the entire body. Branches into smaller arteries supplying all organs and tissues.',
    importance: 'The main conduit for oxygen-rich blood. Exercise strengthens the cardiovascular system including arterial health.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.1, z: 0.05 },
    exercises: []
  },
  {
    name: 'Vena Cava (Superior & Inferior)',
    type: 'vein',
    category: 'cardiovascular',
    description: 'The two largest veins in the body. Superior vena cava drains upper body, inferior vena cava drains lower body.',
    function: 'Return deoxygenated blood to the right atrium of the heart. Together they return all systemic venous blood.',
    importance: 'Critical for blood return to the heart. Muscle contractions during exercise assist venous return.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.1, z: 0.02 },
    exercises: []
  },
  {
    name: 'Pulmonary Arteries',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Arteries carrying deoxygenated blood from the right ventricle to the lungs. The only arteries carrying deoxygenated blood.',
    function: 'Transport deoxygenated blood to the lungs for gas exchange. Branch into smaller vessels in each lung.',
    importance: 'Part of the pulmonary circulation essential for oxygenation. Cardio training improves efficiency of this system.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.18, z: 0.06 },
    exercises: []
  },
  {
    name: 'Pulmonary Veins',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Four veins (two from each lung) carrying oxygenated blood to the left atrium. The only veins carrying oxygenated blood.',
    function: 'Return oxygenated blood from the lungs to the heart for distribution to the body.',
    importance: 'Complete the pulmonary circuit returning oxygen-rich blood. Exercise increases oxygen uptake efficiency.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.02, y: 1.15, z: 0.04 },
    exercises: []
  },
  {
    name: 'Carotid Arteries',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Major arteries on each side of the neck supplying blood to the brain, face, and neck. Common carotid branches into internal and external.',
    function: 'Supply oxygenated blood to the brain and head structures. Contain baroreceptors for blood pressure regulation.',
    importance: 'Critical brain blood supply. Exercise improves carotid artery health and reduces stroke risk.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 1.45, z: 0.03 },
    exercises: []
  },
  {
    name: 'Jugular Veins',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Major veins draining blood from the head and brain. Internal jugulars are the primary drainage; external jugulars are superficial.',
    function: 'Drain deoxygenated blood from the brain and head back to the heart via the superior vena cava.',
    importance: 'Critical for brain blood drainage. Visible external jugular can indicate cardiac function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 1.45, z: 0 },
    exercises: []
  },
  {
    name: 'Femoral Artery',
    type: 'vein',
    category: 'cardiovascular',
    description: 'The main artery of the thigh, continuing from the external iliac artery. Supplies blood to the entire lower limb.',
    function: 'Provides oxygenated blood to the thigh and lower leg. Important for muscle blood supply during exercise.',
    importance: 'Major blood supply to exercising leg muscles. Pulse can be palpated in the groin area.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.6, z: 0.05 },
    exercises: []
  },
  {
    name: 'Coronary Arteries',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Arteries that supply blood to the heart muscle itself. Left and right coronary arteries branch from the aorta.',
    function: 'Supply oxygenated blood and nutrients to the heart muscle. Critical for heart function.',
    importance: 'Blockage causes heart attacks. Exercise improves coronary artery health and reduces plaque buildup.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.15, z: 0.1 },
    exercises: [
      { name: 'Aerobic Exercise', rank: 1, description: 'Improves coronary artery health and reduces plaque.' },
    ]
  },
];

// ==================== NERVES ====================
const NERVES = [
  {
    name: 'Sciatic Nerve',
    type: 'nerve',
    category: 'core',
    description: 'The largest and longest nerve in the body, running from the lower back through the buttock and down the back of each leg.',
    function: 'Provides motor and sensory function to the posterior thigh, entire leg below the knee, and foot. Controls hamstrings and all muscles below the knee.',
    importance: 'Sciatica (irritation of this nerve) is a common cause of leg pain. Proper form and core strength protect the sciatic nerve.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.6, z: -0.1 },
    exercises: [
      { name: 'Piriformis Stretch', rank: 1, description: 'Relieves pressure on sciatic nerve.' },
      { name: 'Nerve Flossing', rank: 2, description: 'Mobilizes the sciatic nerve.' },
    ]
  },
  {
    name: 'Brachial Plexus',
    type: 'nerve',
    category: 'upper_body',
    description: 'A network of nerves formed by ventral rami of C5-T1 spinal nerves. Located in the neck and armpit region.',
    function: 'Innervates the entire upper limb. Gives rise to musculocutaneous, median, ulnar, radial, and axillary nerves.',
    importance: 'Critical for all arm and hand function. Can be injured in contact sports or falls (stingers/burners).',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.15, y: 1.35, z: 0 },
    exercises: []
  },
  {
    name: 'Median Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'One of the main nerves of the arm, running from the brachial plexus through the arm and forearm to the hand.',
    function: 'Controls most forearm flexors and thenar muscles (thumb). Provides sensation to palm and thumb-side fingers.',
    importance: 'Compression causes carpal tunnel syndrome. Proper wrist positioning during exercises protects this nerve.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.26, y: 1.0, z: 0.02 },
    exercises: [
      { name: 'Median Nerve Glide', rank: 1, description: 'Mobilizes the median nerve through the carpal tunnel.' },
      { name: 'Wrist Stretches', rank: 2, description: 'Maintains flexibility to prevent nerve compression.' },
    ]
  },
  {
    name: 'Ulnar Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'Runs from the brachial plexus along the medial arm, behind the elbow (funny bone), to the hand.',
    function: 'Controls intrinsic hand muscles, provides sensation to the pinky and half of ring finger.',
    importance: 'Compression at the elbow (cubital tunnel) is common. Avoid prolonged elbow flexion during exercises.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.25, y: 1.05, z: -0.02 },
    exercises: [
      { name: 'Ulnar Nerve Glide', rank: 1, description: 'Mobilizes the ulnar nerve through the cubital tunnel.' },
    ]
  },
  {
    name: 'Radial Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'The largest nerve of the brachial plexus, spiraling around the humerus and extending to the hand.',
    function: 'Controls all extensor muscles of the arm, forearm, and hand. Provides sensation to the back of the hand.',
    importance: 'Injury causes wrist drop (inability to extend wrist). Can be compressed against the humerus during sleep.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.24, y: 1.1, z: -0.03 },
    exercises: []
  },
  {
    name: 'Femoral Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'The largest branch of the lumbar plexus (L2-L4), descending through the pelvis to the anterior thigh.',
    function: 'Innervates the quadriceps and sartorius muscles. Provides sensation to the anterior thigh and medial leg.',
    importance: 'Critical for knee extension and walking. Rarely injured due to protected location.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.65, z: 0.04 },
    exercises: []
  },
  {
    name: 'Spinal Cord',
    type: 'nerve',
    category: 'core',
    description: 'The main nerve pathway connecting the brain to the body, running through the vertebral canal from the brainstem to L1-L2.',
    function: 'Transmits motor commands from brain to body and sensory information from body to brain. Contains reflex circuits.',
    importance: 'Protection of the spinal cord is paramount. Proper form during heavy lifting protects the spine and cord.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.1, z: -0.05 },
    exercises: [
      { name: 'Core Stability Work', rank: 1, description: 'Strengthens muscles protecting the spine.' },
      { name: 'Proper Deadlift Form', rank: 2, description: 'Maintains spinal alignment under load.' },
    ]
  },
  {
    name: 'Vagus Nerve',
    type: 'nerve',
    category: 'cardiovascular',
    description: 'The longest cranial nerve, running from the brainstem to the abdomen. Part of the parasympathetic nervous system.',
    function: 'Controls heart rate, digestion, and breathing. Key to the "rest and digest" response. Affects mood and stress response.',
    importance: 'Vagal tone influences recovery. Deep breathing and meditation stimulate the vagus nerve for better recovery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.03, y: 1.3, z: 0.02 },
    exercises: [
      { name: 'Deep Breathing', rank: 1, description: 'Stimulates vagus nerve for relaxation and recovery.' },
      { name: 'Cold Exposure', rank: 2, description: 'Activates the vagus nerve and improves vagal tone.' },
    ]
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedAnatomy() {
  console.log('Starting comprehensive anatomy seed...\n');

  // Clear existing data
  console.log('Clearing existing body parts and exercises...');
  await prisma.exerciseBodyPart.deleteMany({});
  await prisma.bodyPart.deleteMany({});

  // Combine all anatomy data
  const allAnatomy = [...MUSCLES, ...BONES, ...ORGANS, ...BLOOD_VESSELS, ...NERVES];

  console.log(`\nSeeding ${allAnatomy.length} anatomy items...\n`);

  for (const item of allAnatomy) {
    console.log(`Creating: ${item.name} (${item.type})`);

    // Create the body part
    const bodyPart = await prisma.bodyPart.create({
      data: {
        name: item.name,
        type: item.type,
        category: item.category,
        description: item.description,
        function: item.function,
        importance: item.importance,
        movement: (item as any).movement || null,
        recoveryTime: (item as any).recoveryTime || null,
        modelLayer: item.modelLayer,
        position3D: item.position3D,
      },
    });

    // Create exercises if they exist
    if (item.exercises && item.exercises.length > 0) {
      for (const ex of item.exercises) {
        // Check if exercise exists
        let exercise = await prisma.exercise.findFirst({
          where: { name: ex.name },
        });

        // Create exercise if it doesn't exist
        if (!exercise) {
          exercise = await prisma.exercise.create({
            data: {
              name: ex.name,
              category: item.type === 'muscle' ? 'strength' : 'mobility',
              difficulty: 'intermediate',
              equipment: 'varies',
              description: ex.description,
              instructions: ex.description,
              mechanicalLoad: 'Standard loading pattern',
              jointInvolvement: 'Multiple joints involved',
            },
          });
        }

        // Create the relationship
        await prisma.exerciseBodyPart.create({
          data: {
            exerciseId: exercise.id,
            bodyPartId: bodyPart.id,
            activationRank: ex.rank,
            activationRanking: ex.rank,
            activationDescription: ex.description,
          },
        });
      }
    }
  }

  const totalCount = await prisma.bodyPart.count();
  const muscleCount = await prisma.bodyPart.count({ where: { type: 'muscle' } });
  const boneCount = await prisma.bodyPart.count({ where: { type: 'bone' } });
  const organCount = await prisma.bodyPart.count({ where: { type: 'organ' } });
  const veinCount = await prisma.bodyPart.count({ where: { type: 'vein' } });
  const nerveCount = await prisma.bodyPart.count({ where: { type: 'nerve' } });

  console.log('\n========================================');
  console.log('ANATOMY SEED COMPLETE!');
  console.log('========================================');
  console.log(`Total Body Parts: ${totalCount}`);
  console.log(`  - Muscles: ${muscleCount}`);
  console.log(`  - Bones: ${boneCount}`);
  console.log(`  - Organs: ${organCount}`);
  console.log(`  - Blood Vessels: ${veinCount}`);
  console.log(`  - Nerves: ${nerveCount}`);
  console.log('========================================\n');
}

// Run the seed
seedAnatomy()
  .catch((e) => {
    console.error('Error seeding anatomy:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
