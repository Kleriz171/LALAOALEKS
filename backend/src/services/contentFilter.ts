const BANNED_WORDS = [
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitting', 'shitted', 'shits',
  'bitch', 'bitches', 'bitching',
  'ass', 'asshole', 'assholes',
  'bastard', 'bastards',
  'damn', 'damned',
  'cunt', 'cunts',
  'dick', 'dicks',
  'cock', 'cocks',
  'pussy', 'pussies',
  'whore', 'whores',
  'slut', 'sluts',
  'piss', 'pissed', 'pissing',
  'nigger', 'niggers', 'nigga',
  'faggot', 'faggots', 'fag',
  'retard', 'retarded', 'retards',
  'rape', 'raped', 'raping', 'rapist',
  'porn', 'porno', 'pornography',
  'sex', 'sexy', 'sexual',
  'nude', 'nudes', 'naked',
  'penis', 'vagina', 'boobs', 'boob', 'tits', 'tit',
  'anal', 'blowjob', 'handjob',
  'masturbate', 'masturbation',
  'horny', 'orgasm',
  'hell', 'hells',
  'crap', 'crappy',
  'idiot', 'idiots', 'stupid', 'moron', 'morons',
  'kill', 'kills', 'killed', 'killing',
  'die', 'dies', 'died',
  'hate', 'hated', 'hating',
];

const WORD_REGEX = new RegExp(
  `\\b(${BANNED_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'i'
);

export function containsInappropriateContent(text: string): boolean {
  return WORD_REGEX.test(text);
}

export function getContentError(fieldName: string = 'Content'): string {
  return `${fieldName} contains inappropriate language. Please keep the app respectful and family-friendly.`;
}
