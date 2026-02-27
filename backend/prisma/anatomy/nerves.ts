// COMPREHENSIVE NERVES DATABASE

export const ALL_NERVES = [
  // ==================== CRANIAL NERVES (12) ====================
  {
    name: 'Olfactory Nerve (CN I)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Special sensory nerve for smell, passing through the cribriform plate from the nasal epithelium to the olfactory bulb.',
    function: 'Transmits smell sensation from the nasal cavity to the brain.',
    importance: 'Loss of smell (anosmia) can indicate head trauma, COVID-19, or neurodegenerative disease.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.64, z: 0.1 },
    exercises: []
  },
  {
    name: 'Optic Nerve (CN II)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Special sensory nerve for vision, carrying visual information from the retina to the brain.',
    function: 'Transmits visual signals from the eye to the visual cortex via the optic chiasm.',
    importance: 'Damage causes blindness. Part of the CNS, not a true peripheral nerve.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.63, z: 0.08 },
    exercises: []
  },
  {
    name: 'Oculomotor Nerve (CN III)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve controlling most eye movements and pupil constriction.',
    function: 'Controls superior, inferior, and medial rectus muscles, inferior oblique, levator palpebrae, and pupillary constriction.',
    importance: 'Palsy causes ptosis, dilated pupil, and "down and out" eye position.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.62, z: 0.06 },
    exercises: []
  },
  {
    name: 'Trochlear Nerve (CN IV)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve to the superior oblique muscle. Only cranial nerve emerging from dorsal brainstem.',
    function: 'Controls the superior oblique muscle for downward and inward eye movement.',
    importance: 'Palsy causes vertical diplopia, especially when looking down (e.g., reading, stairs).',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.025, y: 1.62, z: 0.04 },
    exercises: []
  },
  {
    name: 'Trigeminal Nerve (CN V)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Largest cranial nerve with three branches (ophthalmic V1, maxillary V2, mandibular V3). Mixed sensory and motor.',
    function: 'Sensory to face, motor to muscles of mastication. Carries pain, temperature, and touch from face.',
    importance: 'Trigeminal neuralgia causes severe facial pain. Controls jaw movement.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.6, z: 0.04 },
    exercises: []
  },
  {
    name: 'Abducens Nerve (CN VI)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve to the lateral rectus muscle for eye abduction.',
    function: 'Controls the lateral rectus muscle, abducting the eye (looking outward).',
    importance: 'Palsy causes medial deviation of eye and horizontal diplopia.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.03, y: 1.62, z: 0.05 },
    exercises: []
  },
  {
    name: 'Facial Nerve (CN VII)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Mixed nerve controlling facial expression, taste (anterior 2/3 tongue), and parasympathetic to glands.',
    function: 'Motor to muscles of facial expression, taste sensation, lacrimation and salivation.',
    importance: 'Bell\'s palsy affects this nerve causing facial droop. Essential for expression.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 1.6, z: 0.02 },
    exercises: []
  },
  {
    name: 'Vestibulocochlear Nerve (CN VIII)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Special sensory nerve for hearing (cochlear) and balance (vestibular).',
    function: 'Transmits sound information for hearing and position/movement information for balance.',
    importance: 'Damage causes hearing loss and vertigo. Acoustic neuroma affects this nerve.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.07, y: 1.6, z: 0 },
    exercises: []
  },
  {
    name: 'Glossopharyngeal Nerve (CN IX)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Mixed nerve for taste (posterior 1/3 tongue), sensation from pharynx, and motor to stylopharyngeus.',
    function: 'Taste from posterior tongue, gag reflex sensation, carotid body/sinus monitoring.',
    importance: 'Tested with gag reflex. Glossopharyngeal neuralgia causes throat/ear pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.54, z: 0.02 },
    exercises: []
  },
  {
    name: 'Vagus Nerve (CN X)',
    type: 'nerve',
    category: 'cardiovascular',
    description: 'Longest cranial nerve, wandering from brainstem to abdomen. Major parasympathetic nerve.',
    function: 'Controls heart rate, digestion, breathing, gag reflex, voice. "Rest and digest" functions.',
    importance: 'Vagal tone affects heart rate variability and recovery. Deep breathing stimulates it.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.4, z: 0.02 },
    exercises: [
      { name: 'Deep Breathing', rank: 1, description: 'Stimulates vagus nerve for recovery.' },
      { name: 'Cold Exposure', rank: 2, description: 'Activates vagal tone.' },
    ]
  },
  {
    name: 'Accessory Nerve (CN XI)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve to sternocleidomastoid and trapezius muscles. Spinal and cranial roots.',
    function: 'Controls head turning (SCM) and shoulder elevation (trapezius).',
    importance: 'Damage causes shoulder droop and weakness turning head.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 1.42, z: -0.02 },
    exercises: []
  },
  {
    name: 'Hypoglossal Nerve (CN XII)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve to all tongue muscles except palatoglossus.',
    function: 'Controls tongue movement for speech, chewing, and swallowing.',
    importance: 'Damage causes tongue deviation toward the lesion side.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.52, z: 0.04 },
    exercises: []
  },

  // ==================== CERVICAL PLEXUS (C1-C4) ====================
  {
    name: 'Phrenic Nerve (C3-C5)',
    type: 'nerve',
    category: 'core',
    description: 'Motor nerve to the diaphragm, arising from C3-C5 ("C3, 4, 5 keeps the diaphragm alive").',
    function: 'Sole motor supply to the diaphragm for breathing.',
    importance: 'Damage causes diaphragm paralysis. Critical for ventilation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.35, z: 0.04 },
    exercises: [
      { name: 'Diaphragmatic Breathing', rank: 1, description: 'Exercises the phrenic nerve pathway.' },
    ]
  },
  {
    name: 'Greater Occipital Nerve (C2)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Sensory nerve from C2 providing sensation to the posterior scalp.',
    function: 'Sensory to the back of the head and scalp.',
    importance: 'Occipital neuralgia causes severe headaches from this nerve.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.58, z: -0.1 },
    exercises: []
  },
  {
    name: 'Lesser Occipital Nerve (C2-C3)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Sensory nerve from cervical plexus to lateral scalp behind ear.',
    function: 'Sensory to the skin behind the ear and adjacent scalp.',
    importance: 'Can be involved in cervicogenic headaches.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 1.56, z: -0.06 },
    exercises: []
  },
  {
    name: 'Great Auricular Nerve (C2-C3)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Largest sensory branch of cervical plexus, ascending over SCM.',
    function: 'Sensory to the ear and skin over the parotid gland.',
    importance: 'Commonly encountered in neck surgery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 1.52, z: 0.01 },
    exercises: []
  },
  {
    name: 'Transverse Cervical Nerve (C2-C3)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Sensory nerve curving around the SCM to the anterior neck.',
    function: 'Sensory to the anterior and lateral neck.',
    importance: 'Part of cervical plexus sensory distribution.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 1.46, z: 0.04 },
    exercises: []
  },
  {
    name: 'Supraclavicular Nerves (C3-C4)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Three branches (medial, intermediate, lateral) providing sensation to the shoulder region.',
    function: 'Sensory to the skin over clavicle, shoulder, and upper chest.',
    importance: 'Referred pain patterns from these nerves can mimic shoulder problems.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.38, z: 0.06 },
    exercises: []
  },

  // ==================== BRACHIAL PLEXUS (C5-T1) ====================
  {
    name: 'Brachial Plexus',
    type: 'nerve',
    category: 'upper_body',
    description: 'Network of nerves from C5-T1 forming roots, trunks, divisions, cords, and branches supplying the upper limb.',
    function: 'Provides all motor and most sensory innervation to the upper limb.',
    importance: 'Injuries cause significant arm weakness. "Burners/stingers" in athletes.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 1.38, z: 0 },
    exercises: []
  },
  {
    name: 'Long Thoracic Nerve (C5-C7)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve running superficially down the lateral chest to serratus anterior.',
    function: 'Innervates the serratus anterior muscle.',
    importance: 'Damage causes winged scapula. Vulnerable during surgery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.14, y: 1.25, z: 0.06 },
    exercises: []
  },
  {
    name: 'Dorsal Scapular Nerve (C5)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve from C5 root to rhomboids and levator scapulae.',
    function: 'Innervates the rhomboid major and minor, and levator scapulae.',
    importance: 'Damage causes scapular winging and shoulder blade weakness.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 1.32, z: -0.08 },
    exercises: []
  },
  {
    name: 'Suprascapular Nerve (C5-C6)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve from upper trunk passing through suprascapular notch.',
    function: 'Innervates supraspinatus and infraspinatus (rotator cuff).',
    importance: 'Compression causes shoulder weakness and pain. Common in overhead athletes.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.32, z: -0.1 },
    exercises: []
  },
  {
    name: 'Musculocutaneous Nerve (C5-C7)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve from lateral cord piercing coracobrachialis, becoming lateral cutaneous nerve of forearm.',
    function: 'Innervates biceps, brachialis, and coracobrachialis. Sensory to lateral forearm.',
    importance: 'Damage causes elbow flexion weakness and lateral forearm numbness.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.2, y: 1.2, z: 0.04 },
    exercises: []
  },
  {
    name: 'Axillary Nerve (C5-C6)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve from posterior cord wrapping around surgical neck of humerus.',
    function: 'Innervates deltoid and teres minor. Sensory to lateral shoulder (regimental badge area).',
    importance: 'Damaged in shoulder dislocations and humeral fractures.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.2, y: 1.32, z: -0.02 },
    exercises: []
  },
  {
    name: 'Median Nerve (C5-T1)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Major nerve of the anterior forearm and hand, from lateral and medial cords.',
    function: 'Motor to most forearm flexors, thenar muscles. Sensory to lateral 3.5 digits.',
    importance: 'Carpal tunnel syndrome compresses this nerve. "Hand of benediction" with injury.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.28, y: 0.9, z: 0.03 },
    exercises: [
      { name: 'Median Nerve Glide', rank: 1, description: 'Mobilizes the median nerve.' },
      { name: 'Wrist Stretches', rank: 2, description: 'Maintains carpal tunnel space.' },
    ]
  },
  {
    name: 'Ulnar Nerve (C8-T1)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Major nerve of the hand, from medial cord, passing behind medial epicondyle.',
    function: 'Motor to intrinsic hand muscles, FCU, medial FDP. Sensory to medial 1.5 digits.',
    importance: 'Cubital tunnel syndrome at elbow. "Claw hand" with injury. Funny bone.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.28, y: 0.95, z: -0.02 },
    exercises: [
      { name: 'Ulnar Nerve Glide', rank: 1, description: 'Mobilizes the ulnar nerve.' },
    ]
  },
  {
    name: 'Radial Nerve (C5-T1)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Largest brachial plexus branch, from posterior cord, spiraling around humerus.',
    function: 'Motor to all extensors of arm, forearm, hand. Sensory to posterior arm and dorsal hand.',
    importance: 'Damage causes wrist drop. Saturday night palsy from arm compression.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.26, y: 1.0, z: -0.04 },
    exercises: []
  },
  {
    name: 'Thoracodorsal Nerve (C6-C8)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve from posterior cord to latissimus dorsi.',
    function: 'Innervates the latissimus dorsi muscle.',
    importance: 'Damage weakens arm adduction, extension, and internal rotation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.14, y: 1.2, z: -0.08 },
    exercises: []
  },
  {
    name: 'Medial Pectoral Nerve (C8-T1)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve from medial cord to pectoralis major and minor.',
    function: 'Innervates the pectoralis major (lower part) and pectoralis minor.',
    importance: 'Works with lateral pectoral nerve for chest function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.28, z: 0.08 },
    exercises: []
  },
  {
    name: 'Lateral Pectoral Nerve (C5-C7)',
    type: 'nerve',
    category: 'upper_body',
    description: 'Motor nerve from lateral cord to pectoralis major.',
    function: 'Innervates the pectoralis major (clavicular portion).',
    importance: 'Works with medial pectoral nerve for chest function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 1.3, z: 0.1 },
    exercises: []
  },

  // ==================== THORACIC NERVES ====================
  {
    name: 'Intercostal Nerves (T1-T11)',
    type: 'nerve',
    category: 'core',
    description: 'Ventral rami of thoracic spinal nerves running between the ribs.',
    function: 'Motor to intercostal muscles, sensory to thoracic and abdominal wall skin.',
    importance: 'Intercostal neuralgia causes chest/abdominal wall pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 1.15, z: 0.04 },
    exercises: []
  },
  {
    name: 'Subcostal Nerve (T12)',
    type: 'nerve',
    category: 'core',
    description: 'Ventral ramus of T12, running below the 12th rib.',
    function: 'Motor to abdominal muscles, sensory to lower abdomen and gluteal region.',
    importance: 'Marks transition between thoracic and lumbar innervation.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.95, z: 0.02 },
    exercises: []
  },

  // ==================== LUMBAR PLEXUS (L1-L4) ====================
  {
    name: 'Iliohypogastric Nerve (L1)',
    type: 'nerve',
    category: 'core',
    description: 'Mixed nerve from L1 providing motor to abdominal muscles and sensory to hip region.',
    function: 'Motor to internal oblique and transverse abdominis, sensory to suprapubic region.',
    importance: 'Can be damaged during abdominal surgery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.88, z: 0.06 },
    exercises: []
  },
  {
    name: 'Ilioinguinal Nerve (L1)',
    type: 'nerve',
    category: 'core',
    description: 'Mixed nerve from L1 passing through the inguinal canal.',
    function: 'Motor to abdominal muscles, sensory to upper thigh, scrotum/labia.',
    importance: 'Can be entrapped after inguinal surgery causing groin pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.82, z: 0.08 },
    exercises: []
  },
  {
    name: 'Genitofemoral Nerve (L1-L2)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Mixed nerve passing through the psoas with genital and femoral branches.',
    function: 'Sensory to upper thigh and genitals, motor to cremaster muscle.',
    importance: 'Tested with cremasteric reflex. Involved in groin pain syndromes.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.78, z: 0.06 },
    exercises: []
  },
  {
    name: 'Lateral Femoral Cutaneous Nerve (L2-L3)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Pure sensory nerve passing under or through the inguinal ligament.',
    function: 'Sensory to lateral thigh.',
    importance: 'Meralgia paresthetica: burning/numbness from nerve compression.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.14, y: 0.72, z: 0.04 },
    exercises: []
  },
  {
    name: 'Femoral Nerve (L2-L4)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Largest branch of lumbar plexus, passing under the inguinal ligament.',
    function: 'Motor to quadriceps, sartorius, pectineus. Sensory to anterior thigh and medial leg.',
    importance: 'Damage causes inability to extend knee and climb stairs.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.68, z: 0.05 },
    exercises: []
  },
  {
    name: 'Saphenous Nerve (L3-L4)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Pure sensory terminal branch of femoral nerve, longest sensory nerve.',
    function: 'Sensory to medial leg, ankle, and foot.',
    importance: 'Can be damaged during varicose vein surgery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.35, z: 0.04 },
    exercises: []
  },
  {
    name: 'Obturator Nerve (L2-L4)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Motor nerve passing through the obturator foramen to the medial thigh.',
    function: 'Motor to adductor muscles, sensory to medial thigh.',
    importance: 'Damage causes hip adduction weakness. Obturator neuralgia causes groin pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.65, z: 0.02 },
    exercises: []
  },

  // ==================== SACRAL PLEXUS (L4-S3) ====================
  {
    name: 'Lumbosacral Trunk (L4-L5)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Connection between lumbar and sacral plexuses, carrying L4-L5 fibers.',
    function: 'Contributes to sacral plexus formation for lower limb innervation.',
    importance: 'Links lumbar and sacral plexuses.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.78, z: -0.06 },
    exercises: []
  },
  {
    name: 'Superior Gluteal Nerve (L4-S1)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Motor nerve exiting above piriformis to gluteus medius, minimus, and TFL.',
    function: 'Innervates gluteus medius, gluteus minimus, and tensor fasciae latae.',
    importance: 'Damage causes Trendelenburg gait (hip drop when walking).',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.14, y: 0.76, z: -0.06 },
    exercises: []
  },
  {
    name: 'Inferior Gluteal Nerve (L5-S2)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Motor nerve exiting below piriformis to gluteus maximus.',
    function: 'Innervates the gluteus maximus.',
    importance: 'Damage causes difficulty rising from sitting and climbing stairs.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.74, z: -0.08 },
    exercises: []
  },
  {
    name: 'Sciatic Nerve (L4-S3)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Largest nerve in the body, exiting below piriformis, running down posterior thigh.',
    function: 'Motor to posterior thigh and all muscles below knee. Sensory to most of leg.',
    importance: 'Sciatica causes leg pain. Piriformis syndrome can compress it.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.6, z: -0.1 },
    exercises: [
      { name: 'Sciatic Nerve Floss', rank: 1, description: 'Mobilizes the sciatic nerve.' },
      { name: 'Piriformis Stretch', rank: 2, description: 'Relieves sciatic nerve compression.' },
    ]
  },
  {
    name: 'Tibial Nerve (L4-S3)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Larger terminal branch of sciatic nerve, continuing down the back of the leg.',
    function: 'Motor to posterior leg and foot sole muscles. Sensory to sole of foot.',
    importance: 'Tarsal tunnel syndrome compresses this nerve at the ankle.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.3, z: -0.04 },
    exercises: []
  },
  {
    name: 'Medial Plantar Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'Terminal branch of tibial nerve to the medial sole, equivalent to median nerve in hand.',
    function: 'Motor to some intrinsic foot muscles, sensory to medial 3.5 toes.',
    importance: 'Jogger\'s foot: entrapment causing arch pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.05, y: 0.04, z: 0.02 },
    exercises: []
  },
  {
    name: 'Lateral Plantar Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'Terminal branch of tibial nerve to the lateral sole, equivalent to ulnar nerve in hand.',
    function: 'Motor to most intrinsic foot muscles, sensory to lateral 1.5 toes.',
    importance: 'Baxter\'s nerve (first branch) entrapment causes heel pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.04, z: 0.01 },
    exercises: []
  },
  {
    name: 'Common Peroneal (Fibular) Nerve (L4-S2)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Smaller terminal branch of sciatic, wrapping around fibular neck.',
    function: 'Motor to anterior and lateral leg compartments. Sensory to lateral leg and dorsum of foot.',
    importance: 'Easily compressed at fibular head causing foot drop.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.38, z: -0.02 },
    exercises: []
  },
  {
    name: 'Superficial Peroneal (Fibular) Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'Branch of common peroneal in the lateral leg compartment.',
    function: 'Motor to peroneus longus and brevis. Sensory to lateral leg and dorsum of foot.',
    importance: 'Damage causes eversion weakness.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.13, y: 0.28, z: 0.01 },
    exercises: []
  },
  {
    name: 'Deep Peroneal (Fibular) Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'Branch of common peroneal in the anterior leg compartment.',
    function: 'Motor to anterior compartment muscles. Sensory to first web space.',
    importance: 'Damage causes foot drop and toe extension weakness.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.22, z: 0.04 },
    exercises: []
  },
  {
    name: 'Sural Nerve',
    type: 'nerve',
    category: 'lower_body',
    description: 'Sensory nerve formed by branches from tibial and common peroneal nerves.',
    function: 'Sensory to lateral foot and heel.',
    importance: 'Commonly used for nerve biopsy and grafting.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.15, z: -0.02 },
    exercises: []
  },
  {
    name: 'Posterior Femoral Cutaneous Nerve (S1-S3)',
    type: 'nerve',
    category: 'lower_body',
    description: 'Sensory nerve running with sciatic nerve to posterior thigh and buttock.',
    function: 'Sensory to posterior thigh, buttock, and perineum.',
    importance: 'Can be involved in sitting-related pain syndromes.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.55, z: -0.1 },
    exercises: []
  },
  {
    name: 'Pudendal Nerve (S2-S4)',
    type: 'nerve',
    category: 'core',
    description: 'Mixed nerve exiting through greater sciatic foramen, reentering through lesser.',
    function: 'Motor to external urethral and anal sphincters, pelvic floor. Sensory to perineum.',
    importance: 'Pudendal neuralgia causes severe perineal pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 0.7, z: -0.04 },
    exercises: []
  },

  // ==================== AUTONOMIC NERVES ====================
  {
    name: 'Sympathetic Chain',
    type: 'nerve',
    category: 'cardiovascular',
    description: 'Paired chains of sympathetic ganglia running alongside the vertebral column.',
    function: 'Mediates "fight or flight" responses: increased heart rate, dilated pupils, reduced digestion.',
    importance: 'Overactivity contributes to chronic stress. Stellate ganglion block for PTSD.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.0, z: -0.08 },
    exercises: []
  },
  {
    name: 'Celiac Plexus',
    type: 'nerve',
    category: 'cardiovascular',
    description: 'Complex of autonomic ganglia around the celiac trunk, the "solar plexus."',
    function: 'Sympathetic and parasympathetic control of abdominal organs.',
    importance: 'Celiac plexus block used for abdominal cancer pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.98, z: 0.04 },
    exercises: []
  },
  {
    name: 'Spinal Cord',
    type: 'nerve',
    category: 'core',
    description: 'Central nerve pathway from foramen magnum to L1-L2, protected within the vertebral canal.',
    function: 'Transmits all motor and sensory signals between brain and body. Contains reflex circuits.',
    importance: 'Injury causes paralysis. Proper lifting mechanics protect the spine.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.1, z: -0.06 },
    exercises: [
      { name: 'Core Stability', rank: 1, description: 'Protects the spine and spinal cord.' },
      { name: 'Proper Lifting Mechanics', rank: 2, description: 'Maintains spinal alignment.' },
    ]
  },
];
