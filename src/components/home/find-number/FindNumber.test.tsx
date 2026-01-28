import { render, screen, fireEvent } from '@testing-library/react';
import { FindNumber } from './FindNumber';
import { useFindPerfectNumbers } from '../../../hooks/useFindPerfectNumbers';

// Mock the hook
jest.mock('../../../hooks/useFindPerfectNumbers');

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

describe('FindNumber', () => {
  const mockHandleFind = jest.fn();
  const mockSetRangeStart = jest.fn();
  const mockSetRangeEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFindPerfectNumbers as jest.Mock).mockReturnValue({
      rangeStart: '',
      setRangeStart: mockSetRangeStart,
      rangeEnd: '',
      setRangeEnd: mockSetRangeEnd,
      foundNumbers: null,
      isSearching: false,
      handleFind: mockHandleFind,
      error: null,
      saveSearchState: jest.fn(),
    });
  });

  it('should render correctly', () => {
    render(<FindNumber />);

    expect(screen.getByText('Encontrar Números Perfeitos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: 1000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar números/i })).toBeInTheDocument();
  });

  it('should handle range inputs changes', () => {
    render(<FindNumber />);

    const startInput = screen.getByPlaceholderText('Ex: 1');
    const endInput = screen.getByPlaceholderText('Ex: 1000');

    fireEvent.change(startInput, { target: { value: '10' } });
    expect(mockSetRangeStart).toHaveBeenCalledWith('10');

    fireEvent.change(endInput, { target: { value: '100' } });
    expect(mockSetRangeEnd).toHaveBeenCalledWith('100');
  });

  it('should call handleFind when button is clicked', () => {
    render(<FindNumber />);

    const button = screen.getByRole('button', { name: /buscar números/i });
    fireEvent.click(button);

    expect(mockHandleFind).toHaveBeenCalled();
  });

  it('should display error message', () => {
    const errorMessage = 'Intervalo inválido';
    (useFindPerfectNumbers as jest.Mock).mockReturnValue({
      rangeStart: '',
      setRangeStart: mockSetRangeStart,
      rangeEnd: '',
      setRangeEnd: mockSetRangeEnd,
      foundNumbers: null,
      isSearching: false,
      handleFind: mockHandleFind,
      error: errorMessage,
      saveSearchState: jest.fn(),
    });

    render(<FindNumber />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    const startInput = screen.getByPlaceholderText('Ex: 1');
    expect(startInput).toHaveClass('border-red-500');
  });

  it('should display loading state', () => {
    (useFindPerfectNumbers as jest.Mock).mockReturnValue({
      rangeStart: '',
      setRangeStart: mockSetRangeStart,
      rangeEnd: '',
      setRangeEnd: mockSetRangeEnd,
      foundNumbers: null,
      isSearching: true,
      handleFind: mockHandleFind,
      error: null,
      saveSearchState: jest.fn(),
    });

    render(<FindNumber />);

    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed');
  });
});
