import Image from "next/image";
import {getRandomGoogleLanguage} from "./languages";
import sample_language1 from "@/app/Data/sample_language1.json";
import { NewsResult} from "./google_news";

const Home = async () => {

  const randomLanguage = getRandomGoogleLanguage();

  let newsResults: NewsResult[] = [];
  try {
    // newsResults = await fetchNewsData(randomLanguage.language_code, apiKey); // UNCOMMENT TO USE REAL API
    newsResults = sample_language1["news_results"];
  } catch (error) {
    console.error("Error fetching news data:", error);
  }

  const tempChoicesSet = new Set<string>();

  while (tempChoicesSet.size < 5) {
    const selectedLanguage = getRandomGoogleLanguage();
    tempChoicesSet.add(selectedLanguage.language_name);
  }

  const tempChoices = Array.from(tempChoicesSet);
  while (tempChoices.length < 5) {
    const selectedLanguage = getRandomGoogleLanguage();
    tempChoices.push(selectedLanguage.language_name);
  }

  const correctIndex = Math.floor(Math.random() * 6);
  const optionChoices = tempChoices
    .slice(0, correctIndex)
    .concat(randomLanguage.language_name, tempChoices.slice(correctIndex));

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div>
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Guess The Language
          </h1>
          <div>
            <p>{randomLanguage.language_name}</p>
            <p>{randomLanguage.language_code}</p>
            <p>{randomLanguage.local_name}</p>
          </div>
          <ul>
            {newsResults.map((news, correctIndex) => {
              const titles = []; // To store all titles (highlight, stories, and normal titles)

              // Extract the title from highlight
              if (news.highlight?.title) {
                titles.push(news.highlight.title);
              }

              // Extract titles from stories
              if (news.stories) {
                news.stories.forEach((story) => {
                  if (story.title) {
                    titles.push(story.title);
                  }
                });
              }
              if (news.title) {
                titles.push(news.title);
              }

              // Render all titles (highlight and stories)
              return (
                <li key={correctIndex}>
                  {titles.map((title, idx) => (
                    <p key={idx}>{title}</p>
                  ))}
                </li>
              );
            })}
          </ul>
          <div>
            {optionChoices.map((lang, index) => {
              return (
                <button
                  key={index}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
};

export default Home;
