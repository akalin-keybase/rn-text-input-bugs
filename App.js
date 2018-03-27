import React from 'react';
import { StyleSheet, Platform, Button, TextInput, View } from 'react-native';

const isIOS = Platform.OS === 'ios'
const isAndroid = !isIOS

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const text = 'initial text'
    // It's not documented anywhere, but it appears that the initial
    // selection is always set to the end of the initial text.
    const start = text.length
    const end = text.length
    this.state = { text, androidWaitingForNextSelectionChange: isAndroid, selection: {start, end} }
    console.log('initial state', this.state)
  }

  _onChangeText = (text) => {
    console.log('text changed to ', text)
    this.setState({text})
  }

  _onSelectionChange = (event) => {
    if (this.state.androidWaitingForNextSelectionChange) {
      console.log('next selection change encountered; overriding selection from', event.nativeEvent.selection, 'to', this.state.selection)
      const selection = this.state.selection
      this.setState({selection, androidWaitingForNextSelectionChange: false})
    } else {
      const selection = event.nativeEvent.selection
      console.log('selection changed to ', selection)
      this.setState({selection})
    }
  }

  _onButtonPress = () => {
    let {text, selection} = this.state
    if (selection.end < selection.start) {
      // This only happens on android. Repro: in the simulator, select
      // with shift-left.
      console.log('Fixing up selection so that start <= end')
      selection = {
        start: selection.end,
        end: selection.start,
      }
    }
    const insertedText = "foo"
    text = text.substring(0, selection.start) + insertedText + text.substring(selection.end)
    // The selection behavior after a text change differs between
    // platforms; on iOS, it moves to the end without triggering an
    // onSelectionChange event. On Android, it triggers an
    // onSelectionChange event with some indeterminate position
    // (e.g. the selection shifted by some number of places the
    // right). So we set the selection explicitly, and on Android we
    // also wait for the next selection change.
    let androidWaitingForNextSelectionChange = isAndroid
    const newEnd = selection.start + insertedText.length
    const newState = {text, androidWaitingForNextSelectionChange, selection: {start: newEnd, end: newEnd}}
    console.log('merging new state', newState)
    this.setState(newState)
  }

  render() {
    let selection = this.state.selection
    if (isAndroid && this.state.androidWaitingForNextSelectionChange) {
      // Work around a bug on android where when a TextInput's value
      // and selection are both changed, the selection is applied
      // first, which leads to a crash if it's out of bounds of the
      // *old* value.
      selection = undefined
    }
    return (
      <View style={styles.container}>
        <TextInput style={{height:40, width: 150, borderColor: 'black', borderWidth: 1}} onChangeText={this._onChangeText} onSelectionChange={this._onSelectionChange} selection={selection} value={this.state.text} />
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
