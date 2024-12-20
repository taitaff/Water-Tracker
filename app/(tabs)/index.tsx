import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Добро пожаловать в трекер воды!</Text>
      <Text style={styles.motivationalMessage}>Не забывайте пить воду для хорошего самочувствия!</Text>
      <Text style={styles.bodyText}>Здесь вы сможете отслеживать, сколько воды выпили за день.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA', // Голубой фон
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'SpaceMono', // Шрифт (не забудьте добавить его в проект)
    textAlign: 'center', // Заголовок по центру
  },
  motivationalMessage: {
    fontSize: 18,
    fontStyle: 'italic', // Курсив
    color: '#0077B6', // Темно-голубой цвет
    textAlign: 'center', // Мотивационное сообщение по центру
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
});
