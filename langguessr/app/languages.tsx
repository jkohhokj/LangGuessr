// import languages from '@/app/Data/languages.json';
import google_languages from '@/app/Data/languages_cut.json';
import wiki_languages_100 from '@/app/Data/top_100_wiki_languages.json'


// Languages removed:
//  Portuguese (Brazil), Portuguese (Portugal) because Portuguese
//  Spanish (Latin America) because Spanish
//  Norwegian (Nynorsk) because Norwegian
//  Montenergin, Croatian, Bosnian, and Serbian because Serbo-Croatian
//  Xhosa because Zulu
//  Kirundi because Kinyarwanda
//  Lingala because Swahili


let currentIndex = 0;
let shuffledWikiLanguages: typeof wiki_languages_100 = [];
let shuffledGoogleLanguages: typeof google_languages = [];

// shuffle languages using Fisher-Yates because Math.random bad on small sample size giving clusters
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}



function initializeShuffledList<T>(list: T[]): T[] {
  return shuffleArray(list);
}

export function getRandomWikiLanguage() {
  if (currentIndex === 0 || currentIndex >= wiki_languages_100.length) {
    shuffledWikiLanguages = initializeShuffledList(wiki_languages_100);
    currentIndex = 0;
  }

  return shuffledWikiLanguages[currentIndex++];
}


export function getRandomGoogleLanguage() {
  if (currentIndex === 0 || currentIndex >= google_languages.length) {
    shuffledGoogleLanguages = initializeShuffledList(google_languages);
    currentIndex = 0;
  }

  return shuffledGoogleLanguages[currentIndex++];
}