import React, { useEffect, useRef, useState } from 'react';
import './AutoComplete.styles.css';
import { highlightMatch } from '../../utils/highlightMatch.tsx';
import { useDebounce } from '../../hooks/useDebounce.ts';
import type { User } from './types.ts';
import { constants } from '../../constants/index.ts';
import { fetchSuggestions } from '../../api/fetchSuggestions.ts';

const AutoComplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const cache = useRef<Map<string, User[]>>(new Map());
  const debounced = useDebounce(inputValue, constants.DEBOUNCE_DELAY);

  useEffect(() => {
    if (!debounced || selected) {
      setSuggestions([]);
      setNoMatch(false);
      return;
    }

    if (cache.current.has(debounced)) {
      const cachedSuggestions = cache.current.get(debounced)!;
      setSuggestions(cachedSuggestions);
      setNoMatch(cachedSuggestions.length === 0);

      console.info('Using cached suggestions for:', debounced);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    fetchSuggestions(debounced, signal)
      .then((results) => {
        if (signal.aborted) return;
        cache.current.set(debounced, results);
        setSuggestions(results);
        setNoMatch(results.length === 0);
        setHighlightedIndex(-1);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debounced, selected]);

  const handleSelect = (countryName: string) => {
    setInputValue(countryName);
    setSuggestions([]);
    setSelected(countryName);
    setNoMatch(false);
    setLoading(false);
    setHighlightedIndex(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelected(null);
    setNoMatch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === constants.KEY_CODES.ARROW_DOWN) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === constants.KEY_CODES.ARROW_UP) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1,
      );
    }

    if (e.key === constants.KEY_CODES.ENTER && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex].countryName);
    }

    if (e.key === constants.KEY_CODES.ESCAPE) {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div
      className="autocomplete-container"
      role="combobox"
      aria-expanded={suggestions.length > 0}
      aria-haspopup="listbox"
      aria-owns={constants.AUTOCOMPLETE_LISTBOX_ID}
      aria-controls={constants.AUTOCOMPLETE_LISTBOX_ID}
    >
      <h1 className="autocomplete-title">Country Autocomplete</h1>
      <p className="autocomplete-description">
        Start typing a country name to see suggestions. Use arrow keys to
        navigate, Enter to select, and Escape to close the suggestions.
      </p>
      <input
        id={constants.AUTOCOMPLETE_INPUT_ID}
        type="text"
        placeholder={constants.AUTOCOMPLETE_PLACEHOLDER}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`autocomplete-input ${loading ? 'loading' : ''}`}
        aria-label="Country search input"
        aria-autocomplete="list"
        aria-controls={constants.AUTOCOMPLETE_LISTBOX_ID}
        aria-activedescendant={
          highlightedIndex >= 0
            ? `autocomplete-option-${highlightedIndex}`
            : undefined
        }
      />

      {suggestions.length > 0 && !selected && (
        <ul
          className="autocomplete-suggestions"
          id={constants.AUTOCOMPLETE_LISTBOX_ID}
          role="listbox"
          aria-label="Country suggestions"
        >
          {suggestions.map(({ countryName, id }, index) => (
            <li
              key={id}
              id={`autocomplete-option-${index}`}
              className={`autocomplete-suggestion ${
                highlightedIndex === index ? 'highlighted' : ''
              }`}
              onClick={() => handleSelect(countryName)}
              aria-label={countryName}
              role="option"
              aria-selected={highlightedIndex === index}
            >
              {highlightMatch(countryName, inputValue)}
            </li>
          ))}
        </ul>
      )}

      {!loading && noMatch && (
        <div className="autocomplete-no-match">
          {constants.NO_MATCH_MESSAGE}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
