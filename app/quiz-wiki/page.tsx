"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRandomWikiLanguage } from "@/app/languages";
interface Language {
  language_code: string;
  language_name: string;
}

const default_lang: Language = {
  language_code: "default_lang",
  language_name: "Default Language",
};

const getRandomChoices = (lang: Language) => {
  const tempChoices: string[] = [];
  const seenLanguages = new Set<string>();

  while (tempChoices.length < 5) {
    const selectedLanguage = getRandomWikiLanguage();
    if (
      selectedLanguage.language_code !== lang.language_code &&
      !seenLanguages.has(selectedLanguage.language_name)
    ) {
      tempChoices.push(selectedLanguage.language_name);
      seenLanguages.add(selectedLanguage.language_name);
    }
  }

  const correctIndex = Math.floor(Math.random() * 6);
  const optionChoices = tempChoices
    .slice(0, correctIndex)
    .concat(lang.language_name, tempChoices.slice(correctIndex));
  return optionChoices;
};

const Home = () => {
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(-1);
  const [totalScore, setTotalScore] = useState(0);
  const [optionChoices, setOptionChoices] = useState<string[]>([]);
  const [answerLanguage, setAnswerLanguage] = useState(default_lang);
  const [isLoading, setIsLoading] = useState<boolean>(true); // buffering state when API is slow
  const [str, setStr] = useState(`gay`);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(0);

  // initialize on page load
  useEffect(() => {
    setQuestionLength(5); // number of questions
    setQuestionNumber(0);
  }, []);

  // change language when question number increases
  useEffect(() => {
    if (questionNumber >= 0) {
      const random = getRandomWikiLanguage();
      setAnswerLanguage(random);
    }
  }, [questionNumber]);

  // change answer choices when answerLanguage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/wiki?language_code=${answerLanguage.language_code}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        setStr(await response.text());
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (questionNumber >= 0) {
      fetchData();
      const newChoices = getRandomChoices(answerLanguage);
      setOptionChoices(newChoices);
    }
  }, [answerLanguage]);

  const handleChoice = (choiceIndex: number) => {
    if (!isQuestionAnswered) {
      if (optionChoices[choiceIndex] === answerLanguage.language_name) {
        setTotalScore(totalScore + 1);
      }
      setIsQuestionAnswered(true);
      setSelectedChoiceIndex(choiceIndex);
    }
  };

  const endMessage = () => {
    if (totalScore == questionNumber) return "Wow! You're literally perfect";
    else if (totalScore > questionNumber / 2) return "Not bad...";
    else return "You failed.";
  };

  return (
    <div>
      <div className="min-h-screen w-full flex justify-center items-center">
        {!quizEnded ? ( // quiz page
          <>
            <div className=" w-64 bg-gray-800 text-white p-4">
              <h2 className="flex justify-center text-lg font-semibold">
                Score:
              </h2>

              <div className="flex justify-center py-2">
                {isQuestionAnswered ? (
                  <>
                    {totalScore}/{questionNumber + 1}
                  </>
                ) : (
                  <>
                    {totalScore}/{questionNumber}
                  </>
                )}
              </div>
            </div>
            <div className="h-screen w-full flex justify-center items-center">
              <div className="w-4/5 h-3/4 shadow-2xl flex flex-col justify-center items-center font-medium gap-16">
                <h1 className="text-6xl font-extrabold text-center text-gray-200">
                  Guess The Language!
                </h1>
                <div>
                  {!isLoading ? (
                    <div className="block max-w-lg max-h-96 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      <div className="whitespace-normal truncate overflow-ellipse max-h-72">
                        {str.split("=").map((line, index) => (
                          <p key={index}>
                            {line}
                            <br />
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
                <div className=" grid grid-cols-3 gap-8 gap-x-12 ">
                  {optionChoices.map((lang, index) => {
                    return (
                      <button
                        key={index}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ${
                          isQuestionAnswered && selectedChoiceIndex === index
                            ? optionChoices[selectedChoiceIndex] ===
                              answerLanguage.language_name
                              ? "bg-green-500 hover:bg-green-700" // Green if correct answer
                              : "bg-red-500 hover:bg-green-700" // Red if incorrect answer
                            : isQuestionAnswered &&
                              optionChoices[index] ===
                                answerLanguage.language_name
                            ? "bg-green-500 hover:bg-green-700"
                            : ""
                        }`}
                        onClick={() => {
                          handleChoice(index);
                        }}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
                {isQuestionAnswered ? (
                  <div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                      onClick={() => {
                        if (questionNumber + 1 === questionLength) {
                          setQuizEnded(true);
                        } else {
                          setQuestionNumber(questionNumber + 1);
                        }
                        setIsQuestionAnswered(false);
                      }}
                    >
                      NextQuestion
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          // end page
          <div className="w-4/5 min-h-[75%] shadow-2xl flex flex-col justify-center items-center font-medium gap-16">
            <h1>{endMessage()}</h1>
            <h1 className="text-2xl">
              Your score is {totalScore} out of {questionLength}
            </h1>

            {isQuestionAnswered ? (
              <button
                className=" bg-gray-900 px-3 py-2 w-max text-white "
                onClick={() => {
                  if (questionNumber + 1 === questionLength) {
                    setQuizEnded(true);
                  } else {
                    setQuestionNumber(0);
                  }
                  setIsQuestionAnswered(false);
                }}
              >
                End Game
              </button>
            ) : null}
            <div className="flex flex-row space-x-8">
              <Link href="/">
                <button className=" text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                  Return to Home
                </button>
              </Link>
              <Link href="/quiz-wiki">
                <button
                  className="text-white bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => {
                    setQuizEnded(false);
                    setQuestionNumber(0);
                    setTotalScore(0);
                  }}
                >
                  Play Again
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
