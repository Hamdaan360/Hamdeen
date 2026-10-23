import { TasbeehDhikr } from '../types';

export const TASBEEH_PRESETS: TasbeehDhikr[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥān Allāh',
    meaning: 'Glory be to Allah',
    defaultTarget: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    meaning: 'All praise is due to Allah',
    defaultTarget: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    meaning: 'Allah is the Greatest',
    defaultTarget: 34,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfiru Llāh',
    meaning: 'I seek the forgiveness of Allah',
    defaultTarget: 100,
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illā Llāh',
    meaning: 'There is no god worthy of worship except Allah',
    defaultTarget: 100,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'Allāhumma ṣalli ʿalā Muḥammad',
    meaning: 'O Allah, send blessings upon Muhammad',
    defaultTarget: 100,
  },
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Lā ḥawla walā quwwata illā biLlāh',
    meaning: 'There is no power nor strength except through Allah',
    defaultTarget: 100,
  },
  {
    id: 'subhanallahi-wabihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subḥāna Llāhi wa-biḥamdih, Subḥāna Llāhi l-ʿAẓīm',
    meaning: 'Glory be to Allah and His praise, Glory be to Allah the Almighty',
    defaultTarget: 100,
  },
];
