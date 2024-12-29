import { NextResponse } from "next/server";
import wiki_topics from "@/app/Data/wiki_topics_with_300_languages.json";


export function getRandomTopic() {
  const randomIndex = Math.floor(Math.random() * wiki_topics.length);
  return wiki_topics[randomIndex];
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // Parse the URL
  const language_code = searchParams.get("language_code") || "en"; // Get the 'language_code' query parameter
    const randomTopic = getRandomTopic();
  const response = await fetch(
    `https://${language_code}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${randomTopic.topic}&format=json`
  );
    if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.statusText}`);
  }
  const data = await response.json();
  const firstPageId = await data.query.search[0]?.pageid;

  // // Fetch the page extract using the page ID
  const response2 = await fetch(
    `https://${language_code}.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&&pageids=${firstPageId}&format=json`
  );
  if (!response2.ok) {
    throw new Error(`Failed to fetch page details: ${response2.statusText}`);
  }
  const data2 = await response2.json();
  console.log(data2);
  let extract = data2["query"]["pages"][firstPageId]["extract"];
  const removeSpecialCharacters = (str: string) => {
    return str.replace(/[\r\t\n=]+/g, "=").replace(/=+/g, "=");
  };
  extract = removeSpecialCharacters(extract);
  const truncateString = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  };
  extract = truncateString(extract, 1000);

  return NextResponse.json(extract);
}
