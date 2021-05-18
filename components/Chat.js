import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
const firebase = require('firebase');
require('firebase/firestore');

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
//access the user’s name
let userName = this.props.route.params.userName;


    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hey ${userName}!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: `${userName} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],

    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

          //change bubble color

  renderBubble(props) {
    return (
      <Bubble

        {...props}
        wrapperStyle={{
         
          right: {
            backgroundColor: 'black'
          }
        }}
      />
    )
  }

  render() {
    //access the user’s name
    let userName = this.props.route.params.userName;
  //access the background colour selected
let backgroundColor = this.props.route.params.backgroundColor;
    
    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
