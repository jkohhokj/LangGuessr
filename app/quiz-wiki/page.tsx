"use client";

import { useState, useEffect} from "react";
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
    setQuestionLength(3); // number of questions
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

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center">
        <title>LangGuessr: Guess The Language</title>
        {!quizEnded ? ( // quiz page
          <>
            <div className="h-screen w-full flex justify-center items-center ">
              <div className="w-4/5 h-3/4 shadow-2xl flex flex-col justify-center items-center font-medium gap-16 ">
                <div>
                  <h1>Guess The Language!</h1>
                  <h3>Current Score</h3>
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
                <div className=" grid grid-cols-2 gap-8 gap-x-12 ">
                  {optionChoices.map((lang, index) => {
                    return (
                      <button
                        key={index}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ${
                          isQuestionAnswered && selectedChoiceIndex === index
                            ? optionChoices[selectedChoiceIndex] ===
                              answerLanguage.language_name
                              ? "bg-green-500" // Green if correct answer
                              : "bg-red-500" // Red if incorrect answer
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
                    <p>You chose {optionChoices[selectedChoiceIndex]}</p>
                    <p>Correct Answer is {answerLanguage.language_name}</p>
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
            <h1>Hurray, you finished the game!</h1>
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
                NextQuestion
              </button>
            ) : null}

            <Link href="/">Return to Home</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
