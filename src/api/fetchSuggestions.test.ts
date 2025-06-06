import { fetchSuggestions } from './fetchSuggestions.ts';

const mockCountries = [
  {
    name: { common: 'France' },
    flag: '🇫🇷',
    cca3: 'FRA',
  },
  {
    name: { common: 'Finland' },
    flag: '🇫🇮',
    cca3: 'FIN',
  },
];

describe('fetchSuggestions', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('returns mapped User[] when fetch is successful', async () => {
    const mockJson = jest.fn().mockResolvedValue(mockCountries);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: mockJson,
    } as Partial<Response>);

    const signal = new AbortController().signal;
    const result = await fetchSuggestions('fr', signal);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('fr'), {
      signal,
    });
    expect(result).toEqual([
      { countryName: 'France 🇫🇷', id: 'FRA' },
      { countryName: 'Finland 🇫🇮', id: 'FIN' },
    ]);
  });

  it('returns empty array and warns if response is not ok', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn(),
    } as Partial<Response>);

    const signal = new AbortController().signal;
    const result = await fetchSuggestions('xyz', signal);

    expect(warnSpy).toHaveBeenCalledWith('Fetch failed:', 404);
    expect(result).toEqual([]);
    warnSpy.mockRestore();
  });

  it('returns empty array and logs info if fetch is aborted', async () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';

    global.fetch = jest.fn().mockRejectedValue(abortError);

    const signal = new AbortController().signal;
    const result = await fetchSuggestions('fr', signal);

    expect(infoSpy).toHaveBeenCalledWith('Fetch aborted');
    expect(result).toEqual([]);
    infoSpy.mockRestore();
  });

  it('returns empty array and logs error on other fetch errors', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const signal = new AbortController().signal;
    const result = await fetchSuggestions('fr', signal);

    expect(errorSpy).toHaveBeenCalledWith(
      'Error fetching suggestions:',
      expect.any(Error),
    );
    expect(result).toEqual([]);
    errorSpy.mockRestore();
  });
});
