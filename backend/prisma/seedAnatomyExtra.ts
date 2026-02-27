import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// ADDITIONAL ANATOMY - EXPANDING THE DATABASE
// ============================================================================

const ADDITIONAL_MUSCLES = [
  // ==================== NECK ====================
  {
    name: 'Sternocleidomastoid',
    type: 'muscle',
    category: 'upper_body',
    description: 'A prominent muscle on each side of the neck that runs from the sternum and clavicle to the mastoid process behind the ear. Creates the "V" shape visible at the front of the neck.',
    function: 'Rotates the head to the opposite side, flexes the neck (both sides together), tilts the head to the same side. Important for head positioning and neck movement.',
    importance: 'Critical for head movement and posture. Often tight from phone/computer use. Training helps prevent neck pain and improves posture.',
    movement: 'When you turn your head to look over your shoulder, the opposite SCM contracts to rotate your head.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 1.48, z: 0.04 },
    exercises: [
      { name: 'Neck Rotation', rank: 1, description: 'Controlled rotation against resistance for SCM strength.' },
      { name: 'Neck Lateral Flexion', rank: 2, description: 'Side bending for SCM and scalene development.' },
    ]
  },
  {
    name: 'Scalenes',
    type: 'muscle',
    category: 'upper_body',
    description: 'Three muscles (anterior, middle, posterior) on each side of the neck running from cervical vertebrae to the first two ribs.',
    function: 'Elevate the first two ribs during forced inspiration, flex and rotate the neck. Important accessory breathing muscles.',
    importance: 'Often tight and can compress the brachial plexus causing thoracic outlet syndrome. Proper stretching and posture are essential.',
    movement: 'During deep breathing, the scalenes contract to lift the upper ribs and expand the chest cavity.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.05, y: 1.45, z: 0.02 },
    exercises: [
      { name: 'Scalene Stretch', rank: 1, description: 'Lateral neck stretch with depression of the shoulder.' },
    ]
  },
  {
    name: 'Levator Scapulae',
    type: 'muscle',
    category: 'upper_body',
    description: 'A muscle on the back and side of the neck running from the upper cervical vertebrae to the superior angle of the scapula.',
    function: 'Elevates the scapula and tilts its glenoid cavity inferiorly by rotating the scapula. Assists in neck lateral flexion.',
    importance: 'Common site of tension and trigger points causing neck and shoulder pain. Often tight from stress and poor posture.',
    movement: 'When you shrug your shoulders, the levator scapulae contracts along with the upper trapezius to elevate the scapula.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 1.42, z: -0.03 },
    exercises: [
      { name: 'Levator Scapulae Stretch', rank: 1, description: 'Look down and to the side with gentle overpressure.' },
      { name: 'Shrugs', rank: 2, description: 'Strengthens the levator along with upper trapezius.' },
    ]
  },

  // ==================== ROTATOR CUFF ====================
  {
    name: 'Supraspinatus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Located above the spine of the scapula, running from the supraspinous fossa to the greater tubercle of the humerus. Part of the rotator cuff.',
    function: 'Initiates shoulder abduction (first 15 degrees), stabilizes the humeral head in the glenoid fossa during all shoulder movements.',
    importance: 'Most commonly injured rotator cuff muscle. Supraspinatus tears and tendinitis are leading causes of shoulder pain.',
    movement: 'When you start to raise your arm to the side, the supraspinatus initiates the movement before the deltoid takes over.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 1.38, z: -0.08 },
    exercises: [
      { name: 'Empty Can Exercise', rank: 1, description: 'Isolation exercise for supraspinatus strengthening.' },
      { name: 'Full Can Exercise', rank: 2, description: 'Safer alternative with external rotation.' },
      { name: 'Cable Abduction', rank: 3, description: 'Resisted abduction for supraspinatus.' },
    ]
  },
  {
    name: 'Infraspinatus',
    type: 'muscle',
    category: 'upper_body',
    description: 'Located below the spine of the scapula, covering the infraspinous fossa. Second largest rotator cuff muscle.',
    function: 'Primary external rotator of the shoulder, stabilizes the humeral head. Works with teres minor for external rotation.',
    importance: 'Critical for shoulder health and throwing sports. Weakness leads to internal rotation dominance and impingement.',
    movement: 'When you rotate your arm outward (like cocking back to throw), the infraspinatus is the primary mover.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 1.28, z: -0.1 },
    exercises: [
      { name: 'Side-Lying External Rotation', rank: 1, description: 'Isolated external rotation for infraspinatus.' },
      { name: 'Cable External Rotation', rank: 2, description: 'Standing external rotation with resistance.' },
      { name: 'Face Pulls', rank: 3, description: 'Compound movement including external rotation.' },
    ]
  },
  {
    name: 'Teres Minor',
    type: 'muscle',
    category: 'upper_body',
    description: 'A small muscle running from the lateral border of the scapula to the greater tubercle of the humerus, just below the infraspinatus.',
    function: 'External rotation and adduction of the shoulder. Works synergistically with infraspinatus for external rotation.',
    importance: 'Part of the rotator cuff providing posterior stability. Often overlooked but essential for balanced shoulder function.',
    movement: 'Assists infraspinatus during external rotation movements and helps stabilize the shoulder during pulling.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 1.25, z: -0.09 },
    exercises: [
      { name: 'External Rotation', rank: 1, description: 'Any external rotation exercise targets teres minor.' },
      { name: 'Prone Y-T-W Raises', rank: 2, description: 'Scapular stability including teres minor activation.' },
    ]
  },
  {
    name: 'Subscapularis',
    type: 'muscle',
    category: 'upper_body',
    description: 'The largest rotator cuff muscle, located on the anterior surface of the scapula (subscapular fossa), between the scapula and ribcage.',
    function: 'Primary internal rotator of the shoulder, stabilizes the humeral head anteriorly. Prevents anterior dislocation.',
    importance: 'Often tight and shortened from desk work. Balance with external rotators is critical for shoulder health.',
    movement: 'When you rotate your arm inward (like reaching behind your back), the subscapularis is the primary mover.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 1.28, z: 0.02 },
    exercises: [
      { name: 'Internal Rotation', rank: 1, description: 'Resisted internal rotation for subscapularis.' },
      { name: 'Subscapularis Stretch', rank: 2, description: 'Sleeper stretch or doorway stretch.' },
    ]
  },
  {
    name: 'Teres Major',
    type: 'muscle',
    category: 'upper_body',
    description: 'A thick muscle running from the inferior angle of the scapula to the humerus. Often called "lat\'s little helper" due to similar function.',
    function: 'Adduction, internal rotation, and extension of the shoulder. Works synergistically with latissimus dorsi.',
    importance: 'Contributes to back width and pulling strength. Often activated along with the lats during rowing and pulling movements.',
    movement: 'During a lat pulldown, teres major assists the lats in pulling the arms down and back.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.15, y: 1.2, z: -0.08 },
    exercises: [
      { name: 'Lat Pulldown', rank: 1, description: 'Compound pulling engaging teres major.' },
      { name: 'Straight-Arm Pulldown', rank: 2, description: 'Isolation for lats and teres major.' },
      { name: 'Pull-Ups', rank: 3, description: 'Bodyweight pulling for teres major development.' },
    ]
  },

  // ==================== CHEST ADDITIONAL ====================
  {
    name: 'Serratus Anterior',
    type: 'muscle',
    category: 'upper_body',
    description: 'A fan-shaped muscle on the lateral ribcage with a serrated (saw-tooth) appearance. Runs from ribs 1-9 to the medial border of the scapula.',
    function: 'Protracts the scapula (moves it forward), rotates the scapula upward for overhead reaching, holds scapula against the ribcage.',
    importance: 'Known as the "boxer\'s muscle" for its role in punching. Weakness causes scapular winging and limits overhead movement.',
    movement: 'During a punch or push-up plus, the serratus anterior protracts the scapula, reaching the arm further forward.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.15, y: 1.1, z: 0.08 },
    exercises: [
      { name: 'Push-Up Plus', rank: 1, description: 'Push-up with extra protraction at the top.' },
      { name: 'Serratus Punch', rank: 2, description: 'Punching motion with focus on protraction.' },
      { name: 'Wall Slides', rank: 3, description: 'Upward rotation and protraction drill.' },
    ]
  },

  // ==================== ARM ADDITIONAL ====================
  {
    name: 'Coracobrachialis',
    type: 'muscle',
    category: 'upper_body',
    description: 'A small muscle in the upper arm running from the coracoid process of the scapula to the mid-humerus, deep to the biceps.',
    function: 'Flexion and adduction of the shoulder. Assists in bringing the arm forward and toward the body.',
    importance: 'Often overlooked but contributes to shoulder stability and arm movement. Can be irritated by repetitive overhead activities.',
    movement: 'When you bring your arm across your body toward the opposite shoulder, coracobrachialis assists in this movement.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.18, y: 1.2, z: 0.03 },
    exercises: [
      { name: 'Dumbbell Flyes', rank: 1, description: 'Horizontal adduction activating coracobrachialis.' },
      { name: 'Cable Crossover', rank: 2, description: 'Adduction with resistance.' },
    ]
  },
  {
    name: 'Anconeus',
    type: 'muscle',
    category: 'upper_body',
    description: 'A small triangular muscle on the back of the elbow, spanning from the lateral epicondyle of the humerus to the olecranon.',
    function: 'Assists triceps in elbow extension, stabilizes the elbow joint during pronation and supination.',
    importance: 'Small but important stabilizer of the elbow. Works during all elbow extension movements.',
    movement: 'Active during elbow extension, particularly in the final degrees of straightening the arm.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.24, y: 1.0, z: -0.03 },
    exercises: [
      { name: 'Tricep Extension', rank: 1, description: 'Any tricep extension also works the anconeus.' },
    ]
  },
  {
    name: 'Pronator Teres',
    type: 'muscle',
    category: 'upper_body',
    description: 'A muscle in the forearm running from the medial epicondyle and coronoid process to the lateral radius.',
    function: 'Pronates the forearm (turns palm down) and assists in elbow flexion.',
    importance: 'Important for activities requiring forearm rotation. Can compress the median nerve (pronator syndrome).',
    movement: 'When you turn your palm from facing up to facing down, pronator teres is the primary mover.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.26, y: 0.98, z: 0.02 },
    exercises: [
      { name: 'Pronation Exercise', rank: 1, description: 'Resisted forearm pronation.' },
    ]
  },
  {
    name: 'Supinator',
    type: 'muscle',
    category: 'upper_body',
    description: 'A muscle wrapped around the upper radius, deep in the forearm. Runs from the lateral epicondyle and ulna to the radius.',
    function: 'Supinates the forearm (turns palm up), especially when the elbow is extended.',
    importance: 'Works with biceps for supination. Important for activities like using a screwdriver or turning a doorknob.',
    movement: 'When your elbow is straight and you turn your palm up, the supinator does this without biceps assistance.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.27, y: 0.95, z: -0.01 },
    exercises: [
      { name: 'Supination Exercise', rank: 1, description: 'Resisted forearm supination.' },
      { name: 'Hammer Curl to Supination', rank: 2, description: 'Curl with supination at the top.' },
    ]
  },

  // ==================== CORE ADDITIONAL ====================
  {
    name: 'Quadratus Lumborum',
    type: 'muscle',
    category: 'core',
    description: 'A deep muscle in the lower back running from the iliac crest to the 12th rib and lumbar vertebrae. Forms the posterior abdominal wall.',
    function: 'Lateral flexion of the spine, elevates the hip, extends the lumbar spine. Stabilizes the pelvis and lower back.',
    importance: 'Common source of lower back pain when tight or strained. Important for core stability and preventing lateral pelvic drop.',
    movement: 'When you bend to one side, the QL on that side contracts concentrically while the opposite QL controls the movement eccentrically.',
    recoveryTime: 48,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.85, z: -0.08 },
    exercises: [
      { name: 'Side Plank', rank: 1, description: 'Isometric hold challenging the QL.' },
      { name: 'Suitcase Carry', rank: 2, description: 'Unilateral carry for QL stabilization.' },
      { name: 'Side Bend', rank: 3, description: 'Lateral flexion for QL strengthening.' },
    ]
  },
  {
    name: 'Multifidus',
    type: 'muscle',
    category: 'core',
    description: 'Deep spinal muscles running along the entire length of the spine, with fibers spanning 2-4 vertebral levels.',
    function: 'Stabilizes individual vertebral segments, extends and rotates the spine. Critical for spinal stability.',
    importance: 'Often atrophied in people with low back pain. Proper activation is essential for spine health and injury prevention.',
    movement: 'The multifidus contracts to stabilize the spine before any limb movement, providing segmental control.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.03, y: 1.0, z: -0.1 },
    exercises: [
      { name: 'Bird Dog', rank: 1, description: 'Segmental stability exercise for multifidus.' },
      { name: 'Prone Back Extension', rank: 2, description: 'Controlled extension for multifidus activation.' },
      { name: 'Quadruped Arm/Leg Reach', rank: 3, description: 'Anti-rotation stability for deep spine muscles.' },
    ]
  },
  {
    name: 'Diaphragm',
    type: 'muscle',
    category: 'core',
    description: 'A dome-shaped muscle separating the thoracic and abdominal cavities. The primary muscle of respiration.',
    function: 'Contracts to create negative pressure in the chest, drawing air into the lungs. Also stabilizes the core by increasing intra-abdominal pressure.',
    importance: 'Proper diaphragmatic breathing is essential for core stability, stress management, and efficient oxygen exchange.',
    movement: 'During inhalation, the diaphragm flattens and descends, expanding the chest cavity and drawing air in.',
    recoveryTime: 12,
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.0, z: 0 },
    exercises: [
      { name: 'Diaphragmatic Breathing', rank: 1, description: '360-degree breathing for proper diaphragm function.' },
      { name: 'Dead Bug with Breathing', rank: 2, description: 'Core stability with breath control.' },
      { name: 'Crocodile Breathing', rank: 3, description: 'Prone breathing drill for diaphragm.' },
    ]
  },
  {
    name: 'Pelvic Floor Muscles',
    type: 'muscle',
    category: 'core',
    description: 'A group of muscles forming a sling at the base of the pelvis, including levator ani and coccygeus.',
    function: 'Support pelvic organs, control urination and defecation, contribute to core stability and sexual function.',
    importance: 'Essential for core pressure regulation and preventing incontinence. Often weakened by pregnancy or neglected in training.',
    movement: 'The pelvic floor contracts during heavy lifting to support the abdominal contents and assist in force transmission.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0, y: 0.7, z: 0 },
    exercises: [
      { name: 'Kegel Exercises', rank: 1, description: 'Isolated pelvic floor contractions.' },
      { name: 'Bridge with Squeeze', rank: 2, description: 'Hip extension with pelvic floor engagement.' },
    ]
  },

  // ==================== HIP ADDITIONAL ====================
  {
    name: 'Piriformis',
    type: 'muscle',
    category: 'lower_body',
    description: 'A small, deep muscle in the buttock running from the sacrum to the greater trochanter. The sciatic nerve passes near or through it.',
    function: 'External rotation of the hip (when hip is extended), abduction (when hip is flexed), stabilizes the hip joint.',
    importance: 'Can compress the sciatic nerve when tight (piriformis syndrome). Important for hip mobility and stability.',
    movement: 'When you externally rotate your hip (turn your knee outward), the piriformis is one of the primary movers.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.72, z: -0.08 },
    exercises: [
      { name: 'Piriformis Stretch', rank: 1, description: 'Figure-4 stretch for piriformis flexibility.' },
      { name: 'Clamshell', rank: 2, description: 'External rotation strengthening.' },
      { name: 'Seated External Rotation', rank: 3, description: 'Resisted external rotation.' },
    ]
  },
  {
    name: 'Tensor Fasciae Latae (TFL)',
    type: 'muscle',
    category: 'lower_body',
    description: 'A small muscle on the outer hip running from the iliac crest to the IT band. Despite its size, it has significant influence on hip and knee.',
    function: 'Hip flexion, abduction, and internal rotation. Tenses the IT band to stabilize the knee.',
    importance: 'Often overactive and tight, compensating for weak glutes. Can contribute to IT band syndrome and knee pain.',
    movement: 'During walking, TFL helps flex and internally rotate the hip during swing phase.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.14, y: 0.75, z: 0.05 },
    exercises: [
      { name: 'TFL Stretch', rank: 1, description: 'Standing or side-lying stretch for the TFL.' },
      { name: 'Hip Flexor Stretch', rank: 2, description: 'Kneeling stretch including the TFL.' },
    ]
  },
  {
    name: 'Sartorius',
    type: 'muscle',
    category: 'lower_body',
    description: 'The longest muscle in the body, running diagonally from the ASIS to the medial tibia. Known as the "tailor\'s muscle."',
    function: 'Flexes, abducts, and externally rotates the hip; flexes the knee. Allows the cross-legged sitting position.',
    importance: 'Contributes to hip and knee movement. Often tight in runners and can contribute to knee pain.',
    movement: 'When you cross your legs while sitting, the sartorius performs all its actions simultaneously.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.6, z: 0.06 },
    exercises: [
      { name: 'Hip Flexor Stretch', rank: 1, description: 'Stretches the sartorius along with psoas.' },
      { name: 'Leg Raises', rank: 2, description: 'Hip flexion activating the sartorius.' },
    ]
  },
  {
    name: 'Gracilis',
    type: 'muscle',
    category: 'lower_body',
    description: 'A thin, flat muscle on the inner thigh running from the pubis to the medial tibia. The most superficial adductor.',
    function: 'Adducts the hip, flexes and internally rotates the knee. The only adductor crossing both hip and knee.',
    importance: 'Important for hip adduction and knee stability. Used as a graft source for ACL reconstruction.',
    movement: 'During the breaststroke kick in swimming, the gracilis helps bring the legs together.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.06, y: 0.5, z: 0.04 },
    exercises: [
      { name: 'Adductor Stretch', rank: 1, description: 'Butterfly or side lunge stretch.' },
      { name: 'Cable Adduction', rank: 2, description: 'Resisted hip adduction.' },
    ]
  },
  {
    name: 'Pectineus',
    type: 'muscle',
    category: 'lower_body',
    description: 'A flat, quadrangular muscle at the top of the inner thigh, between the hip flexors and adductors.',
    function: 'Adducts and flexes the hip, assists in internal rotation. Bridges hip flexor and adductor functions.',
    importance: 'Important for hip stability and movement initiation. Can be strained during rapid direction changes.',
    movement: 'When you lift your leg forward and slightly inward, the pectineus combines flexion and adduction.',
    recoveryTime: 36,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.7, z: 0.04 },
    exercises: [
      { name: 'Sumo Squat', rank: 1, description: 'Wide stance activates pectineus and adductors.' },
      { name: 'Hip Adduction', rank: 2, description: 'Machine or cable adduction.' },
    ]
  },

  // ==================== LOWER LEG ADDITIONAL ====================
  {
    name: 'Peroneus Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'A muscle on the lateral lower leg running from the fibula, under the foot, to the first metatarsal and medial cuneiform.',
    function: 'Plantarflexes the ankle and everts the foot. Supports the transverse arch of the foot.',
    importance: 'Critical for ankle stability and preventing inversion sprains. Important for balance on uneven surfaces.',
    movement: 'When you roll your ankle outward (eversion), the peroneus longus is the primary mover.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.12, y: 0.28, z: 0.02 },
    exercises: [
      { name: 'Ankle Eversion', rank: 1, description: 'Resisted eversion with band.' },
      { name: 'Single-Leg Balance', rank: 2, description: 'Challenges peroneals for stability.' },
    ]
  },
  {
    name: 'Peroneus Brevis',
    type: 'muscle',
    category: 'lower_body',
    description: 'A shorter peroneal muscle lying deep to peroneus longus, running from the fibula to the base of the fifth metatarsal.',
    function: 'Plantarflexes the ankle and everts the foot. Primary evertor when speed is required.',
    importance: 'Important for lateral ankle stability. Its tendon commonly injured in ankle sprains.',
    movement: 'Works with peroneus longus to evert the foot and prevent the ankle from rolling inward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.11, y: 0.22, z: 0.02 },
    exercises: [
      { name: 'Ankle Eversion', rank: 1, description: 'Resisted eversion exercises.' },
      { name: 'Wobble Board', rank: 2, description: 'Balance training for ankle stabilizers.' },
    ]
  },
  {
    name: 'Tibialis Posterior',
    type: 'muscle',
    category: 'lower_body',
    description: 'The deepest muscle of the posterior lower leg, running from the tibia and fibula to multiple foot bones.',
    function: 'Plantarflexes the ankle, inverts the foot, supports the medial arch. Primary dynamic arch support.',
    importance: 'Dysfunction leads to flat feet and posterior tibial tendon insufficiency. Critical for foot mechanics.',
    movement: 'During walking, tibialis posterior supports the arch and helps control pronation.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.22, z: -0.03 },
    exercises: [
      { name: 'Ankle Inversion', rank: 1, description: 'Resisted inversion for tibialis posterior.' },
      { name: 'Single-Leg Calf Raise', rank: 2, description: 'Arch support under load.' },
      { name: 'Towel Scrunches', rank: 3, description: 'Intrinsic foot strengthening.' },
    ]
  },
  {
    name: 'Flexor Hallucis Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'A muscle in the deep posterior leg running from the fibula to the big toe. Passes through grooves in the talus and calcaneus.',
    function: 'Flexes the big toe, assists in ankle plantarflexion. Important for push-off during walking and running.',
    importance: 'Critical for toe-off power in gait. Can develop tendinitis in runners and dancers.',
    movement: 'During the push-off phase of walking, flexor hallucis longus flexes the big toe to propel you forward.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.07, y: 0.2, z: -0.02 },
    exercises: [
      { name: 'Toe Curls', rank: 1, description: 'Towel scrunches with toes.' },
      { name: 'Big Toe Raises', rank: 2, description: 'Isolated big toe flexion.' },
    ]
  },
  {
    name: 'Extensor Digitorum Longus',
    type: 'muscle',
    category: 'lower_body',
    description: 'A muscle on the anterior lower leg running from the tibia and fibula to the four lesser toes.',
    function: 'Extends the toes, assists in ankle dorsiflexion and foot eversion.',
    importance: 'Important for toe clearance during walking. Works with tibialis anterior for dorsiflexion.',
    movement: 'When you lift your toes off the ground, extensor digitorum longus extends the lesser toes.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.1, y: 0.22, z: 0.03 },
    exercises: [
      { name: 'Toe Extensions', rank: 1, description: 'Extend toes against resistance.' },
      { name: 'Ankle Dorsiflexion', rank: 2, description: 'Tibialis raise also works extensors.' },
    ]
  },
  {
    name: 'Plantaris',
    type: 'muscle',
    category: 'lower_body',
    description: 'A small muscle with a very long tendon, running from above the knee to the calcaneus. Vestigial in humans.',
    function: 'Weak plantarflexor and knee flexor. Often used as a graft source due to its expendable nature.',
    importance: 'Clinically insignificant for function but can rupture causing "tennis leg." Often mistaken for calf strain.',
    movement: 'Provides minimal assistance to the gastrocnemius in plantarflexion.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.35, z: -0.04 },
    exercises: [
      { name: 'Calf Raises', rank: 1, description: 'All calf work includes the plantaris.' },
    ]
  },
  {
    name: 'Popliteus',
    type: 'muscle',
    category: 'lower_body',
    description: 'A small muscle at the back of the knee running from the lateral femoral condyle to the posterior tibia.',
    function: 'Unlocks the knee from full extension by internally rotating the tibia. Stabilizes the knee.',
    importance: 'Critical for initiating knee flexion from a locked position. Can be strained with sudden rotation.',
    movement: 'When you start to bend your knee from a straight position, popliteus unlocks the joint first.',
    recoveryTime: 24,
    modelLayer: 'muscles_bones',
    position3D: { x: 0.08, y: 0.38, z: -0.05 },
    exercises: [
      { name: 'Knee Circles', rank: 1, description: 'Gentle rotation to work the popliteus.' },
      { name: 'Terminal Knee Extension', rank: 2, description: 'Controlled extension and unlock.' },
    ]
  },
];

