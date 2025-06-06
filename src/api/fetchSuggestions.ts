import type { Country, User } from '../components/AutoComplete/types.ts';

export const fetchSuggestions = async (
  query: string,
  signal: AbortSignal,
): Promise<User[]> => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`,
      { signal },
    );

    if (!response.ok) {
      console.warn('Fetch failed:', response.status);
      return [];
    }

    const data = await response.json();

    const results: User[] = (data as Country[]).map(
      ({ name, flag, cca3 }): User => ({
        countryName: `${name.common} ${flag}`,
        id: cca3,
      }),
    );

    return results;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.info('Fetch aborted');
    } else {
      console.error('Error fetching suggestions:', error);
    }
    return [];
  }
};
