// src/screens/QuestionsScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation';
import {getQuestions, saveQuestions} from '../services/questions';
import moment from 'moment';
import ConfirmDialog from '../components/confirmDialog';
import {primaryColor} from '../utils/constants';

type QuestionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Questions'
>;

type Props = {
  navigation: QuestionsScreenNavigationProp;
};

const QuestionsScreen: React.FC<Props> = ({navigation}) => {
  interface Answer {
    answer_id: string;
    answer: string;
  }
  interface Question {
    question_id: string;
    question: string;
    answers: Answer[];
  }
  interface SelectedAnswer {
    question_id: string;
    answer_id: string;
  }
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
  const [allAnswered, setAllAnswered] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getListQuestions();
  }, []);
  useEffect(() => {
    setAllAnswered(
      selectedAnswers.length === questions.length && selectedAnswers.length > 0,
    );
  }, [questions, selectedAnswers]);

  const getListQuestions = async () => {
    const res = await getQuestions();
    setQuestions(res);
    setLoading(false);
  };
  const finishAnswers = async () => {
    setAllAnswered(false);
    let dt = moment().format('YYYY-MM-DD HH:mm:ss');
    await AsyncStorage.setItem('lastDate', dt);
    await AsyncStorage.setItem('appState', 'Finished');
    await saveQuestions({
      date: dt,
      data: selectedAnswers,
    });
    setShowDialog(true);
  };
  const handleSelectAnswer = (question_id: string, answer_id: string) => {
    const newSelectedAnswers = selectedAnswers.filter(
      item => item.question_id !== question_id,
    );
    newSelectedAnswers.push({question_id, answer_id});
    setSelectedAnswers(newSelectedAnswers);
  };
  const renderItem = ({item}: {item: Question}) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      {item.answers.map(answer => renderAnswer(item.question_id, answer))}
    </View>
  );
  const renderAnswer = (question_id: string, answer: Answer) => {
    const isSelected = selectedAnswers.some(
      item =>
        item.question_id === question_id && item.answer_id === answer.answer_id,
    );

    return (
      <TouchableOpacity
        key={answer.answer_id}
        style={styles.answerContainer}
        onPress={() => handleSelectAnswer(question_id, answer.answer_id)}>
        <View style={styles.radio}>
          {isSelected && <View style={styles.radioSelected} />}
        </View>
        <Text>{answer.answer}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenido</Text>
      <Text style={styles.subtitleText}>
        Por favor completa el formulario para continuar
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={primaryColor} />
      ) : (
        <FlatList
          data={questions}
          renderItem={renderItem}
          keyExtractor={item => item.question_id}
          contentContainerStyle={styles.listContent}
        />
      )}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          allAnswered ? styles.enabledButton : styles.disabledButton,
        ]}
        disabled={!allAnswered}
        onPress={finishAnswers}>
        <Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>
      <ConfirmDialog
        visible={showDialog}
        message="¿Deseas iniciar nuevamente la encuesta?"
        onConfirm={() => {
          setShowDialog(false);
          setAllAnswered(false);
          setSelectedAnswers([]);
          getListQuestions();
        }}
        onCancel={() => {
          setShowDialog(false);
          setAllAnswered(false);
          navigation.replace('Finished');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 60, // space for the floating button
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  questionContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: primaryColor,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{translateX: -50}],
    backgroundColor: '#A9A9A9',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  enabledButton: {
    backgroundColor: primaryColor,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 100, // space for the floating button
  },
});

export default QuestionsScreen;