// ==================== ADDITIONAL ORGANS ====================
const ADDITIONAL_ORGANS = [
  {
    name: 'Thyroid Gland',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A butterfly-shaped endocrine gland in the front of the neck, below the Adam\'s apple.',
    function: 'Produces thyroid hormones (T3 and T4) that regulate metabolism, heart rate, body temperature, and energy production.',
    importance: 'Metabolism regulation affects energy levels, weight management, and exercise capacity. Dysfunction causes hypo- or hyperthyroidism.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.42, z: 0.04 },
    exercises: []
  },
  {
    name: 'Adrenal Glands',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Two small glands sitting atop each kidney, consisting of an outer cortex and inner medulla.',
    function: 'Produce cortisol (stress hormone), aldosterone (fluid balance), adrenaline (fight-or-flight), and androgens.',
    importance: 'Critical for stress response and exercise adaptation. Chronic stress can lead to adrenal fatigue affecting performance.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.92, z: -0.03 },
    exercises: []
  },
  {
    name: 'Gallbladder',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A small, pear-shaped organ beneath the liver that stores and concentrates bile.',
    function: 'Stores bile produced by the liver and releases it into the small intestine to aid fat digestion.',
    importance: 'Important for fat absorption. High-fat diets require efficient bile release for proper nutrient absorption.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.93, z: 0.06 },
    exercises: []
  },
  {
    name: 'Appendix',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A small, finger-like pouch attached to the cecum at the junction of the small and large intestines.',
    function: 'Previously thought vestigial, now believed to serve as a reservoir for beneficial gut bacteria and play a role in immune function.',
    importance: 'Can become inflamed (appendicitis) requiring surgical removal. Generally not essential for health.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.72, z: 0.04 },
    exercises: []
  },
  {
    name: 'Bladder',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A hollow, muscular organ in the pelvis that stores urine produced by the kidneys.',
    function: 'Stores urine until voluntary release. Can hold 400-600ml comfortably, up to 1000ml maximum.',
    importance: 'Proper hydration is important for bladder health. Pelvic floor exercises support bladder control.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.68, z: 0.06 },
    exercises: [
      { name: 'Kegel Exercises', rank: 1, description: 'Supports bladder control and pelvic floor health.' },
    ]
  },
  {
    name: 'Skin',
    type: 'organ',
    category: 'cardiovascular',
    description: 'The largest organ of the body, covering approximately 2 square meters in adults. Consists of epidermis, dermis, and hypodermis.',
    function: 'Protection from pathogens, temperature regulation through sweating, sensation, vitamin D synthesis, waterproofing.',
    importance: 'Exercise improves skin health through increased blood flow. Sweating is essential for thermoregulation during exercise.',
    modelLayer: 'full_body',
    position3D: { x: 0, y: 1.0, z: 0.2 },
    exercises: [
      { name: 'Cardio Exercise', rank: 1, description: 'Improves skin blood flow and health.' },
    ]
  },
  {
    name: 'Bone Marrow',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Soft, spongy tissue found inside bones. Red marrow produces blood cells; yellow marrow stores fat.',
    function: 'Produces red blood cells, white blood cells, and platelets. Red marrow is the site of hematopoiesis.',
    importance: 'Exercise stimulates red blood cell production, improving oxygen-carrying capacity. Important for endurance athletes.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.5, z: 0 },
    exercises: [
      { name: 'Altitude Training', rank: 1, description: 'Stimulates red blood cell production.' },
      { name: 'Endurance Exercise', rank: 2, description: 'Promotes healthy bone marrow function.' },
    ]
  },
  {
    name: 'Lymph Nodes',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Small, bean-shaped organs distributed throughout the body, concentrated in the neck, armpits, and groin.',
    function: 'Filter lymph fluid, trap pathogens and abnormal cells, house immune cells, produce antibodies.',
    importance: 'Central to immune function. Exercise promotes lymph circulation, supporting immune health.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 1.3, z: 0.03 },
    exercises: [
      { name: 'Any Movement', rank: 1, description: 'Movement promotes lymphatic circulation.' },
    ]
  },
  {
    name: 'Tonsils',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Masses of lymphoid tissue at the back of the throat, including palatine, pharyngeal (adenoids), and lingual tonsils.',
    function: 'First line of defense against inhaled or ingested pathogens. Trap bacteria and viruses entering through mouth and nose.',
    importance: 'Part of the immune system. Can become infected (tonsillitis) but removal doesn\'t significantly impact immunity.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.03, y: 1.5, z: 0.02 },
    exercises: []
  },
  {
    name: 'Hypothalamus',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A small region at the base of the brain that links the nervous system to the endocrine system.',
    function: 'Controls body temperature, hunger, thirst, fatigue, sleep, circadian rhythms, and hormonal release from the pituitary.',
    importance: 'Master regulator of homeostasis. Exercise affects hypothalamic function, influencing appetite and metabolism.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.55, z: 0.02 },
    exercises: []
  },
  {
    name: 'Pituitary Gland',
    type: 'organ',
    category: 'cardiovascular',
    description: 'A pea-sized gland at the base of the brain, often called the "master gland" of the endocrine system.',
    function: 'Produces hormones controlling growth (GH), metabolism (TSH), stress (ACTH), reproduction (FSH, LH), and water balance (ADH).',
    importance: 'Growth hormone release is stimulated by intense exercise. Essential for muscle building and recovery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.55, z: 0.01 },
    exercises: [
      { name: 'High-Intensity Exercise', rank: 1, description: 'Stimulates growth hormone release.' },
      { name: 'Resistance Training', rank: 2, description: 'Promotes anabolic hormone secretion.' },
    ]
  },
];

