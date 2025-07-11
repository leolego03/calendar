import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [weekDate, setWeekDate] = useState<Date>(selectedDate ?? new Date());

  const goToPreviousMonth = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToPreviousWeek = () =>
    setWeekDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
  const goToNextWeek = () =>
    setWeekDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));

  const translateX = useSharedValue(0);
  const startX     = useSharedValue(0);

  const horizontalGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate(e => {
      translateX.value = startX.value + e.translationX;
    })
    .onEnd(e => {
      const TH = 50;
      if (e.translationX > TH) {
        runOnJS(isExpanded ? goToPreviousMonth : goToPreviousWeek)();
      } else if (e.translationX < -TH) {
        runOnJS(isExpanded ? goToNextMonth : goToNextWeek)();
      }
      translateX.value = withTiming(0);
    });

  const verticalGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .failOffsetX([-10, 10])
    .onEnd(e => {
      const TH = 50;
      if (e.translationY < -TH) runOnJS(setIsExpanded)(false);
      else if (e.translationY > TH) runOnJS(setIsExpanded)(true);
    });

  const panStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const generateCalendarDays = () => {
    const firstDay = firstOfMonth(currentDate);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    return Array.from({ length: 42 }).map((_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return {
        date: d,
        isCurrentMonth: d.getMonth() === currentDate.getMonth(),
        isToday:        d.toDateString() === new Date().toDateString(),
        isSelected:     selectedDate?.toDateString() === d.toDateString(),
      };
    });
  };
  const monthDays = generateCalendarDays();

  const displayedDays = isExpanded
    ? monthDays
    : (() => {
        const start = new Date(weekDate);
        start.setDate(start.getDate() - start.getDay());
        return Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return {
            date: d,
            isCurrentMonth: d.getMonth() === currentDate.getMonth(),
            isToday: d.toDateString() === new Date().toDateString(),
            isSelected: selectedDate?.toDateString() === d.toDateString(),
          };
        });
      })();
  const headerDate = isExpanded
    ? currentDate
    : (displayedDays[0]?.date ?? currentDate);

  const handleDatePress = (d: Date) => {
    setSelectedDate(d);
    setWeekDate(d);
    onDateSelect?.(d);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => isExpanded ? goToPreviousMonth() : goToPreviousWeek()}
          style={styles.arrowButton}
        >
          <Ionicons name="chevron-back" size={24} color="#55BBEE" />
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {monthNames[headerDate.getMonth()]} {headerDate.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={() => isExpanded ? goToNextMonth() : goToNextWeek()}
          style={styles.arrowButton}
        >
          <Ionicons name="chevron-forward" size={24} color="#55BBEE" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {weekDays.map((wd, i) => (
          <View key={i} style={styles.weekDayHeader}>
            <Text style={[
              styles.weekDayText,
              i === 0 && styles.sundayText,
              i === 6 && styles.saturdayText,
            ]}>
              {wd}
            </Text>
          </View>
        ))}
      </View>

      <GestureDetector gesture={horizontalGesture}>
        <Animated.View layout={LinearTransition} style={styles.calendarWrapper}>
          <Animated.View style={[styles.calendarGrid, panStyle]}>
            {displayedDays.map((day, idx) => (
              <Animated.View
                key={idx}
                layout={LinearTransition}
                style={styles.dayCellWrapper}
                entering={FadeInDown.duration(600)}
                exiting={FadeOutUp.duration(600)}
              >
                <Animated.View style={styles.dayCell}>
                  <TouchableOpacity
                    style={styles.dayContent}
                    onPress={() => handleDatePress(day.date)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        day.isToday && selectedDate === null && styles.todayText,
                        day.isSelected && styles.selectedText,
                      ]}
                    >
                      {day.date.getDate()}
                    </Text>
                    {day.isToday && selectedDate === null && (
                      <View style={styles.todayBorder} />
                    )}
                    {day.isSelected && (
                      <View style={styles.selectedBorder} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={verticalGesture}>
        <View style={styles.emptySpace} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  arrowButton: { padding: 8 },
  monthYearText: { fontSize: 20, fontWeight: '500', color: '#333' },
  weekHeader: { flexDirection: 'row', marginBottom: 10 },
  weekDayHeader: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  weekDayText: { fontSize: 14, fontWeight: '600', color: '#B8C1CC' },
  sundayText: { color: '#DE7673' },
  saturdayText: { color: '#529DF8' },
  calendarWrapper: { width: '100%', overflow: 'hidden' },
  calendarGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap' },
  dayCellWrapper: { width: '14.28%', aspectRatio: 1, overflow: 'hidden' },
  dayCell: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dayContent: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  dayText: { fontSize: 16, color: '#333' },
  todayText: { fontWeight: 'bold' },
  selectedText: { fontWeight: 'bold' },
  otherMonthDay: { opacity: 0.3 },
  todayBorder: { position: 'absolute', width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#3371C1', top: '50%', left: '50%', marginTop: -16, marginLeft: -16 },
  selectedBorder: { position: 'absolute', width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#3371C1', top: '50%', left: '50%', marginTop: -16, marginLeft: -16 },
  emptySpace: { flex: 1 }
});
