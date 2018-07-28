/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  WebView,
  Dimensions,
  ToastAndroid,
  TouchableHighlight,
  BackHandler
} from 'react-native';
import WebViewAndroid from 'react-native-webview-android';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//获取设备的宽度和高度
var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state={
      animated: true,
      hidden: false,
      barStyle: 'dark-content',
      barBackgroundColor: '#FFFFFF',
      translucent: false,
    }
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }
  onBackAndroid = () => {
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      return false;
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
    return true;
  }
  handleLoadStart=()=>{
    this.refs.webView.postMessage(JSON.stringify({
      reactNative: true,
      android: true
    }));
  }
  handleMessage = (evt) => {
    let obj_message={};
    console.log('handleMessage', evt)
    try{
      obj_message = JSON.parse(evt.nativeEvent.data)
    }catch(err){
      alert('JSON格式错误');
    }
    obj_message=Object.assign(this.state, obj_message);
    this.setState(obj_message);
  }
  javascriptToInject = () => {
    return `window.android=true`
  }
  onNavigationStateChange = (event) => {
    console.log(event);

    this.setState({
      backButtonEnabled: event.canGoBack,
      forwardButtonEnabled: event.canGoForward,
      url: event.url,
      status: event.title,
      loading: event.loading
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={this.state.hidden}
          backgroundColor={this.state.barBackgroundColor}
          barStyle={this.state.barStyle}
          animated={this.state.animated}
          translucent={this.state.translucent}
        />
        <WebViewAndroid
          ref='webView' 
          javaScriptEnabled={true}
          geolocationEnabled={false}
          builtInZoomControls={false}
          url='http://m.lefangsj.com/wap/'
          style={{width:deviceWidth, height: '100%'}}
          injectedJavaScript={this.javascriptToInject()}
        />
        {/* <WebView
          ref='webView' 
          onLoadStart={this.handleLoadStart}
          bounces={true}
          scalesPageToFit={true}
          source={{uri:'http://192.168.0.2:8080/wap/', method: 'GET'}}
          style={{width:deviceWidth, height: '100%'}}
          onMessage={this.handleMessage.bind(this)}
          injectedJavaScript={this.javascriptToInject()}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