// ==================== ADDITIONAL BONES ====================
const ADDITIONAL_BONES = [
  {
    name: 'Carpals (Wrist Bones)',
    type: 'bone',
    category: 'skeletal',
    description: 'Eight small bones arranged in two rows forming the wrist: scaphoid, lunate, triquetrum, pisiform, trapezium, trapezoid, capitate, hamate.',
    function: 'Allow complex wrist movements, distribute forces between forearm and hand, provide attachment for ligaments.',
    importance: 'Scaphoid fractures are common and often missed. Carpal tunnel syndrome involves these bones.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.3, y: 0.85, z: 0 },
    exercises: []
  },
  {
    name: 'Metacarpals',
    type: 'bone',
    category: 'skeletal',
    description: 'Five bones forming the palm of the hand, numbered 1-5 from thumb to little finger.',
    function: 'Form the framework of the palm, articulate with carpals and phalanges, allow gripping motions.',
    importance: 'Boxer\'s fracture (5th metacarpal) is common. Important for grip strength and hand function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.32, y: 0.8, z: 0 },
    exercises: []
  },
  {
    name: 'Phalanges (Hand)',
    type: 'bone',
    category: 'skeletal',
    description: '14 bones forming the fingers: 3 in each finger (proximal, middle, distal), 2 in the thumb.',
    function: 'Allow fine motor movements, grasping, and manipulation of objects.',
    importance: 'Essential for grip and dexterity. Fractures common from sports and accidents.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.34, y: 0.75, z: 0 },
    exercises: []
  },
  {
    name: 'Tarsals (Ankle Bones)',
    type: 'bone',
    category: 'skeletal',
    description: 'Seven bones of the ankle: talus, calcaneus, navicular, cuboid, and three cuneiforms.',
    function: 'Bear body weight, allow ankle and foot movement, form arches of the foot.',
    importance: 'Calcaneus (heel bone) fractures are serious injuries. Talus is critical for ankle function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.1, z: 0 },
    exercises: []
  },
  {
    name: 'Metatarsals',
    type: 'bone',
    category: 'skeletal',
    description: 'Five bones forming the middle of the foot, connecting the tarsals to the toes.',
    function: 'Form the arch of the foot, bear weight during standing and walking, provide leverage for push-off.',
    importance: 'Stress fractures common in runners, especially 2nd and 3rd metatarsals.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.05, z: 0.03 },
    exercises: []
  },
  {
    name: 'Phalanges (Foot)',
    type: 'bone',
    category: 'skeletal',
    description: '14 bones forming the toes: 3 in each lesser toe, 2 in the big toe.',
    function: 'Provide balance and stability, grip the ground during walking, assist in push-off.',
    importance: 'Big toe (hallux) is critical for balance and gait. Toe injuries affect walking mechanics.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.02, z: 0.05 },
    exercises: []
  },
  {
    name: 'Coccyx (Tailbone)',
    type: 'bone',
    category: 'skeletal',
    description: 'A small triangular bone at the base of the spine, formed by 3-5 fused vertebrae.',
    function: 'Attachment point for pelvic floor muscles and gluteus maximus. Provides weight-bearing support when seated.',
    importance: 'Can be fractured or bruised from falls. Pain (coccydynia) is common and debilitating.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.7, z: -0.12 },
    exercises: []
  },
  {
    name: 'Mandible (Jaw Bone)',
    type: 'bone',
    category: 'skeletal',
    description: 'The lower jaw bone, the only movable bone of the skull. Forms the chin and lower face.',
    function: 'Mastication (chewing), speech, facial expression. Houses the lower teeth.',
    importance: 'TMJ (temporomandibular joint) disorders are common. Important for eating and speaking.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.55, z: 0.08 },
    exercises: []
  },
  {
    name: 'Hyoid Bone',
    type: 'bone',
    category: 'skeletal',
    description: 'A U-shaped bone in the neck between the chin and thyroid cartilage. The only bone not articulating with another bone.',
    function: 'Supports the tongue and its movements, aids in swallowing and speech production.',
    importance: 'Important for swallowing and vocalization. Can be fractured in strangulation (forensic significance).',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.48, z: 0.03 },
    exercises: []
  },
];

