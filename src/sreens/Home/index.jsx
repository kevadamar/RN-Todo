import axios from 'axios';
import { Center, Heading, Spinner, VStack } from 'native-base';
import React from 'react';
import { Keyboard } from 'react-native';

import InputTodo from '../../components/InputTodo';
import TodoContent from '../../components/TodoContent';

const HomeScreen = ({ navigation }) => {
  const [todos, setTodos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://192.168.1.6:5000/api/v1/todos');

      setTodos(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const postTodo = async () => {
    try {
      const response = await axios.post('http://192.168.1.6:5000/api/v1/todo', {
        title: inputValue,
      });

      setInputValue('');
      Keyboard.dismiss();
      fetchTodos();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const updateTodo = async ({ action, id, payload = {} }) => {
    try {
      const response = await axios.patch(
        `http://192.168.1.6:5000/api/v1/todo/${id}/${action}`,
        payload,
      );

      fetchTodos();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Center flex={1} paddingTop={10}>
      <VStack space={4} flex={1} w="90%" mt={4}>
        <Heading color="blue.400">Todo App</Heading>
        <InputTodo setValue={setInputValue} value={inputValue} cb={postTodo} />
        <VStack flex={1}>
          {isLoading ? (
            <Spinner color="blue.400" />
          ) : (
            <TodoContent
              cb={updateTodo}
              fetchTodos={fetchTodos}
              todos={todos}
              isLoading={isLoading}
            />
          )}
        </VStack>
      </VStack>
    </Center>
  );
};

export default HomeScreen;
