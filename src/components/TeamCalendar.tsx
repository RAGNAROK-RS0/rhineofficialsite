import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder';
}

const sampleEvents: Record<string, CalendarEvent[]> = {
  '2026-04-15': [
    { id: '1', title: 'Team Standup', time: '10:00 AM', type: 'meeting' },
    { id: '2', title: 'Project Review', time: '2:00 PM', type: 'meeting' },
  ],
  '2026-04-18': [
    { id: '3', title: 'Sprint Planning', time: '11:00 AM', type: 'meeting' },
  ],
  '2026-04-20': [
    { id: '4', title: 'Milestone Due', time: '5:00 PM', type: 'deadline' },
  ],
  '2026-04-22': [
    { id: '5', title: 'Client Call', time: '3:00 PM', type: 'meeting' },
  ],
};

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDateKey = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-[#0082D8]/20 text-[#0082D8]';
      case 'deadline': return 'bg-red-500/20 text-red-400';
      case 'reminder': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  const selectedEvents = selectedDate ? sampleEvents[selectedDate] || [] : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-white font-medium">
            {monthNames[month]} {year}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-white/40 text-xs py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const dateKey = d.isCurrentMonth ? getDateKey(d.day) : null;
            const hasEvents = dateKey && sampleEvents[dateKey];
            const isSelected = dateKey === selectedDate;
            const isToday = d.isCurrentMonth && d.day === 12 && month === 3 && year === 2026;

            return (
              <button
                key={i}
                onClick={() => d.isCurrentMonth && setSelectedDate(dateKey)}
                disabled={!d.isCurrentMonth}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors
                  ${!d.isCurrentMonth ? 'text-white/20' : ''}
                  ${isSelected ? 'bg-[#0082D8] text-white' : 'text-white hover:bg-white/10'}
                  ${isToday && !isSelected ? 'ring-2 ring-[#0082D8] ring-offset-2 ring-offset-black' : ''}
                `}
              >
                <span>{d.day}</span>
                {hasEvents && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0082D8] mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-medium mb-4">
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select a date'}
        </h3>
        <div className="space-y-3">
          {selectedEvents.length > 0 ? (
            selectedEvents.map(event => (
              <div key={event.id} className={`p-3 rounded-lg ${getEventColor(event.type)}`}>
                <div className="font-medium">{event.title}</div>
                <div className="text-xs opacity-70">{event.time}</div>
              </div>
            ))
          ) : (
            <div className="text-white/40 text-center py-4">No events scheduled</div>
          )}
        </div>
      </div>
    </div>
  );
}