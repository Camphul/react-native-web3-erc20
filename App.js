/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Fragment, Component} from 'react';
import {web3, getERC20Balance, sendERC20Transaction} from './wallet'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';


class CryptoApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
       balance: 0
    };
  } 

componentDidMount() {
    var self = this;
    getERC20Balance(web3).then((value) => {
      self.setState({
        balance: value
      }).catch((msg) => {
        alert(msg)
      })
    })
}
  render() {
    return (
      <View>
        <Text>Balance: {this.state.balance}</Text>
        <TouchableOpacity onPress={() => {
          sendERC20Transaction('0x11dB4495b9d866B051eCf15f35F11e68364Dae18', 10).then((val) => {
            alert('ok')
            alert(val)
          }).catch(err => {
            alert('oopsie')
            alert(err)
          })
        }} style={styles.button}>
          <Text style={styles.buttonText}>Send 10 ERC20-tokens</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const App = () => {
  return (
   <CryptoApp></CryptoApp>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: 'green',
  },
  buttonText:{
    color: 'white',
    textAlign: 'center'
  }
});

export default App;
