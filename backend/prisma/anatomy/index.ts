export { ALL_BONES } from './index-bones';
export { SKULL_BONES } from './bones-skull';
export { SPINE_BONES } from './bones-spine';
export { THORAX_BONES } from './bones-thorax';
export { UPPER_LIMB_BONES } from './bones-upper-limb';
export { LOWER_LIMB_BONES } from './bones-lower-limb';

export { ALL_MUSCLES } from './index-muscles';
export { HEAD_NECK_MUSCLES } from './muscles-head-neck';
export { TRUNK_MUSCLES } from './muscles-trunk';
export { UPPER_LIMB_MUSCLES } from './muscles-upper-limb';
export { LOWER_LIMB_MUSCLES } from './muscles-lower-limb';

export { ALL_NERVES } from './nerves';

export { ALL_ORGANS } from './organs';

export { ALL_BLOOD_VESSELS } from './blood-vessels';

import { ALL_BONES } from './index-bones';
import { ALL_MUSCLES } from './index-muscles';
import { ALL_NERVES } from './nerves';
import { ALL_ORGANS } from './organs';
import { ALL_BLOOD_VESSELS } from './blood-vessels';

export const COMPLETE_ANATOMY = [
  ...ALL_BONES,
  ...ALL_MUSCLES,
  ...ALL_NERVES,
  ...ALL_ORGANS,
  ...ALL_BLOOD_VESSELS,
];
