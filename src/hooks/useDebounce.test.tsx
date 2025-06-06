import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce.ts';

jest.useFakeTimers();

describe('useDebounce', () => {
  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  test('updates value after delay', () => {
    let value = 'hello';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    value = 'world';
    rerender();

    expect(result.current).toBe('hello');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('world');
  });

  test('clear timeout on quick successive updates', () => {
    let value = 'hello';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    value = 'world';
    rerender();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('hello');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('world');
  });
});
