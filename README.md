# Autocomplete Country Search

A React + TypeScript application that provides an accessible, keyboard-navigable autocomplete input for searching country names using the [REST Countries API](https://restcountries.com/). The project is built with Vite, uses modern React features, and includes comprehensive unit tests.

---

## Features

- **Autocomplete Input**: Type to search for countries, with suggestions fetched from a public API.
- **Keyboard Navigation**: Use arrow keys to navigate, Enter to select, and Escape to close suggestions.
- **Highlighting**: Matching parts of suggestions are highlighted.
- **Debounced Search**: Reduces API calls by debouncing user input.
- **Caching**: Previously fetched suggestions are cached for performance.
- **Accessible**: Uses ARIA roles and attributes for screen reader support.
- **Unit Tested**: Includes tests for hooks, utilities, API, and the main component.

---

## Project Structure

```
.
├── public/                  # Static assets (e.g., vite.svg)
├── src/
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   ├── vite-env.d.ts        # Vite/TypeScript env types
│   ├── api/
│   │   ├── fetchSuggestions.ts         # Fetches country suggestions from API
│   │   └── fetchSuggestions.test.ts    # Unit tests for fetchSuggestions
│   ├── assets/              # App-specific assets (e.g., react.svg)
│   ├── components/
│   │   └── AutoComplete/
│   │       ├── AutoComplete.tsx        # Main autocomplete component
│   │       ├── AutoComplete.styles.css # Component styles
│   │       ├── AutoComplete.test.tsx   # Unit tests for component
│   │       └── types.ts                # Type definitions (User, Country)
│   ├── constants/
│   │   └── index.ts         # Shared constants (IDs, debounce delay)
│   ├── hooks/
│   │   ├── useDebounce.ts           # Debounce hook for input
│   │   └── useDebounce.test.tsx     # Unit tests for debounce hook
│   └── utils/
│       ├── highlightMatch.tsx       # Highlights matching text in suggestions
│       └── highlightMatch.test.tsx  # Unit tests for highlightMatch
├── .gitignore
├── .prettierrc
├── .prettierignore
├── eslint.config.js
├── jest.config.ts
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── index.html
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd autocomplete
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the app.

### Building for Production

```sh
npm run build
# or
yarn build
```

### Running Tests

```sh
npm test
# or
yarn test
```

---

## Detailed File/Folder Descriptions

### `src/components/AutoComplete/`

- **AutoComplete.tsx**: The main autocomplete component. Handles input, keyboard navigation, suggestion rendering, caching, and accessibility.
- **AutoComplete.styles.css**: CSS for the autocomplete UI.
- **AutoComplete.test.tsx**: Unit tests for the component, covering user interactions and edge cases.
- **types.ts**: TypeScript interfaces for country/user data.

### `src/api/`

- **fetchSuggestions.ts**: Fetches country data from the REST Countries API, maps it to the app's format, and handles errors/aborts.
- **fetchSuggestions.test.ts**: Unit tests for API fetching, including error and abort scenarios.

### `src/hooks/`

- **useDebounce.ts**: Custom React hook to debounce a value (e.g., input) by a specified delay.
- **useDebounce.test.tsx**: Unit tests for the debounce hook.

### `src/utils/`

- **highlightMatch.tsx**: Utility to highlight matching substrings in suggestions using `<mark>`.
- **highlightMatch.test.tsx**: Unit tests for the highlight utility.

### `src/constants/`

- **index.ts**: Shared constants (input/listbox IDs, debounce delay).

### `src/App.tsx` and `src/main.tsx`

- **App.tsx**: Renders the main `AutoComplete` component.
- **main.tsx**: React entry point, renders the app into the DOM.

### Config Files

- **vite.config.ts**: Vite configuration for React/TypeScript.
- **jest.config.ts**: Jest configuration for running tests with TypeScript.
- **eslint.config.js**: ESLint configuration for code linting.
- **.prettierrc / .prettierignore**: Prettier formatting rules and ignore patterns.
- **tsconfig.json / tsconfig.app.json**: TypeScript configuration.

---

## Accessibility

- Uses ARIA roles (`combobox`, `listbox`, `option`) and attributes for screen reader support.
- Keyboard navigation: Arrow keys, Enter, and Escape are fully supported.

---

## API

- **REST Countries API**: [https://restcountries.com/v3.1/name/{name}](https://restcountries.com/v3.1/name/{name})
- The app fetches countries matching the user's input and displays their names and flags.

---

## License

This project is for demonstration and interview purposes.

---

## Author

- Harut Mukoyan
