"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRandomWikiLanguage } from "./languages";

const Home = () => {
  interface Language {
    language_code: string;
    language_name: string;
  }
  const default_lang: Language = {
    language_code: "default_lang",
    language_name: "Default Language",
  };

  const [answerLanguage, setAnswerLanguage] = useState(default_lang);
  const [isLoading, setIsLoading] = useState<boolean>(true); // buffering state when API is slow
  const [str, setStr] = useState(`gay`);

  useEffect(() => {
    setAnswerLanguage(getRandomWikiLanguage());
  }, []);

  // change answer choices when answerLanguage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/wiki?language_code=${answerLanguage.language_code}`
        );
        if (!response.ok) {
          // throw new Error("Failed to fetch data");
        }
        setStr(await response.text());
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (answerLanguage.language_code !== "ja") {
      fetchData();
    }
  }, [answerLanguage]);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-center">
          <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-300 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            LangGuessr: Guess The Language
          </h1>
        </div>
        <div className="max-w-screen-lg">
          {!isLoading ? (
            <div className="">
              <h1 className="flex justify-center text-3xl font-extrabold leading-9 tracking-tight text-blue-300 dark:text-blue-100">
                {answerLanguage.language_name}
                :&nbsp;
                {answerLanguage.language_code}
              </h1>
              <br />
              <div className="block max-w-screen-lg max-h-96 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="whitespace-normal truncate overflow-ellipse max-h-72">
                  {str.split("=").map((line, index) => (
                    <p key={index}>
                      {line}
                      <br />
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
          <br />
          <div className="flex justify-center">
            <Link href={`/quiz-wiki`}>
              <button className="animate-grow-shrink text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                Play the game!
              </button>
            </Link>
          </div>
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
