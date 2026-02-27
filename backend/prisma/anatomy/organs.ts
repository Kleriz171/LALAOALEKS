// COMPREHENSIVE ORGANS DATABASE (79 organs)

export const ALL_ORGANS = [
  // ==================== CARDIOVASCULAR ORGANS ====================
  {
    name: 'Heart',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Four-chambered muscular organ, approximately the size of a fist, located in the mediastinum.',
    function: 'Pumps blood throughout the body. Right side receives deoxygenated blood, left side pumps oxygenated blood.',
    importance: 'Central organ of circulation. Exercise strengthens the heart muscle and improves cardiac output.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.15, z: 0.08 },
    exercises: [
      { name: 'Aerobic Exercise', rank: 1, description: 'Strengthens heart muscle.' },
      { name: 'HIIT', rank: 2, description: 'Improves cardiac output.' },
    ]
  },
  {
    name: 'Left Atrium',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Upper left chamber of the heart receiving oxygenated blood from pulmonary veins.',
    function: 'Receives oxygenated blood from lungs, passes it to the left ventricle.',
    importance: 'Atrial fibrillation often originates here. Key for efficient cardiac filling.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.16, z: 0.06 },
    exercises: []
  },
  {
    name: 'Right Atrium',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Upper right chamber of the heart receiving deoxygenated blood from the body.',
    function: 'Receives blood from superior and inferior vena cava, passes it to right ventricle.',
    importance: 'Contains SA node (pacemaker). Right atrial enlargement indicates heart failure.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.16, z: 0.08 },
    exercises: []
  },
  {
    name: 'Left Ventricle',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Lower left chamber with thick muscular walls, pumping blood to the entire body.',
    function: 'Pumps oxygenated blood through the aorta to systemic circulation.',
    importance: 'Thickest heart chamber. Left ventricular hypertrophy indicates chronic hypertension.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.12, z: 0.08 },
    exercises: []
  },
  {
    name: 'Right Ventricle',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Lower right chamber pumping blood to the lungs for oxygenation.',
    function: 'Pumps deoxygenated blood through pulmonary arteries to the lungs.',
    importance: 'Thinner than left ventricle as it only pumps to lungs.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.12, z: 0.1 },
    exercises: []
  },

  // ==================== RESPIRATORY ORGANS ====================
  {
    name: 'Right Lung',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Larger lung with three lobes (upper, middle, lower), occupying most of the right thorax.',
    function: 'Gas exchange: oxygen enters blood, carbon dioxide leaves.',
    importance: 'Larger than left lung to compensate for heart space on left.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.18, z: 0.04 },
    exercises: [
      { name: 'Deep Breathing', rank: 1, description: 'Improves lung capacity.' },
      { name: 'Cardiovascular Exercise', rank: 2, description: 'Enhances respiratory efficiency.' },
    ]
  },
  {
    name: 'Left Lung',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Smaller lung with two lobes (upper, lower), with cardiac notch for the heart.',
    function: 'Gas exchange: oxygen enters blood, carbon dioxide leaves.',
    importance: 'Smaller due to heart position. Contains cardiac notch.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 1.18, z: 0.04 },
    exercises: []
  },
  {
    name: 'Trachea',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Cartilaginous tube from larynx to bronchi, approximately 10-12 cm long.',
    function: 'Conducts air to and from the lungs, warms and humidifies inspired air.',
    importance: 'Tracheostomy provides emergency airway. C-shaped cartilage rings maintain patency.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.35, z: 0.04 },
    exercises: []
  },
  {
    name: 'Right Main Bronchus',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Wider, shorter, and more vertical bronchus to the right lung.',
    function: 'Conducts air to the right lung.',
    importance: 'Aspirated objects more likely to enter here due to anatomy.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 1.28, z: 0.04 },
    exercises: []
  },
  {
    name: 'Left Main Bronchus',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Longer, narrower, and more horizontal bronchus to the left lung.',
    function: 'Conducts air to the left lung.',
    importance: 'Curves around the aortic arch.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.04, y: 1.28, z: 0.04 },
    exercises: []
  },
  {
    name: 'Larynx',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Voice box containing vocal cords, made of cartilages (thyroid, cricoid, arytenoid).',
    function: 'Voice production, airway protection during swallowing.',
    importance: 'Contains vocal cords. Laryngospasm protects against aspiration.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.44, z: 0.06 },
    exercises: []
  },
  {
    name: 'Pharynx',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Muscular tube from nasal cavity to esophagus and larynx, divided into nasopharynx, oropharynx, and laryngopharynx.',
    function: 'Passageway for air and food, resonating chamber for speech.',
    importance: 'Obstructive sleep apnea involves pharyngeal collapse.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.5, z: 0.02 },
    exercises: []
  },
  {
    name: 'Nasal Cavity',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Air-filled space above the roof of the mouth, divided by the nasal septum.',
    function: 'Warms, humidifies, and filters inspired air. Contains olfactory receptors.',
    importance: 'First line of respiratory defense. Deviated septum causes obstruction.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.6, z: 0.1 },
    exercises: []
  },
  // Diaphragm is defined in muscles-trunk.ts as it's primarily a muscle

  // ==================== DIGESTIVE ORGANS ====================
  {
    name: 'Esophagus',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Muscular tube approximately 25 cm long from pharynx to stomach.',
    function: 'Conducts food from mouth to stomach via peristalsis.',
    importance: 'GERD causes esophageal damage. Barrett\'s esophagus is precancerous.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.2, z: -0.02 },
    exercises: []
  },
  {
    name: 'Stomach',
    type: 'organ',
    category: 'cardiovascular',
    description: 'J-shaped expandable organ between esophagus and small intestine.',
    function: 'Stores food, mixes with gastric juices, begins protein digestion with pepsin.',
    importance: 'Gastric ulcers affect lining. H. pylori is major cause of ulcers.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.98, z: 0.08 },
    exercises: []
  },
  {
    name: 'Duodenum',
    type: 'organ',
    category: 'cardiovascular',
    description: 'First and shortest segment of small intestine, approximately 25 cm, C-shaped around pancreas.',
    function: 'Receives bile and pancreatic enzymes, begins major digestion.',
    importance: 'Duodenal ulcers are common. Site of iron and calcium absorption.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 0.9, z: 0.06 },
    exercises: []
  },
  {
    name: 'Jejunum',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Middle segment of small intestine, approximately 2.5 meters long.',
    function: 'Major site of nutrient absorption, especially carbohydrates and proteins.',
    importance: 'Primary absorption site. Celiac disease damages jejunal villi.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.85, z: 0.06 },
    exercises: []
  },
  {
    name: 'Ileum',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Final and longest segment of small intestine, approximately 3.5 meters.',
    function: 'Absorbs vitamin B12, bile salts, and remaining nutrients.',
    importance: 'Crohn\'s disease commonly affects terminal ileum.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.02, y: 0.8, z: 0.06 },
    exercises: []
  },
  {
    name: 'Cecum',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Pouch-like beginning of the large intestine, receiving ileum.',
    function: 'Receives material from ileum, beginning of water absorption.',
    importance: 'Appendix attaches here. Site of ileocecal valve.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 0.72, z: 0.04 },
    exercises: []
  },
  {
    name: 'Appendix',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Narrow tube attached to cecum, approximately 8-10 cm long.',
    function: 'May serve as reservoir for beneficial gut bacteria, immune function.',
    importance: 'Appendicitis is common surgical emergency.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.7, z: 0.04 },
    exercises: []
  },
  {
    name: 'Ascending Colon',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Vertical segment of large intestine from cecum to hepatic flexure.',
    function: 'Absorbs water and electrolytes from digestive material.',
    importance: 'Right-sided colon cancers often present late.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.12, y: 0.82, z: 0.02 },
    exercises: []
  },
  {
    name: 'Transverse Colon',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Horizontal segment crossing the abdomen from right to left.',
    function: 'Continues water absorption, moves material toward left colon.',
    importance: 'Longest and most mobile colonic segment.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.88, z: 0.06 },
    exercises: []
  },
  {
    name: 'Descending Colon',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Vertical segment from splenic flexure to sigmoid colon.',
    function: 'Stores feces before elimination.',
    importance: 'Left-sided colon cancers often cause obstruction.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.12, y: 0.82, z: 0.02 },
    exercises: []
  },
  {
    name: 'Sigmoid Colon',
    type: 'organ',
    category: 'cardiovascular',
    description: 'S-shaped segment connecting descending colon to rectum.',
    function: 'Stores feces, strong peristaltic contractions for defecation.',
    importance: 'Diverticulosis most common here. Sigmoid volvulus causes obstruction.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 0.72, z: 0.02 },
    exercises: []
  },
  {
    name: 'Rectum',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Final straight portion of large intestine, approximately 12 cm.',
    function: 'Stores feces, signals defecation urge.',
    importance: 'Rectal cancer common. Digital rectal exam important screening.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.68, z: -0.04 },
    exercises: []
  },

  // ==================== ACCESSORY DIGESTIVE ORGANS ====================
  {
    name: 'Liver',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Largest internal organ, approximately 1.5 kg, located in right upper quadrant.',
    function: 'Metabolism, detoxification, bile production, protein synthesis, glycogen storage.',
    importance: 'Performs over 500 functions. Fatty liver disease increasingly common.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.1, y: 1.0, z: 0.06 },
    exercises: []
  },
  {
    name: 'Gallbladder',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Pear-shaped sac beneath the liver storing bile.',
    function: 'Stores and concentrates bile for fat digestion.',
    importance: 'Gallstones common, may require cholecystectomy.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.96, z: 0.08 },
    exercises: []
  },
  {
    name: 'Pancreas',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Elongated gland posterior to stomach, with head, body, and tail.',
    function: 'Exocrine: digestive enzymes. Endocrine: insulin and glucagon.',
    importance: 'Pancreatitis can be life-threatening. Diabetes involves pancreatic dysfunction.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.94, z: 0.02 },
    exercises: []
  },
  {
    name: 'Salivary Glands (Parotid)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Largest salivary gland anterior to the ear, produces serous saliva.',
    function: 'Produces amylase-rich saliva for starch digestion.',
    importance: 'Mumps affects parotid gland. Stones can cause swelling.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 1.58, z: 0.04 },
    exercises: []
  },
  {
    name: 'Salivary Glands (Submandibular)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Second largest salivary gland beneath the mandible.',
    function: 'Produces mixed serous and mucous saliva.',
    importance: 'Most common site for salivary stones.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.03, y: 1.5, z: 0.04 },
    exercises: []
  },
  {
    name: 'Salivary Glands (Sublingual)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Smallest major salivary gland beneath the tongue.',
    function: 'Produces predominantly mucous saliva.',
    importance: 'Multiple small ducts. Ranula is mucocele of this gland.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.015, y: 1.52, z: 0.06 },
    exercises: []
  },

  // ==================== URINARY ORGANS ====================
  {
    name: 'Right Kidney',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Bean-shaped organ in retroperitoneum, slightly lower than left due to liver.',
    function: 'Filters blood, produces urine, regulates fluid and electrolyte balance.',
    importance: 'Each kidney has ~1 million nephrons. CKD is major health issue.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 0.92, z: -0.06 },
    exercises: []
  },
  {
    name: 'Left Kidney',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Bean-shaped organ in retroperitoneum, slightly higher than right.',
    function: 'Filters blood, produces urine, regulates fluid and electrolyte balance.',
    importance: 'Adrenal gland sits atop each kidney. Hydration essential for function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 0.94, z: -0.06 },
    exercises: []
  },
  {
    name: 'Right Ureter',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Muscular tube approximately 25 cm carrying urine from kidney to bladder.',
    function: 'Propels urine from kidney to bladder via peristalsis.',
    importance: 'Kidney stones can obstruct ureters causing severe pain.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.82, z: -0.04 },
    exercises: []
  },
  {
    name: 'Left Ureter',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Muscular tube approximately 25 cm carrying urine from kidney to bladder.',
    function: 'Propels urine from kidney to bladder via peristalsis.',
    importance: 'Three natural narrowings are common stone impaction sites.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.06, y: 0.82, z: -0.04 },
    exercises: []
  },
  {
    name: 'Urinary Bladder',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Hollow muscular organ in the pelvis storing urine.',
    function: 'Stores urine (300-500 mL capacity), controlled voiding.',
    importance: 'UTIs common. Bladder cancer often presents with hematuria.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.68, z: 0.06 },
    exercises: [
      { name: 'Kegel Exercises', rank: 1, description: 'Strengthens bladder control.' },
    ]
  },
  {
    name: 'Urethra',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Tube from bladder to external opening, shorter in females (~4 cm) than males (~20 cm).',
    function: 'Conducts urine from bladder to outside. In males, also conducts semen.',
    importance: 'Female urethra shorter, increasing UTI risk.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.64, z: 0.08 },
    exercises: []
  },

  // ==================== REPRODUCTIVE ORGANS ====================
  {
    name: 'Ovaries',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Paired female gonads, almond-sized, in the pelvic cavity.',
    function: 'Produce eggs (ova) and female sex hormones (estrogen, progesterone).',
    importance: 'Ovarian cysts common. Ovarian cancer often diagnosed late.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.04, y: 0.7, z: 0.02 },
    exercises: []
  },
  {
    name: 'Uterus',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Pear-shaped muscular organ in female pelvis.',
    function: 'Site of embryo implantation and fetal development.',
    importance: 'Fibroids common. Uterine cancer typically presents with bleeding.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.68, z: 0.02 },
    exercises: []
  },
  {
    name: 'Testes',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Paired male gonads in the scrotum, oval-shaped.',
    function: 'Produce sperm and testosterone.',
    importance: 'Testicular cancer most common cancer in young men. Self-exam important.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 0.58, z: 0.1 },
    exercises: []
  },
  {
    name: 'Prostate',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Walnut-sized gland surrounding the male urethra below the bladder.',
    function: 'Produces fluid that nourishes and protects sperm.',
    importance: 'BPH common with age. Prostate cancer screening important.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 0.65, z: 0.04 },
    exercises: []
  },

  // ==================== ENDOCRINE ORGANS ====================
  {
    name: 'Thyroid Gland',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Butterfly-shaped gland in the anterior neck, wrapped around trachea.',
    function: 'Produces thyroid hormones (T3, T4) regulating metabolism.',
    importance: 'Hypothyroidism causes fatigue, weight gain. Hyperthyroidism causes anxiety, weight loss.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.42, z: 0.08 },
    exercises: []
  },
  {
    name: 'Parathyroid Glands',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Four small glands posterior to the thyroid, each about the size of a grain of rice.',
    function: 'Regulate calcium levels through parathyroid hormone (PTH).',
    importance: 'Hyperparathyroidism causes hypercalcemia. Can be damaged during thyroid surgery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.02, y: 1.42, z: 0.04 },
    exercises: []
  },
  {
    name: 'Adrenal Gland (Right)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Triangular gland atop the right kidney with cortex and medulla.',
    function: 'Cortex: cortisol, aldosterone, androgens. Medulla: epinephrine, norepinephrine.',
    importance: 'Addison\'s disease: adrenal insufficiency. Cushing\'s: excess cortisol.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.06, y: 0.96, z: -0.04 },
    exercises: []
  },
  {
    name: 'Adrenal Gland (Left)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Crescent-shaped gland atop the left kidney with cortex and medulla.',
    function: 'Cortex: cortisol, aldosterone, androgens. Medulla: epinephrine, norepinephrine.',
    importance: 'Stress hormones from adrenal medulla. Chronic stress affects function.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.06, y: 0.98, z: -0.04 },
    exercises: []
  },
  {
    name: 'Pituitary Gland',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Pea-sized gland in the sella turcica of the sphenoid bone.',
    function: 'Master endocrine gland controlling other glands. Anterior and posterior lobes.',
    importance: 'Pituitary tumors can affect vision and hormone production.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.62, z: 0.02 },
    exercises: []
  },
  {
    name: 'Pineal Gland',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Small pinecone-shaped gland in the brain, near the thalamus.',
    function: 'Produces melatonin regulating sleep-wake cycles.',
    importance: 'Affected by light exposure. Melatonin supplements for sleep disorders.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.6, z: -0.02 },
    exercises: []
  },
  {
    name: 'Thymus',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Bilobed organ in the anterior mediastinum, largest in childhood.',
    function: 'T-cell maturation and immune system development.',
    importance: 'Involutes with age. Myasthenia gravis associated with thymic abnormalities.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.28, z: 0.1 },
    exercises: []
  },

  // ==================== LYMPHATIC ORGANS ====================
  {
    name: 'Spleen',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Fist-sized organ in the left upper quadrant, beneath the diaphragm.',
    function: 'Filters blood, removes old RBCs, stores platelets, immune function.',
    importance: 'Can rupture with trauma. Splenectomy increases infection risk.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.1, y: 0.98, z: 0 },
    exercises: []
  },
  {
    name: 'Tonsils (Palatine)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Paired lymphoid tissue masses in the oropharynx.',
    function: 'First line immune defense against ingested or inhaled pathogens.',
    importance: 'Tonsillitis common in children. Tonsillectomy for recurrent infections.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.025, y: 1.54, z: 0.04 },
    exercises: []
  },
  {
    name: 'Adenoids (Pharyngeal Tonsil)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Lymphoid tissue in the nasopharynx, behind the nose.',
    function: 'Immune defense against nasal pathogens.',
    importance: 'Enlargement causes nasal obstruction and mouth breathing in children.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.58, z: 0.02 },
    exercises: []
  },

  // ==================== NERVOUS SYSTEM ORGANS ====================
  {
    name: 'Brain',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Central organ of the nervous system, approximately 1.4 kg, protected by skull.',
    function: 'Controls all body functions, cognition, emotion, sensation, movement.',
    importance: 'Exercise improves brain health through increased blood flow and BDNF.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.65, z: 0 },
    exercises: [
      { name: 'Aerobic Exercise', rank: 1, description: 'Increases BDNF and neuroplasticity.' },
      { name: 'Coordination Drills', rank: 2, description: 'Challenges brain with complex movements.' },
    ]
  },
  {
    name: 'Cerebrum',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Largest part of brain, divided into left and right hemispheres.',
    function: 'Higher cognitive functions, sensory processing, voluntary movement.',
    importance: 'Different lobes control different functions (frontal, parietal, temporal, occipital).',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.68, z: 0.02 },
    exercises: []
  },
  {
    name: 'Cerebellum',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Located inferior and posterior to cerebrum, "little brain."',
    function: 'Coordinates movement, balance, motor learning.',
    importance: 'Damage causes ataxia (uncoordinated movement). Important for sports skills.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.58, z: -0.08 },
    exercises: [
      { name: 'Balance Training', rank: 1, description: 'Challenges cerebellar function.' },
    ]
  },
  {
    name: 'Brainstem',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Connects cerebrum to spinal cord, includes midbrain, pons, and medulla.',
    function: 'Controls vital functions (breathing, heart rate), cranial nerve nuclei.',
    importance: 'Damage can be fatal. Contains centers for consciousness.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.56, z: -0.02 },
    exercises: []
  },
  // Spinal Cord is defined in nerves.ts

  // ==================== SENSORY ORGANS ====================
  {
    name: 'Eye (Right)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Spherical organ of vision, approximately 2.5 cm diameter.',
    function: 'Converts light into neural signals for vision.',
    importance: 'Cataracts, glaucoma, macular degeneration common with age.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.03, y: 1.64, z: 0.1 },
    exercises: []
  },
  {
    name: 'Eye (Left)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Spherical organ of vision, approximately 2.5 cm diameter.',
    function: 'Converts light into neural signals for vision.',
    importance: 'Regular eye exams important for detecting disease early.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.03, y: 1.64, z: 0.1 },
    exercises: []
  },
  {
    name: 'Ear (Right)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Organ of hearing and balance, divided into external, middle, and inner ear.',
    function: 'Converts sound waves to neural signals, maintains balance.',
    importance: 'Hearing loss common with age and noise exposure.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0.08, y: 1.62, z: 0 },
    exercises: []
  },
  {
    name: 'Ear (Left)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Organ of hearing and balance, divided into external, middle, and inner ear.',
    function: 'Converts sound waves to neural signals, maintains balance.',
    importance: 'Vestibular problems cause vertigo and balance issues.',
    modelLayer: 'skeleton_organs',
    position3D: { x: -0.08, y: 1.62, z: 0 },
    exercises: []
  },
  {
    name: 'Tongue',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Muscular organ in the mouth covered with taste buds.',
    function: 'Taste sensation, speech articulation, food manipulation, swallowing.',
    importance: 'Tongue cancer can occur. Essential for eating and speaking.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.54, z: 0.08 },
    exercises: []
  },

  // ==================== SKIN ====================
  {
    name: 'Skin (Integument)',
    type: 'organ',
    category: 'cardiovascular',
    description: 'Largest organ of the body, approximately 2 square meters and 3.5 kg.',
    function: 'Protection, thermoregulation, sensation, vitamin D synthesis.',
    importance: 'Skin cancer common with sun exposure. Wound healing important for recovery.',
    modelLayer: 'skeleton_organs',
    position3D: { x: 0, y: 1.0, z: 0.18 },
    exercises: []
  },
];