// ==================== ADDITIONAL BLOOD VESSELS ====================
const ADDITIONAL_VESSELS = [
  {
    name: 'Brachial Artery',
    type: 'vein',
    category: 'cardiovascular',
    description: 'The major artery of the upper arm, running from the shoulder to the elbow where it divides into radial and ulnar arteries.',
    function: 'Supplies blood to the arm. Commonly used for blood pressure measurement and arterial blood sampling.',
    importance: 'Important for blood pressure monitoring. Can be compressed to control bleeding in arm injuries.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.2, y: 1.1, z: 0.02 },
    exercises: []
  },
  {
    name: 'Radial Artery',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Artery on the thumb side of the forearm, running from the elbow to the wrist.',
    function: 'Supplies the lateral forearm and hand. Commonly used for pulse checking and arterial blood gas sampling.',
    importance: 'The pulse you feel at your wrist. Used for heart rate monitoring during exercise.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.28, y: 0.88, z: 0.02 },
    exercises: []
  },
  {
    name: 'Subclavian Artery',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Major artery passing under the clavicle, supplying blood to the arm and parts of the head and neck.',
    function: 'Main blood supply to the arm. Gives rise to the vertebral artery supplying the brain.',
    importance: 'Can be compressed by thoracic outlet syndrome. Critical vessel for upper limb circulation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.4, z: 0.02 },
    exercises: []
  },
  {
    name: 'Popliteal Artery',
    type: 'vein',
    category: 'cardiovascular',
    description: 'The continuation of the femoral artery behind the knee, passing through the popliteal fossa.',
    function: 'Supplies the knee and lower leg. Divides into anterior and posterior tibial arteries.',
    importance: 'Vulnerable to injury in knee dislocations. Damage can threaten the leg.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.38, z: -0.04 },
    exercises: []
  },
  {
    name: 'Tibial Arteries',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Anterior and posterior tibial arteries running along the lower leg to supply the leg and foot.',
    function: 'Supply the lower leg and foot. Posterior tibial pulse can be felt behind the medial malleolus.',
    importance: 'Important for assessing peripheral circulation. Critical for wound healing in the foot.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.2, z: 0.02 },
    exercises: []
  },
  {
    name: 'Portal Vein',
    type: 'vein',
    category: 'cardiovascular',
    description: 'A large vein carrying blood from the digestive organs to the liver for processing before reaching general circulation.',
    function: 'Delivers nutrient-rich blood from the intestines to the liver for metabolism and detoxification.',
    importance: 'Critical for nutrient processing. Portal hypertension is a serious complication of liver disease.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 0.9, z: 0.04 },
    exercises: []
  },
  {
    name: 'Saphenous Vein',
    type: 'vein',
    category: 'cardiovascular',
    description: 'The longest vein in the body, running from the foot up the inner leg to the femoral vein near the groin.',
    function: 'Drains blood from the superficial leg. Commonly harvested for coronary bypass surgery.',
    importance: 'Often affected by varicose veins. Exercise promotes healthy venous return.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.4, z: 0.04 },
    exercises: [
      { name: 'Calf Raises', rank: 1, description: 'Muscle pump helps venous return.' },
      { name: 'Walking', rank: 2, description: 'Promotes blood flow through leg veins.' },
    ]
  },
  {
    name: 'Renal Arteries',
    type: 'vein',
    category: 'cardiovascular',
    description: 'Paired arteries branching from the abdominal aorta to supply the kidneys.',
    function: 'Deliver blood to the kidneys for filtration. Each kidney receives about 20% of cardiac output.',
    importance: 'Kidney perfusion is critical for blood pressure regulation and waste removal.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.88, z: -0.03 },
    exercises: []
  },
];

