import { isOverdue } from '../overdueUtils';

const PAST_DATE = '2020-01-01';
const FUTURE_DATE = '2099-12-31';
const todayStr = new Date().toISOString().split('T')[0];

describe('isOverdue', () => {
  describe('completed todos are never overdue', () => {
    it('returns false for completed todo with past due date', () => {
      expect(isOverdue({ completed: 1, dueDate: PAST_DATE })).toBe(false);
    });
  });

  describe('todos without a due date are never overdue', () => {
    it('returns false when dueDate is null', () => {
      expect(isOverdue({ completed: 0, dueDate: null })).toBe(false);
    });

    it('returns false when dueDate is undefined', () => {
      expect(isOverdue({ completed: 0, dueDate: undefined })).toBe(false);
    });

    it('returns false when dueDate is an empty string', () => {
      expect(isOverdue({ completed: 0, dueDate: '' })).toBe(false);
    });

    it('returns false when dueDate is an invalid date string', () => {
      expect(isOverdue({ completed: 0, dueDate: 'not-a-date' })).toBe(false);
    });
  });

  describe('incomplete todos with a due date', () => {
    it('returns true when due date is in the past', () => {
      expect(isOverdue({ completed: 0, dueDate: PAST_DATE })).toBe(true);
    });

    it('returns false when due date is today', () => {
      expect(isOverdue({ completed: 0, dueDate: todayStr })).toBe(false);
    });

    it('returns false when due date is in the future', () => {
      expect(isOverdue({ completed: 0, dueDate: FUTURE_DATE })).toBe(false);
    });
  });
});
