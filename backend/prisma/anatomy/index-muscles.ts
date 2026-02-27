import { HEAD_NECK_MUSCLES } from './muscles-head-neck';
import { TRUNK_MUSCLES } from './muscles-trunk';
import { UPPER_LIMB_MUSCLES } from './muscles-upper-limb';
import { LOWER_LIMB_MUSCLES } from './muscles-lower-limb';

export const ALL_MUSCLES = [
  ...HEAD_NECK_MUSCLES,
  ...TRUNK_MUSCLES,
  ...UPPER_LIMB_MUSCLES,
  ...LOWER_LIMB_MUSCLES,
];

export { HEAD_NECK_MUSCLES, TRUNK_MUSCLES, UPPER_LIMB_MUSCLES, LOWER_LIMB_MUSCLES };
