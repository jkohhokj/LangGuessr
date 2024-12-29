import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_SERPAPI_API_KEY;
if (!apiKey) {
  throw new Error("API key not set!");
}

//covers highlight, stories, and regular title
export interface NewsResult {
  position?: number; // Explicitly typed as a number
  highlight?: {
    title: string;
    source: {
      name: string;
      icon: string;
    }; // Explicitly typed
    link: string;
    thumbnail?: string;
    thumbnail_small?: string;
    date: string;
  };
  stories?: Array<
    {
      position: number; // Explicitly typed as a number
      title: string;
      source: {
        name: string;
        icon: string;
      }; // Explicitly typed
      link: string;
      thumbnail: string;
      thumbnail_small: string;
      story_token: string;
      serpapi_link: string;
      date: string;
    } 
  >;
  title?: string; // Explicitly typed as string
}


export const fetchNewsData = async (language_code: string) => {
  const response = await fetch(
    `/api/proxy-news?language_code=${language_code}&apiKey=${apiKey}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};


export const languageTextComponent = (newsResults: NewsResult[]) => {
  return (
    <div>
      <ul>
        {newsResults.map((news, correctIndex) => {
          const titles = []; // To store all titles (highlight, stories, and normal titles)

          // Extract the title from highlight
          if (news.highlight?.title) {
            titles.push(news.highlight.title);
          }

          // Extract titles from stories
          if (news.stories) {
            news.stories.forEach((story: { title: any }) => {
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
    </div>
  );
};