import Image from "next/image";
import Link from "next/link";
import { getRandomWikiLanguage } from "./languages";

const Home = async () => {
  interface Language {
    language_code: string;
    language_name: string;
  }

  const fetchData = async (lang: Language) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/wiki?language_code=${lang.language_code}`
      );
      return response.text();
    } catch {
      return "gay";
    }
  };
  async function getServerSideProps() {
    const demoLanguage = await getRandomWikiLanguage();
    const data = await fetchData(demoLanguage);

    return { props: { demoLanguage, data } };
  }
  const props = getServerSideProps();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-300 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            LangGuessr: Guess The Language
          </h1>
        </div>
        <div className="max-w-5xl">
        <div className="flex justify-center">
          
          {(await props).props.demoLanguage.language_name}
        </div>
          <br />
          <br />
          {(await props).props.data}
        </div>
        <div className="flex justify-center">
          <Link href={`/quiz-wiki`}>
            <button className="flex justify-center animate-grow-shrink text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
              Play the game!
            </button>
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={"https://www.jkoh.dev/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          About Me
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={"https://github.com/jkohhokj/LangGuessr/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Source Code
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={"/resources"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Resources
        </a>
      </footer>
    </div>
  );
};

export default Home;
