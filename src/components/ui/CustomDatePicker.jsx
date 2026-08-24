import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const WEEKDAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = 'اختر التاريخ',
  minDate = '',
  className = '',
  theme = 'dark' // 'dark' (for home hero) or 'light' (for packages page)
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial date or fallback to today
  const initialDate = value ? new Date(value) : new Date();
  const [currentYear, setCurrentYear] = useState(isNaN(initialDate) ? new Date().getFullYear() : initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(isNaN(initialDate) ? new Date().getMonth() : initialDate.getMonth());
  
  const containerRef = useRef(null);

  // Sync state if external value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d)) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    // Format as YYYY-MM-DD local time
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(selected.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    onChange(dateStr);
    setIsOpen(false);
  };

  const isDateDisabled = (day) => {
    if (!minDate) return false;
    const targetDate = new Date(currentYear, currentMonth, day);
    const limitDate = new Date(minDate);
    // Reset hours to compare dates only
    targetDate.setHours(0, 0, 0, 0);
    limitDate.setHours(0, 0, 0, 0);
    return targetDate < limitDate;
  };

  const isSelected = (day) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth &&
      selected.getFullYear() === currentYear
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const formatSelectedDate = () => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date)) return '';
    const d = date.getDate();
    const m = MONTHS_AR[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  };

  // Generate days array
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  
  const days = [];
  // Add empty slots for offset
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Theme styling helpers
  const containerClasses = theme === 'dark' 
    ? 'bg-white/10 text-white border-white/5 hover:bg-white/15' 
    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100/80';

  const popoverClasses = theme === 'dark'
    ? 'bg-[#071428] border-white/10 text-white shadow-[#000000]/50'
    : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50';

  const headerTextClass = theme === 'dark' ? 'text-white' : 'text-slate-800';
  const weekdayTextClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-400';
  const arrowBtnHover = theme === 'dark' ? 'hover:bg-white/5 text-[#C9A227]' : 'hover:bg-slate-100 text-[#071428]';

  return (
    <div className={`relative w-full popover-container ${className}`} ref={containerRef} dir="rtl">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-start gap-2 rounded-xl px-3 py-2.5 border transition-all text-xs font-bold text-right ${containerClasses}`}
      >
        <CalendarIcon className="w-4 h-4 text-[#C9A227] shrink-0" />
        <span className={`flex-1 truncate ${!value ? (theme === 'dark' ? 'text-slate-400' : 'text-slate-400') : ''}`}>
          {value ? formatSelectedDate() : placeholder}
        </span>
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border p-4 shadow-2xl ${popoverClasses}`}
          >
            {/* Header: Month & Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handleNextMonth} // In RTL, "Next" month is the Right arrow (which advances month)
                className={`p-1.5 rounded-lg transition-colors ${arrowBtnHover}`}
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
              
              <span className={`text-xs font-black select-none ${headerTextClass}`}>
                {MONTHS_AR[currentMonth]} {currentYear}
              </span>
              
              <button
                type="button"
                onClick={handlePrevMonth} // In RTL, "Prev" month is the Left arrow (which regresses month)
                className={`p-1.5 rounded-lg transition-colors ${arrowBtnHover}`}
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Weekdays row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {WEEKDAYS_AR.map((day, idx) => (
                <span key={idx} className={`text-[10px] font-black py-1 select-none ${weekdayTextClass}`}>
                  {day}
                </span>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const disabled = isDateDisabled(day);
                const selected = isSelected(day);
                const today = isToday(day);

                let dayClass = 'aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all';
                
                if (disabled) {
                  dayClass += theme === 'dark' 
                    ? ' text-slate-700 cursor-not-allowed opacity-30' 
                    : ' text-slate-300 cursor-not-allowed opacity-30';
                } else if (selected) {
                  dayClass += ' bg-[#C9A227] text-[#071428] font-black shadow-lg shadow-[#C9A227]/20 cursor-pointer';
                } else {
                  dayClass += ' cursor-pointer ';
                  if (theme === 'dark') {
                    dayClass += today 
                      ? ' border border-[#C9A227] text-[#C9A227] hover:bg-white/10' 
                      : ' text-white hover:bg-white/5 hover:text-[#C9A227]';
                  } else {
                    dayClass += today 
                      ? ' border border-[#C9A227] text-[#071428] font-black bg-[#C9A227]/10 hover:bg-slate-100' 
                      : ' text-slate-700 hover:bg-slate-100 hover:text-[#071428]';
                  }
                }

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDay(day)}
                    className={dayClass}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDatePicker;
