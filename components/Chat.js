import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const firebase = require("firebase");
require("firebase/firestore");

//config to allow the app to connect to Firestore.
const firebaseConfig = {
  apiKey: "AIzaSyC5jKux9BuUbl5tuk39VV_VPv6HfPzV2hg",
  authDomain: "test-c44e1.firebaseapp.com",
  projectId: "test-c44e1",
  storageBucket: "test-c44e1.appspot.com",
  messagingSenderId: "834084879540",
  appId: "1:834084879540:web:e61466bb1a840e6cea2be1",
  measurementId: "G-LBRC9XB436",
};

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      _id: 1,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
    };

    //connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //reference the collection in firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  //fetch and display existing messages
  componentDidMount() {
    //access the user’s name
    const userName = this.props.route.params.userName;
    this.props.navigation.setOptions({
      title: `${userName}'s Chatroom`,
    });

    //find out the users connection status
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
        console.log("online");
        // Authenticate user in firebase
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            this.setState({
              messages: [],
              _id: 0,
              user: {
                _id: "",
                name: "",
                avatar: "",
              },
              isConnected: false,
            });
            // listen for collection changes for current user
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("offline");
        this.setState({
          isConnected: false,
        });
        this.saveMessages();
      }
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  //retrieve chat messages from asyncStorage instead of filling your message state with static data
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // Adds messages to cloud storage
  addMessage() {
    const message = this.state.messages[0];
    console.log(message);
    this.referenceChatMessages.add({
      _id: message._id,
      _id: this.state._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
    });
  }

  //when something changes in the messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || null,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
      console.log(data.text);
    });
    this.setState({
      messages,
    });
  };

  //To save messages, you’re using the setItem method that takes two parameters: a key and a value.
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.message)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  //Event handler for sending messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        //a callback function to setState so that once the state object is updated, you’ll save its current state into asyncStorage
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  //delete messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.messages);
    }
  }

  //change bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "green",
          },
          right: {
            backgroundColor: "black",
          },
        }}
      />
    );
  }

  // renderInputToolbar(props) {
  //   if (this.state.isConnected == false) {
  //   } else {
  //     return <InputToolbar {...props} />;
  //   }
  // }

  render() {
    //access the user’s name
    let userName = this.props.route.params.userName;
    //access the background colour selected
    let backgroundColor = this.props.route.params.backgroundColor;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        <GiftedChat
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar}
          renderBubble={this.renderBubble.bind(this)}
          renderUsernameOnMessage={true}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
          alwaysShowSend
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
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});
