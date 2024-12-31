
const Home = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col justify-center items-center sm:items-start">
          <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-300 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            LangGuessr: Guess The Language
          </h1>
          <p className="text-lg mt-2 text-gray-500 dark:text-gray-300">
            Here are some resources to help you get started:
          </p>
          <div className="mt-4">
            <ul className="space-y-4">
              <li>
                <a
                  href="https://theweek.com/articles/617776/how-identify-language-glance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Beginner&apos;s Article
                </a>
              </li>
              <li>
                <a
                  href="https://www.languageline.com/hubfs/LanguageLine_Collateral/Language_ID_Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Example Texts
                </a>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/r/france/comments/l9a92r/quelle_langue_suisje_en_train_de_lire/#lightbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Reddit Shitpost
                </a>
              </li>
            </ul>
          </div>
        </div>
        <footer className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-300">
            Good luck and have fun! - Jayden
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
