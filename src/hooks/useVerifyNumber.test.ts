import { renderHook, act, waitFor } from '@testing-library/react';
import { useVerifyNumber } from './useVerifyNumber';
import { VerifyService } from '../services/VerifyService';

// Mock VerifyService
jest.mock('../services/VerifyService', () => ({
  VerifyService: {
    verify: jest.fn(),
  },
}));

describe('useVerifyNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useVerifyNumber());

    expect(result.current.number).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('should update number', () => {
    const { result } = renderHook(() => useVerifyNumber());

    act(() => {
      result.current.setNumber('28');
    });

    expect(result.current.number).toBe('28');
  });

  it('should show error when verifying empty number', async () => {
    const { result } = renderHook(() => useVerifyNumber());

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.error).toBe('Por favor, digite um número.');
    expect(VerifyService.verify).not.toHaveBeenCalled();
  });

  it('should verify a perfect number successfully', async () => {
    (VerifyService.verify as jest.Mock).mockResolvedValue({
      isPerfect: true,
      matchedP: 3,
      method: 'test-method',
    });

    const { result } = renderHook(() => useVerifyNumber());

    act(() => {
      result.current.setNumber('28');
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toEqual({
      isPerfect: true,
      checkedNumber: '28',
      matchedP: 3,
      method: 'test-method',
    });
  });

  it('should verify a non-perfect number', async () => {
    (VerifyService.verify as jest.Mock).mockResolvedValue({
      isPerfect: false,
      matchedP: null,
    });

    const { result } = renderHook(() => useVerifyNumber());

    act(() => {
      result.current.setNumber('10');
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.result).toEqual({
      isPerfect: false,
      checkedNumber: '10',
      matchedP: null,
      method: undefined,
    });
  });

  it('should handle verification errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (VerifyService.verify as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useVerifyNumber());

    act(() => {
      result.current.setNumber('28');
    });

    await act(async () => {
      await result.current.handleVerify();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toEqual({
      isPerfect: false,
      checkedNumber: '28',
      matchedP: null,
    });

    consoleSpy.mockRestore();
  });
});
