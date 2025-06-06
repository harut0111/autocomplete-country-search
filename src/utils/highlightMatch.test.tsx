import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { highlightMatch } from './highlightMatch.tsx';

describe('highlightMatch', () => {
  it('returns original text if query is empty', () => {
    const result = highlightMatch('Canada', '');
    expect(result).toBe('Canada');
  });

  it('highlights matching part', () => {
    const { container } = render(
      <>{highlightMatch('United States', 'United')}</>,
    );
    expect(container.querySelector('mark')).toHaveTextContent('United');
  });

  it('is case-insensitive', () => {
    const { container } = render(<>{highlightMatch('Germany', 'ger')}</>);
    expect(container.querySelector('mark')).toHaveTextContent('Ger');
  });

  it('handles multiple matches', () => {
    const { container } = render(<>{highlightMatch('Banana Bandana', 'an')}</>);
    const marks = container.querySelectorAll('mark');
    expect(marks.length).toBeGreaterThan(1);
  });
});
