import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarProps {
  /** Selected date */
  selectedDate?: Date;
  /** Callback when a date is selected */
  onSelectDate?: (date: Date) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Optional className for custom styling */
  className?: string;
  /** Show quick date range selector */
  showQuickSelector?: boolean;
  /** Disabled dates */
  disabledDates?: Date[];
  /** Force a specific layout orientation. Defaults to 'responsive' */
  orientation?: 'responsive' | 'horizontal' | 'vertical';
}

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const QUICK_RANGES = [
  { label: 'Today', getValue: () => new Date() },
  { label: 'Yesterday', getValue: () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }},
  { label: 'This week', getValue: () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }},
  { label: 'Last week', getValue: () => {
    const date = new Date();
    const day = date.getDate() - date.getDay() - 6;
    return new Date(date.setDate(day));
  }},
  { label: 'This month', getValue: () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }},
  { label: 'Last month', getValue: () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }},
];

export function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  className = '',
  showQuickSelector = false,
  disabledDates = [],
  orientation = 'responsive',
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateDisabled(date)) return;

    onSelectDate?.(date);
  };

  const handleQuickRangeClick = (range: typeof QUICK_RANGES[0]) => {
    const date = range.getValue();
    setCurrentMonth(new Date(date));
    onSelectDate?.(date);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(
      d => d.toDateString() === date.toDateString()
    );
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toDateString() === selectedDate.toDateString();
  };

  const renderDays = () => {
    const days = [];

    // Empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-full transition-all mx-auto"
          style={{
            backgroundColor: selected ? 'var(--foreground)' : 'transparent',
            color: selected
              ? 'var(--background)'
              : disabled
              ? 'var(--muted-foreground)'
              : 'var(--foreground)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? '0.4' : '1',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            transitionDuration: 'var(--motion-duration-fast)',
            transitionTimingFunction: 'var(--motion-easing-standard)',
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const CalendarHeader = () => (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handlePreviousMonth}
        className="p-[var(--spacing-1)] hover:bg-[var(--muted)] rounded-md transition-colors flex items-center justify-center"
        style={{
          color: 'var(--foreground)',
          transitionDuration: 'var(--motion-duration-fast)',
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <div
        style={{
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
          textAlign: 'center',
          minWidth: '160px'
        }}
      >
        {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </div>

      <button
        onClick={handleNextMonth}
        className="p-[var(--spacing-1)] hover:bg-[var(--muted)] rounded-md transition-colors flex items-center justify-center"
        style={{
          color: 'var(--foreground)',
          transitionDuration: 'var(--motion-duration-fast)',
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const CalendarGrid = () => (
    <div className="flex flex-col gap-[var(--spacing-4)] w-full">
      <div
        className="grid gap-[var(--spacing-1)] w-full"
        style={{
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {DAYS_OF_WEEK.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-center h-[32px] w-full"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--muted-foreground)',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        className="grid gap-[var(--spacing-1)] w-full"
        style={{
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {renderDays()}
      </div>
    </div>
  );

  const QuickSelector = ({ isMobile }: { isMobile: boolean }) => (
    <div
      className={isMobile 
        ? "flex flex-wrap gap-[var(--spacing-2)] pt-[var(--spacing-6)] border-t border-[var(--border)] w-full"
        : "flex flex-col gap-[var(--spacing-2)] w-[160px] border-r border-[var(--border)] pr-[var(--spacing-6)] flex-shrink-0"
      }
    >
      {QUICK_RANGES.map((range, index) => (
        <button
          key={index}
          onClick={() => handleQuickRangeClick(range)}
          className={`flex items-center ${
            isMobile 
              ? 'justify-center px-[var(--spacing-3)] py-[var(--spacing-1)] bg-[var(--surface-800)] border border-[var(--border)] rounded-[var(--radius-lg)] hover:bg-[var(--muted)]' 
              : 'text-left px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-sm)] hover:bg-[var(--muted)]'
            } transition-colors`}
          style={{
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
            color: 'var(--foreground)',
            transitionDuration: 'var(--motion-duration-fast)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          {range.label}
        </button>
      ))}
    </div>
  );

  // Desktop Layout Component
  const DesktopLayout = () => (
    <div
      className={`flex flex-row items-stretch p-[var(--spacing-6)] bg-[var(--surface-900)] rounded-[var(--radius-lg)] w-full ${className}`}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {showQuickSelector && <QuickSelector isMobile={false} />}
      <div className={`flex flex-col gap-[var(--spacing-6)] flex-1 ${showQuickSelector ? 'pl-[var(--spacing-6)]' : ''}`}>
        <CalendarHeader />
        <CalendarGrid />
      </div>
    </div>
  );

  // Mobile Layout Component
  const MobileLayout = () => (
    <div
      className={`flex flex-col gap-[var(--spacing-6)] p-[var(--spacing-6)] bg-[var(--surface-900)] rounded-[var(--radius-lg)] w-full ${className}`}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex flex-col gap-[var(--spacing-6)] w-full">
        <CalendarHeader />
        <CalendarGrid />
      </div>
      {showQuickSelector && <QuickSelector isMobile={true} />}
    </div>
  );

  if (orientation === 'horizontal') return <DesktopLayout />;
  if (orientation === 'vertical') return <MobileLayout />;

  return (
    <>
      <div className="hidden md:block w-full">
        <DesktopLayout />
      </div>
      <div className="block md:hidden w-full">
        <MobileLayout />
      </div>
    </>
  );
}
