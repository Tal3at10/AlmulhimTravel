import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmptyState from '../components/ui/EmptyState';

describe('EmptyState Component', () => {
  it('renders default title and message when no props are provided', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('لا توجد بيانات')).toBeInTheDocument();
    expect(screen.getByText('لم يتم العثور على أي نتائج')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<EmptyState title="لا توجد فنادق" message="يرجى تجربة مدينة أخرى" />);
    
    expect(screen.getByText('لا توجد فنادق')).toBeInTheDocument();
    expect(screen.getByText('يرجى تجربة مدينة أخرى')).toBeInTheDocument();
  });

  it('renders action element if provided', () => {
    render(
      <EmptyState 
        action={<button data-testid="retry-btn">إعادة المحاولة</button>} 
      />
    );
    
    expect(screen.getByTestId('retry-btn')).toBeInTheDocument();
    expect(screen.getByText('إعادة المحاولة')).toBeInTheDocument();
  });
});
