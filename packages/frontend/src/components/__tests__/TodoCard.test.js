import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('should cancel edit and restore original values', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    fireEvent.click(screen.getByLabelText(/Edit/));
    fireEvent.change(screen.getByDisplayValue('Test Todo'), { target: { value: 'Changed' } });
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should show validation error when submitting with empty title', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    fireEvent.click(screen.getByLabelText(/Edit/));
    fireEvent.change(screen.getByDisplayValue('Test Todo'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Title cannot be empty')).toBeInTheDocument();
  });

  it('should call onEdit and exit edit mode on valid submit', async () => {
    mockHandlers.onEdit.mockResolvedValue();
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    fireEvent.click(screen.getByLabelText(/Edit/));
    fireEvent.change(screen.getByDisplayValue('Test Todo'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByText('Save'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTodo.id, 'Updated Title', '2025-12-25');
  });
});

describe('TodoCard overdue state (US1, US2, US3)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const PAST_DATE = '2020-01-01';
  const FUTURE_DATE = '2099-12-31';
  const todayStr = new Date().toISOString().split('T')[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // US1: incomplete + past due date → .overdue class
  it('applies overdue class to incomplete todo with past due date', () => {
    const todo = { id: 1, title: 'Overdue Todo', dueDate: PAST_DATE, completed: 0, createdAt: '2020-01-01T00:00:00Z' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
  });

  // US1: incomplete + today → no .overdue class
  it('does not apply overdue class to incomplete todo with today as due date', () => {
    const todo = { id: 2, title: 'Due Today', dueDate: todayStr, completed: 0, createdAt: '2020-01-01T00:00:00Z' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  // US1: incomplete + future date → no .overdue class
  it('does not apply overdue class to incomplete todo with future due date', () => {
    const todo = { id: 3, title: 'Future Todo', dueDate: FUTURE_DATE, completed: 0, createdAt: '2020-01-01T00:00:00Z' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  // US1: incomplete + no due date → no .overdue class
  it('does not apply overdue class to incomplete todo with no due date', () => {
    const todo = { id: 4, title: 'No Date Todo', dueDate: null, completed: 0, createdAt: '2020-01-01T00:00:00Z' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  // US2: completed + past date → no .overdue class
  it('does not apply overdue class to completed todo even with past due date', () => {
    const todo = { id: 5, title: 'Done Overdue', dueDate: PAST_DATE, completed: 1, createdAt: '2020-01-01T00:00:00Z' };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  // US3: re-render with due date changed from past to future → .overdue removed
  it('removes overdue class when todo prop updates due date from past to future', () => {
    const overdueTodo = { id: 6, title: 'Edit Test', dueDate: PAST_DATE, completed: 0, createdAt: '2020-01-01T00:00:00Z' };
    const { container, rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');

    const updatedTodo = { ...overdueTodo, dueDate: FUTURE_DATE };
    rerender(<TodoCard todo={updatedTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  // US3: re-render with completed toggled to 1 on overdue todo → .overdue removed
  it('removes overdue class when overdue todo is marked complete', () => {
    const overdueTodo = { id: 7, title: 'Toggle Test', dueDate: PAST_DATE, completed: 0, createdAt: '2020-01-01T00:00:00Z' };
    const { container, rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');

    const completedTodo = { ...overdueTodo, completed: 1 };
    rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  // US3: re-render with due date changed from future to past → .overdue added
  it('adds overdue class when todo prop updates due date from future to past', () => {
    const futureTodo = { id: 8, title: 'Future To Overdue', dueDate: FUTURE_DATE, completed: 0, createdAt: '2020-01-01T00:00:00Z' };
    const { container, rerender } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');

    const overdueTodo = { ...futureTodo, dueDate: PAST_DATE };
    rerender(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
  });
});
