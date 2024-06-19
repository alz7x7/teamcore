// src/AppNavigator.tsx
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuestionsScreen from '../screens/questions';
import FinishedScreen from '../screens/finished';
import {RootStackParamList} from './';
import Logo from '../assets/images/logo.png';
import {Image, StyleSheet, View} from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Blank');

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const appState = await AsyncStorage.getItem('appState');
        if (appState === 'Finished') {
          setInitialRoute('Finished');
        } else {
          setInitialRoute('Questions');
        }
      } catch (error) {
        console.error('Error reading appState from AsyncStorage:', error);
      }
    };
    checkAppState();
  }, []);

  if (initialRoute === 'Blank') {
    return (
      <View style={styles.container}>
        <Image
          source={Logo}
          style={{width: 120, height: 40}}
          resizeMode="contain"
        />
      </View>
    );
  }

  const questionsScreenOptions: StackNavigationOptions = {
    headerTitle: () => (
      <Image
        source={Logo}
        style={{width: 120, height: 40}}
        resizeMode="contain"
      />
    ),
    headerTitleAlign: 'center',
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Questions"
          component={QuestionsScreen}
          options={questionsScreenOptions}
        />
        <Stack.Screen
          name="Finished"
          component={FinishedScreen}
          options={questionsScreenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
});

export default AppNavigator;
