import React from 'react';
import { StyleSheet, Button, TextInput, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: 'test' }
  }

  _onChangeText = (text) => {
    console.log('text changed to ', text)
    this.setState({text})
  }

  _onSelectionChange = (event) => {
    let selection = event.nativeEvent.selection
    console.log('selection changed to ', selection)
    this.setState({selection})
  }

  _onButtonPress = () => {
    let {text, selection} = this.state
    selection = selection || {start: 0, end: 0}
    if (selection.end < selection.start) {
      // This only happens on android. Repro: in the simulator, select
      // with shift-left.
      console.log('Fixing up selection so that start <= end')
      selection = {
        start: selection.end,
        end: selection.start,
      }
    }
    text = text.substring(0, selection.start) + "foo" + text.substring(selection.end)
    this.setState({text})
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={{height:40, width: 150, borderColor: 'black', borderWidth: 1}} onChangeText={this._onChangeText} onSelectionChange={this._onSelectionChange} value={this.state.text} />
        <Button onPress={this._onButtonPress} title="Replace selection with foo" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
