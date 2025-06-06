import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AutoComplete from './AutoComplete.tsx';
import { fetchSuggestions } from '../../api/fetchSuggestions.ts';
import { constants } from '../../constants/index.ts';

const mockedFetchSuggestions = fetchSuggestions as jest.MockedFunction<
  typeof fetchSuggestions
>;

jest.mock('../../api/fetchSuggestions.ts', () => ({
  fetchSuggestions: jest.fn(),
}));
jest.mock('../../utils/highlightMatch.tsx', () => ({
  highlightMatch: (text: string) => text,
}));
jest.mock('../../hooks/useDebounce.ts', () => ({
  useDebounce: (value: string) => value,
}));

const mockSuggestions = [
  { id: '1', countryName: 'Armenia' },
  { id: '2', countryName: 'Argentina' },
];

describe('AutoComplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "No suggestions found" when no results', async () => {
    mockedFetchSuggestions.mockResolvedValueOnce([]);

    render(<AutoComplete />);
    const input = screen.getByPlaceholderText(
      constants.AUTOCOMPLETE_PLACEHOLDER,
    );

    fireEvent.change(input, { target: { value: 'xyz' } });

    await waitFor(() => {
      expect(screen.getByText(constants.NO_MATCH_MESSAGE)).toBeInTheDocument();
    });
  });

  it('navigates suggestions with keyboard and selects with Enter', async () => {
    mockedFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<AutoComplete />);
    const input = screen.getByPlaceholderText(
      constants.AUTOCOMPLETE_PLACEHOLDER,
    );

    fireEvent.change(input, { target: { value: 'Ar' } });

    await waitFor(() => {
      expect(screen.getByText('Armenia')).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: constants.KEY_CODES.ARROW_DOWN });
    fireEvent.keyDown(input, { key: constants.KEY_CODES.ENTER });

    expect(input).toHaveValue('Armenia');
    expect(screen.queryByText('Argentina')).not.toBeInTheDocument();
  });

  it('closes suggestions on Escape', async () => {
    mockedFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<AutoComplete />);
    const input = screen.getByPlaceholderText(
      constants.AUTOCOMPLETE_PLACEHOLDER,
    );

    fireEvent.change(input, { target: { value: 'Ar' } });

    await waitFor(() => {
      expect(screen.getByText('Armenia')).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: constants.KEY_CODES.ESCAPE });

    expect(screen.queryByText('Armenia')).not.toBeInTheDocument();
  });

  it('uses cached suggestions', async () => {
    mockedFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<AutoComplete />);
    const input = screen.getByPlaceholderText(
      constants.AUTOCOMPLETE_PLACEHOLDER,
    );

    fireEvent.change(input, { target: { value: 'Ar' } });

    await waitFor(() => {
      expect(screen.getByText('Armenia')).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.change(input, { target: { value: 'Ar' } });

    expect(fetchSuggestions).toHaveBeenCalledTimes(1);
  });

  it('renders input and description', () => {
    render(<AutoComplete />);
    expect(
      screen.getByPlaceholderText(constants.AUTOCOMPLETE_PLACEHOLDER),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/start typing a country name/i),
    ).toBeInTheDocument();
    mockedFetchSuggestions.mockResolvedValueOnce(mockSuggestions);
  });

  it('shows suggestions when input changes', async () => {
    mockedFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<AutoComplete />);
    const input = screen.getByPlaceholderText(
      constants.AUTOCOMPLETE_PLACEHOLDER,
    );

    fireEvent.change(input, { target: { value: 'Ar' } });

    await waitFor(() => {
      expect(fetchSuggestions).toHaveBeenCalledWith('Ar', expect.any(Object));
    });

    await waitFor(() => {
      expect(screen.getByText('Armenia')).toBeInTheDocument();
      expect(screen.getByText('Argentina')).toBeInTheDocument();
    });
  });

  it('selects suggestion on click', async () => {
    mockedFetchSuggestions.mockResolvedValueOnce(mockSuggestions);

    render(<AutoComplete />);
    const input = screen.getByPlaceholderText(
      constants.AUTOCOMPLETE_PLACEHOLDER,
    );

    fireEvent.change(input, { target: { value: 'Ar' } });

    await waitFor(() => {
      expect(screen.getByText('Armenia')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Armenia'));

    expect(input).toHaveValue('Armenia');
    expect(screen.queryByText('Argentina')).not.toBeInTheDocument();
    mockedFetchSuggestions.mockResolvedValueOnce([]);
  });
});
