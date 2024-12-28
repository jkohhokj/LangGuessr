// import languages from '@/app/Data/languages.json';
import languages from '@/app/Data/languages_cut.json';


// Languages removed:
//  Portuguese (Brazil), Portuguese (Portugal) because Portuguese
//  Spanish (Latin America) because Spanish
//  Norwegian (Nynorsk) because Norwegian
//  Montenergin, Croatian, Bosnian, and Serbian because Serbo-Croatian
//  Xhosa because Zulu
//  Kirundi because Kinyarwanda
//  Lingala because Swahili


function getRandomLanguage() {
  const randomIndex = Math.floor(Math.random() * languages.length);
  return languages[randomIndex];
}

export default getRandomLanguage;