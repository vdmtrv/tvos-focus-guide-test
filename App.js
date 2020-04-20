/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Text,
    TouchableOpacity
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';



const items = [
  {
    title: 'abc',
    background: 'red',
    onPress: () => console.log('I\'m red')
  },
  {
    title: 'def',
    background: 'green',
    onPress: () => console.log('I\'m green')
  },
  {
    title: 'ghi',
    background: 'blue',
    onPress: () => console.log('I\'m blue')
  }
];

const keyExtractor = (item, index: number) => `${index}-${item.title}`;


const Card = (props) => {
  const { data: { item } } = props;
  return (
      <TouchableOpacity
          onPress={item.onPress}
          style={[
            styles.card,
            { backgroundColor: item.background }
          ]}
      >
        <Text>{item.title}</Text>
      </TouchableOpacity>
  )
};

const App: () => React$Node = () => {
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>

        <View style={styles.featured}>
          <TouchableOpacity onPress={() => console.log('>>>> I\'m a CTA')} style={styles.button}>
            <Text>CTA</Text>
          </TouchableOpacity>
        </View>

        <FlatList
            contentContainerStyle={styles.flatlist}
            data={[items[0]]}
            contentInsetAdjustmentBehavior="never"
            horizontal
            innerRef={ref => (this.ref = ref)}
            keyExtractor={keyExtractor}
            onScrollToIndexFailed={() => {}}
            renderItem={data => <Card data={data} />}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />

        <FlatList
            contentContainerStyle={styles.flatlist}
            data={[...items]}
            contentInsetAdjustmentBehavior="never"
            horizontal
            innerRef={ref => (this.ref = ref)}
            keyExtractor={keyExtractor}
            onScrollToIndexFailed={() => {}}
            renderItem={data => <Card data={data} />}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />

        <FlatList
            contentContainerStyle={[{ backgroundColor: 'white' }]}
            data={[...items, ...items, ...items]}
            contentInsetAdjustmentBehavior="never"
            horizontal
            innerRef={ref => (this.ref = ref)}
            keyExtractor={keyExtractor}
            onScrollToIndexFailed={() => {}}
            renderItem={data => <Card data={data} />}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  card: {
    width: 300,
    height: 200,
    marginHorizontal: 10
  },
  flatlist: {
    backgroundColor: 'white',
    marginBottom: 20
  },
  featured: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    width: 100,
    height: 50,
    backgroundColor: 'magenta',
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default App;
