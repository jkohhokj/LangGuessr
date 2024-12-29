// app/api/proxy-news/route.ts
import axios from 'axios';

// Define the structure of the incoming query parameters
interface QueryParams {
  language_code: string | null;
  apiKey: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language_code = searchParams.get('language_code');
  const apiKey = searchParams.get('apiKey');

  const queryParams: QueryParams = {
    language_code,
    apiKey,
  };

  // Validate that required parameters exist
  if (!queryParams.language_code || !queryParams.apiKey) {
    return new Response('Missing parameters', { status: 400 });
  }

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_news',
        hl: queryParams.language_code,
        api_key: queryParams.apiKey,
      },
    });

    // Return the external API response to the client
    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle errors if the API call fails
    console.error('Error fetching news data:', error);
    return new Response('Failed to fetch data', { status: 500 });
  }
}
