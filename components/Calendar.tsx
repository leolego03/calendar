import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const startDate = new Date(firstDay);
    
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const totalDays = 42;

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected
      });
    }

    return days;
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color="#55BBEE" />
        </TouchableOpacity>
        
        <Text style={styles.monthYearText}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={24} color="#55BBEE" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayHeader}>
            <Text style={[
              styles.weekDayText,
              index === 0 && styles.sundayText,
              index === 6 && styles.saturdayText,
            ]}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !day.isCurrentMonth && styles.otherMonthDay,
            ]}
            onPress={() => handleDatePress(day.date)}
          >
            <Text style={[
              styles.dayText,
              !day.isCurrentMonth && styles.otherMonthText,
              day.isToday && !selectedDate && styles.todayText,
              day.isSelected && styles.selectedText
            ]}>
              {day.date.getDate()}
            </Text>
            {day.isToday && !selectedDate && <View style={styles.todayBorder} />}
            {day.isSelected && <View style={styles.selectedBorder} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  arrowButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B8C1CC',
  },
  sundayText: {
    color: '#DE7673',
  },
  saturdayText: {
    color: '#529DF8',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  otherMonthText: {
    color: '#999',
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  todayBorder: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3371C1',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
  selectedBorder: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3371C1',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
});