// ==================== ADDITIONAL NERVES ====================
const ADDITIONAL_NERVES = [
  {
    name: 'Tibial Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'A branch of the sciatic nerve, running down the back of the leg to the foot.',
    function: 'Controls the calf muscles and sole of the foot. Provides sensation to the sole.',
    importance: 'Can be entrapped in tarsal tunnel syndrome. Important for plantarflexion and toe movement.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.25, z: -0.04 },
    exercises: []
  },
  {
    name: 'Common Peroneal Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'A branch of the sciatic nerve, wrapping around the fibular head near the knee.',
    function: 'Controls ankle dorsiflexors and foot evertors. Provides sensation to the top of the foot.',
    importance: 'Vulnerable to injury at the fibular head. Damage causes foot drop.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.35, z: 0.02 },
    exercises: []
  },
  {
    name: 'Obturator Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'A nerve from the lumbar plexus passing through the obturator foramen to the inner thigh.',
    function: 'Controls the adductor muscles and provides sensation to the medial thigh.',
    importance: 'Can be irritated in groin injuries. Important for hip adduction.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.6, z: 0.02 },
    exercises: []
  },
  {
    name: 'Lateral Femoral Cutaneous Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'A sensory nerve from L2-L3 running under the inguinal ligament to the lateral thigh.',
    function: 'Provides sensation to the outer thigh. Purely sensory, no motor function.',
    importance: 'Compression causes meralgia paresthetica (burning thigh pain). Common in tight belts or pregnancy.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.14, y: 0.65, z: 0.04 },
    exercises: []
  },
  {
    name: 'Phrenic Nerve',
    type: 'nerve',
    category: 'core',
    description: 'A nerve from C3-C5 that descends through the chest to innervate the diaphragm.',
    function: 'The sole motor nerve to the diaphragm. Essential for breathing.',
    importance: 'Damage causes paralysis of the diaphragm. "C3, 4, 5 keeps the diaphragm alive."',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.03, y: 1.1, z: 0.02 },
    exercises: [
      { name: 'Diaphragmatic Breathing', rank: 1, description: 'Activates the diaphragm through the phrenic nerve.' },
    ]
  },
  {
    name: 'Intercostal Nerves',
    type: 'nerve',
    category: 'core',
    description: 'Twelve pairs of nerves running between the ribs, supplying the chest wall and abdominal muscles.',
    function: 'Control the intercostal muscles for breathing, provide sensation to the chest wall.',
    importance: 'Can be irritated causing intercostal neuralgia. Important for rib cage movement during breathing.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.1, z: 0.06 },
    exercises: []
  },
  {
    name: 'Accessory Nerve (CN XI)',
    type: 'nerve',
    category: 'upper_body',
    description: 'A cranial nerve that exits the skull and innervates the sternocleidomastoid and trapezius muscles.',
    function: 'Controls head turning (SCM) and shoulder shrugging (trapezius).',
    importance: 'Can be damaged during neck surgery. Injury causes shoulder drop and weakness.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 1.45, z: -0.02 },
    exercises: [
      { name: 'Shrugs', rank: 1, description: 'Activates the trapezius through accessory nerve.' },
    ]
  },
  {
    name: 'Musculocutaneous Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'A nerve from the brachial plexus that pierces the coracobrachialis and innervates the anterior arm.',
    function: 'Controls the biceps, brachialis, and coracobrachialis. Sensation to lateral forearm.',
    importance: 'Important for elbow flexion. Injury causes weakness in bicep curls.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.2, y: 1.15, z: 0.04 },
    exercises: []
  },
  {
    name: 'Axillary Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'A nerve from the brachial plexus that wraps around the surgical neck of the humerus.',
    function: 'Controls the deltoid and teres minor. Sensation to the lateral shoulder.',
    importance: 'Vulnerable in shoulder dislocations and fractures. Damage causes deltoid weakness.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.18, y: 1.3, z: -0.03 },
    exercises: []
  },
  {
    name: 'Long Thoracic Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'A nerve running along the chest wall from C5-C7 to the serratus anterior muscle.',
    function: 'Controls the serratus anterior muscle for scapular protraction and upward rotation.',
    importance: 'Damage causes scapular winging. Can be injured in surgery or repetitive overhead activities.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.15, y: 1.15, z: 0.06 },
    exercises: [
      { name: 'Push-Up Plus', rank: 1, description: 'Activates serratus through long thoracic nerve.' },
    ]
  },
  {
    name: 'Thoracodorsal Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'A nerve from the brachial plexus (C6-C8) that runs along the posterior chest wall.',
    function: 'Controls the latissimus dorsi muscle.',
    importance: 'Damage weakens shoulder adduction and extension (pulling movements).',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 1.18, z: -0.1 },
    exercises: [
      { name: 'Lat Pulldown', rank: 1, description: 'Activates lats through thoracodorsal nerve.' },
    ]
  },
  {
    name: 'Suprascapular Nerve',
    type: 'nerve',
    category: 'upper_body',
    description: 'A nerve passing through the suprascapular notch to innervate the supraspinatus and infraspinatus.',
    function: 'Controls the supraspinatus and infraspinatus muscles of the rotator cuff.',
    importance: 'Can be entrapped causing shoulder weakness and pain. Important for shoulder abduction and external rotation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 1.35, z: -0.1 },
    exercises: []
  },
];

