// src/screens/FinishedScreen.tsx
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {primaryColor} from '../utils/constants';

const FinishedScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  useEffect(() => {
    getLastDate();
  }, []);
  const getLastDate = async () => {
    const dt = await AsyncStorage.getItem('lastDate');
    setCurrentDate(moment(dt, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Finalizado</Text>
        <Text style={styles.date}>Fecha último formulario: {currentDate}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Questions')}>
          <Text style={styles.buttonText}>Iniciar encuesta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinishedScreen;
