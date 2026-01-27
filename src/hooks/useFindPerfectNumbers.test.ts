import { renderHook, act } from '@testing-library/react';
import { useFindPerfectNumbers } from './useFindPerfectNumbers';

// Mock Worker
class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  
  constructor(public url: string) {}

  postMessage = jest.fn((data) => {
    // Simulate worker response based on data if needed
    // For now we can manually trigger onmessage from tests if we expose the worker instance
  });

  terminate = jest.fn();
}

// @ts-ignore
global.Worker = MockWorker;

describe('useFindPerfectNumbers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFindPerfectNumbers());

    expect(result.current.rangeStart).toBe('');
    expect(result.current.rangeEnd).toBe('');
    expect(result.current.foundNumbers).toBeNull();
    expect(result.current.isSearching).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update range inputs', () => {
    const { result } = renderHook(() => useFindPerfectNumbers());

    act(() => {
      result.current.setRangeStart('1');
      result.current.setRangeEnd('100');
    });

    expect(result.current.rangeStart).toBe('1');
    expect(result.current.rangeEnd).toBe('100');
  });

  it('should validate empty inputs', () => {
    const { result } = renderHook(() => useFindPerfectNumbers());

    act(() => {
      result.current.handleFind();
    });

    expect(result.current.error).toBe('Por favor, preencha ambos os campos.');
  });

  it('should validate invalid numbers', () => {
    const { result } = renderHook(() => useFindPerfectNumbers());

    act(() => {
      result.current.setRangeStart('abc');
      result.current.setRangeEnd('100');
    });

    act(() => {
      result.current.handleFind();
    });

    expect(result.current.error).toBe('Por favor, insira números válidos.');
  });

  it('should validate start >= end', () => {
    const { result } = renderHook(() => useFindPerfectNumbers());

    act(() => {
      result.current.setRangeStart('100');
      result.current.setRangeEnd('50');
    });

    act(() => {
      result.current.handleFind();
    });

    expect(result.current.error).toBe('O número inicial deve ser menor que o número final.');
  });

  it('should start worker and search', () => {
    const { result } = renderHook(() => useFindPerfectNumbers());

    act(() => {
      result.current.setRangeStart('1');
      result.current.setRangeEnd('1000');
    });

    act(() => {
      result.current.handleFind();
    });

    expect(result.current.isSearching).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.foundNumbers).toBeNull();
  });
});
