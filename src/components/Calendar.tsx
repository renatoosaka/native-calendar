/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  LayoutChangeEvent,
} from 'react-native';

import leftImg from '../assets/left.png';
import rightImg from '../assets/right.png';

const {width} = Dimensions.get('window');

const CONTAINER_WIDTH = width / 7;

const defaultWeekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const defaultMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface CalendarProsp {
  disableDays?: {
    weekDays?: Array<number>;
    days?: Array<Date>;
  };
  weekNames?: Array<string>;
  monthNames?: Array<string>;
  onSelectDate?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProsp> = ({
  disableDays = {weekDays: [], days: []},
  weekNames = defaultWeekNames,
  monthNames = defaultMonthNames,
  onSelectDate,
}) => {
  const [containerWidth, setContainerWidth] = useState(CONTAINER_WIDTH);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  const startWeekDayOfMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 1).getDay();
  }, [selectedMonth, selectedYear]);

  const weeksInMonth = useCallback((array: Array<number> = [], size = 7): Array<
    Array<number>
  > => {
    if (!array.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);

    return [head, ...weeksInMonth(tail, size)];
  }, []);

  const monthDays = useMemo(
    () =>
      weeksInMonth(
        Array.from({length: daysInMonth + startWeekDayOfMonth}, (_, index) =>
          index < startWeekDayOfMonth ? 0 : index + 1 - startWeekDayOfMonth,
        ),
      ),
    [daysInMonth, startWeekDayOfMonth, weeksInMonth],
  );

  const selectedMonthText = useMemo(() => monthNames[selectedMonth], [
    monthNames,
    selectedMonth,
  ]);

  const nextMonth = useCallback(() => {
    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }

    setSelectedDay(1);
  }, [selectedMonth, selectedYear]);

  const previousMonth = useCallback(() => {
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }

    setSelectedDay(1);
  }, [selectedMonth, selectedYear]);

  const handleOnLayout = useCallback((event: LayoutChangeEvent) => {
    const {width: layoutWidth} = event.nativeEvent.layout;
    setContainerWidth((layoutWidth - 16) / 7);
  }, []);

  const isDisabledDay = useCallback(
    (weekDay: number, day: number) => {
      let disabled = false;

      if (disableDays) {
        if (disableDays.weekDays) {
          disabled = disabled || disableDays.weekDays.includes(weekDay);
        }

        if (disableDays.days) {
          disabled =
            disabled ||
            !!disableDays.days.find(
              (date) =>
                date.getDate() === day &&
                date.getMonth() === selectedMonth &&
                date.getFullYear() === selectedYear,
            );
        }
      }

      return disabled;
    },
    [disableDays, selectedMonth, selectedYear],
  );

  const handleSelectDay = useCallback(
    (weekDay: number, day: number) => {
      if (isDisabledDay(weekDay, day)) {
        return;
      }

      setSelectedDay(day);

      if (onSelectDate) {
        onSelectDate(new Date(selectedYear, selectedMonth, day));
      }
    },
    [isDisabledDay, onSelectDate, selectedMonth, selectedYear],
  );

  return (
    <View style={styles.calendar} onLayout={handleOnLayout}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={previousMonth}>
          <Image source={leftImg} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {selectedMonthText} {selectedYear}
        </Text>

        <TouchableOpacity style={styles.headerButton} onPress={nextMonth}>
          <Image source={rightImg} />
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal: 8, marginBottom: 8}}>
        <View style={styles.row}>
          {Array.from({length: 7}, (_, index) => index).map((week) => (
            <View
              key={week}
              style={[styles.container, {width: containerWidth, height: 32}]}>
              <Text style={styles.weekTitle}>{weekNames[week]}</Text>
            </View>
          ))}
        </View>

        {monthDays.map((week, index) => (
          <View key={index} style={styles.row}>
            {week.map((day, indexDay) => (
              <View
                key={`${day}-${indexDay}-${index}`}
                style={styles.container}>
                <TouchableOpacity
                  style={[
                    styles.dayContainer,
                    {
                      backgroundColor:
                        day === 0 || isDisabledDay(indexDay, day)
                          ? undefined
                          : '#f3f3f3',
                      width: containerWidth - 8,
                      height: containerWidth - 8,
                    },
                    day === selectedDay ? styles.daySelected : [],
                  ]}
                  onPress={() => handleSelectDay(indexDay, day)}>
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: isDisabledDay(indexDay, day)
                          ? '#cecece'
                          : '#3f3f3f',
                      },
                    ]}>
                    {!!day && day}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#7159c1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    height: 40,
  },
  headerButton: {
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  weekTitle: {
    color: '#7e7e7e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayContainer: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#3f3f3f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  daySelected: {
    backgroundColor: 'gold',
  },
});
export default Calendar;
