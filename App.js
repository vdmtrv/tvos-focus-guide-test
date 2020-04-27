/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TVFocusGuideView,
  Dimensions
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

class Focus {
  constructor() {
    this.rows = {};
  }

  registerRow(id) {
    const order = Object.keys(this.rows).length;
    this.rows[id] = {
      id,
      columns: {},
      order
    };
  }

  registerColumn(columnId, rowId, componentRef) {
    if (this.rows[rowId]) {
      const order = Object.keys(this.rows[rowId].columns).length;
      this.rows[rowId].columns[columnId] = {
        id: columnId,
        componentRef,
        order
      };
    }
  }

  unregisterRow(id) {
    if (this.rows[id]) {
      delete this.rows[id];
    }
  }

  unregisterColumn(columnId, rowId) {
    if (this.rows[rowId]) {
      delete this.rows[rowId].columns[columnId];
    }
  }

  get activeRows() {
    return this.rows;
  }

  fetchSiblings(rowId, columnId) {
    const currentRow = this.rows[rowId];
    const currentRowIndex = currentRow.order;
    const currentColIndex = currentRow.columns[columnId].order;

    const rows = Object.values(this.rows);
    const nextRow = rows.find(item => item.order === currentRowIndex + 1);
    const prevRow = rows.find(item => item.order === currentRowIndex - 1);

    const currentRowCols = Object.values(this.rows[rowId].columns);
    const prevCard = currentRowCols.find(item => item.order === currentColIndex - 1);
    const nextCard = currentRowCols.find(item => item.order === currentColIndex + 1);

    let top;
    let bottom;
    let left;
    let right;

    if (prevRow) {
      const col = Object.values(prevRow.columns).find(column => column.order === currentRowIndex || column.order === 0);
      if (col) top = col.componentRef;
    }

    if (nextRow) {
      const col = Object.values(nextRow.columns).find(column => column.order === currentRowIndex || column.order === 0);
      if (col) bottom = col.componentRef;
    }

    if (prevCard) {
      left = prevCard.componentRef;
    }

    if (nextCard) {
      right = nextCard.componentRef;
    }

    console.log('>>>> siblings', [
      top?._nativeTag || null,
      bottom?._nativeTag || null,
      left?._nativeTag || null,
      right?._nativeTag || null
    ]);
    return [
      top,
      bottom,
      left,
      right
    ].filter(item => item !== undefined);
  }
}

const FocusManager = new Focus();

class Row extends React.Component {
  constructor(props) {
    super(props);

    this.rowId = uuidv4();
    FocusManager.registerRow(this.rowId);
  }

  componentWillUnmount() {
    FocusManager.unregisterRow(this.rowId);
  }

  render() {
    const { data, onFocusCard, style } = this.props;

    return (
        <FlatList
            contentContainerStyle={[styles.flatlist, style]}
            data={data}
            contentInsetAdjustmentBehavior="never"
            horizontal
            keyExtractor={keyExtractor}
            onScrollToIndexFailed={() => {
            }}
            renderItem={data => <Card data={data} rowId={this.rowId} onFocusCard={onFocusCard}/>}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
    )
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.columnId = uuidv4();
    this.ref = null;
    this.state = {
      focused: false
    }
  }

  componentDidMount() {
    FocusManager.registerColumn(this.columnId, this.props.rowId, this.ref);
  }

  componentWillUnmount() {
    const { rowId } = this.props;
    FocusManager.unregisterColumn(this.columnId, rowId);
  }

  onFocus = (e) => {
    // const { onFocusCard, rowId } = this.props;

    console.log('>>>> active', FocusManager.activeRows);
    // console.log('>>> current', {rowId, columnId: this.columnId});

    this.setState({ focused: true });
    // if (onFocusCard) onFocusCard(FocusManager.fetchSiblings(rowId, this.columnId));
  };

  onBlur = () => this.setState({ focused: false });

  render() {
    const { rowId, data: { item } } = this.props;
    if (this.state.focused) {
      console.log(FocusManager.fetchSiblings(rowId, this.columnId));
    }

    return (
        <View>
          {this.state.focused && <TVFocusGuideView style={{backgroundColor: 'magenta'}} destinations={[FocusManager.fetchSiblings(rowId, this.columnId).top]} />}
          <View style={{flexDirection: 'row'}}>
            {this.state.focused && <TVFocusGuideView style={{backgroundColor: 'magenta'}} destinations={[FocusManager.fetchSiblings(rowId, this.columnId).left]} />}
            <TouchableOpacity
                ref={ref => this.ref = ref}
                onPress={item.onPress}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                style={[
                  styles.card,
                  {backgroundColor: item.background}
                ]}
            >
              <Text style={styles.cardText}>
                {item.title + '-' + (this.ref?._nativeTag || null)}
              </Text>
            </TouchableOpacity>
            {this.state.focused && <TVFocusGuideView style={{backgroundColor: 'magenta'}} destinations={[FocusManager.fetchSiblings(rowId, this.columnId).right]} />}
          </View>
          {this.state.focused && <TVFocusGuideView style={{backgroundColor: 'magenta'}} destinations={[FocusManager.fetchSiblings(rowId, this.columnId).bottom]} />}
        </View>
    )
  }
}

const keyExtractor = (item, index: number) => `${index}-${item.title}`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      destinations: []
    }
  }

  onFocusCard = (shouldUpdate: boolean = true) => destinations => this.setState({ destinations: shouldUpdate ? destinations : [] });

  render() {
    const { destinations } = this.state;
    return (
      <SafeAreaView>
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
          <View style={styles.featured} hasTVPreferredFocus>
            <Row data={[items[1]]} onFocusCard={this.onFocusCard(false)} style={styles.smallFlatList}/>
          </View>

          <Row data={[items[0]]} onFocusCard={this.onFocusCard()} />
          <Row data={items} onFocusCard={this.onFocusCard()} />
          <Row data={[...items, ...items, ...items]} onFocusCard={this.onFocusCard()} />
          <View>
            <Text style={styles.cardText}>
              {'Destination tags = ' + destinations.map(d => (d?._nativeTag || null)).join(',')}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  smallFlatList: {
    marginLeft: Dimensions.get('screen').width / 2
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  card: {
    width: 300,
    height: 200,
    marginHorizontal: 10
  },
  cardText: {
    fontSize: 40
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
  },
  focusView: {
    backgroundColor: '#dddddd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default App;
