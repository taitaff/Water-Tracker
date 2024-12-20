import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns'; // Для форматирования даты

export default function ExploreScreen() {
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [weeklyWater, setWeeklyWater] = useState<number>(0); // Для хранения суммы за неделю
  const dailyGoal = 2000; // Норма в миллилитрах (2 литра)

  // Функция для получения текущей даты
  function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Возвращаем дату в формате 'YYYY-MM-DD'
  }

  // Функция для добавления воды
  const addWater = async () => {
    const inputWater = parseInt(input);
    if (isNaN(inputWater) || inputWater <= 0) {
      setMessage('Пожалуйста, введите положительное число!');
      return;
    }

    // Сохраняем в AsyncStorage с учетом выбранной даты
    const currentWater = await AsyncStorage.getItem(selectedDate);
    const newTotal = currentWater ? parseInt(currentWater) + inputWater : inputWater;

    await AsyncStorage.setItem(selectedDate, newTotal.toString());
    setWaterConsumed(newTotal);

    // Определяем сообщение
    if (newTotal >= dailyGoal) {
      setMessage('Поздравляем, вы выпили достаточно воды на сегодня!');
    } else if (newTotal > dailyGoal * 0.8) {
      setMessage('Вы почти достигли своей цели! Почти там!');
    } else if (newTotal > dailyGoal * 1.2) {
      setMessage('Осторожно! Вы выпили слишком много воды!');
    } else {
      setMessage('');
    }
    setInput('');
    updateWeeklyWater(); // Обновляем сумму воды за неделю после добавления
  };

  // Функция для выбора другой даты
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    getWaterConsumedForDate(date);
  };

  // Функция для получения количества воды для выбранной даты
  const getWaterConsumedForDate = async (date: string) => {
    const water = await AsyncStorage.getItem(date);
    setWaterConsumed(water ? parseInt(water) : 0);
  };

  // Функция для подсчета воды за последнюю неделю
  const updateWeeklyWater = async () => {
    const weekDates = getLastWeekDates(selectedDate);
    let totalWater = 0;
    
    // Для каждой даты недели получаем сохраненную воду и суммируем
    for (let date of weekDates) {
      const water = await AsyncStorage.getItem(date);
      totalWater += water ? parseInt(water) : 0;
    }

    setWeeklyWater(totalWater); // Обновляем количество воды за неделю
  };

  // Функция для получения дат последней недели
  const getLastWeekDates = (date: string) => {
    const dates: string[] = [];
    const currentDate = new Date(date);

    for (let i = 6; i >= 0; i--) {
      currentDate.setDate(currentDate.getDate() - i);
      dates.push(format(currentDate, 'yyyy-MM-dd'));
    }

    return dates;
  };

  useEffect(() => {
    getWaterConsumedForDate(selectedDate);
    updateWeeklyWater(); // При изменении даты обновляем отчет за неделю
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Добавьте количество выпитой воды</Text>

      {/* Календарь */}
      <Calendar
        current={selectedDate}
        onDayPress={(day: { dateString: string; }) => handleDateChange(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#00BFFF',
            selectedTextColor: 'white',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#00BFFF',
          todayTextColor: '#00BFFF',
        }}
      />

      {/* Отступ между календарем и полем ввода */}
      <View style={styles.spacer} />

      {/* Поле ввода для воды */}
      <TextInput
        style={styles.input}
        placeholder="Введите количество воды (мл)"
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
      />

      {/* Отступ между полем ввода и кнопкой */}
      <View style={styles.spacer} />

      {/* Кнопка для добавления воды */}
      <Button title="Добавить воду" onPress={addWater} />

      {/* Сообщение о статусе */}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {/* Отображаем текущий прогресс */}
      <Text style={styles.progress}>
        Выпито {waterConsumed} мл из {dailyGoal} мл.
      </Text>

      {/* Строка с количеством воды, выпитой за неделю */}
      <Text style={styles.weeklyReport}>
        Выпито за неделю: {weeklyWater} мл
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0F7FA', // Голубой фон
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'SpaceMono', // Шрифт (не забудьте добавить его в проект)
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  spacer: {
    height: 20, // Отступ между элементами
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  progress: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  weeklyReport: {
    marginTop: 20,
    fontSize: 16,
    color: '#00796B', // Цвет для отчета за неделю
  },
});
