import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: 'test' }
  }

  _onChangeText = (text) => {
    this.setState({text})
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={{height:40, width: 150, borderColor: 'black', borderWidth: 1}} onChangeText={this._onChangeText} value={this.state.text} />
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