// ============================================================================
// SEED FUNCTION - ADDS TO EXISTING DATA
// ============================================================================

async function seedAdditionalAnatomy() {
  console.log('Adding additional anatomy data...\n');

  const allAdditional = [
    ...ADDITIONAL_MUSCLES,
    ...ADDITIONAL_ORGANS,
    ...ADDITIONAL_BONES,
    ...ADDITIONAL_VESSELS,
    ...ADDITIONAL_NERVES,
  ];

  console.log(`Adding ${allAdditional.length} new anatomy items...\n`);

  let added = 0;
  let skipped = 0;

  for (const item of allAdditional) {
    // Check if already exists
    const existing = await prisma.bodyPart.findFirst({
      where: { name: item.name },
    });

    if (existing) {
      console.log(`Skipping (exists): ${item.name}`);
      skipped++;
      continue;
    }

    console.log(`Adding: ${item.name} (${item.type})`);

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
        let exercise = await prisma.exercise.findFirst({
          where: { name: ex.name },
        });

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

    added++;
  }

  const totalCount = await prisma.bodyPart.count();
  const muscleCount = await prisma.bodyPart.count({ where: { type: 'muscle' } });
  const boneCount = await prisma.bodyPart.count({ where: { type: 'bone' } });
  const organCount = await prisma.bodyPart.count({ where: { type: 'organ' } });
  const veinCount = await prisma.bodyPart.count({ where: { type: 'vein' } });
  const nerveCount = await prisma.bodyPart.count({ where: { type: 'nerve' } });

  console.log('\n========================================');
  console.log('ADDITIONAL ANATOMY SEED COMPLETE!');
  console.log('========================================');
  console.log(`Added: ${added} | Skipped: ${skipped}`);
  console.log('----------------------------------------');
  console.log(`Total Body Parts: ${totalCount}`);
  console.log(`  - Muscles: ${muscleCount}`);
  console.log(`  - Bones: ${boneCount}`);
  console.log(`  - Organs: ${organCount}`);
  console.log(`  - Blood Vessels: ${veinCount}`);
  console.log(`  - Nerves: ${nerveCount}`);
  console.log('========================================\n');
}

seedAdditionalAnatomy()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
