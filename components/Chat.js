import React, { Component } from "react";
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
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";
import ImageModal from "react-native-image-modal";

const firebase = require("firebase");
require("firebase/firestore");

//config to allow the app to connect to Firestore.
var firebaseConfig = {
  apiKey: "AIzaSyDHR4e2Z2iPkulanThPQIn5hwI8Dtn80cY",
  authDomain: "chatapp-88bc8.firebaseapp.com",
  projectId: "chatapp-88bc8",
  storageBucket: "chatapp-88bc8.appspot.com",
  messagingSenderId: "1020519519236",
  appId: "1:1020519519236:web:f0b85abfaacc956ea01151",
  measurementId: "G-614GWNY3Y8",
};

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      _id: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
      image: null,
      location: null,
    };

    //connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  //fetch and display existing messages
  componentDidMount() {
    //access the user’s name
    const userName = this.props.route.params.userName;
    this.props.navigation.setOptions({
      title: `${userName}'s Chatroom`,
    });
    //reference the collection in firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    //get messages
    this.getMessages();

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
              user: {
                _id: "",
                name: "",
                avatar: null,
              },
              isConnected: true,
            });
            // listen for collection changes for current user
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("offline");
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
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
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  //when something changes in the messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
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
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.messages);
    } finally {
      console.log("saved in clientside");
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

  //makes the toolbar disappear when one is offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  //creates the circle button
  renderCustomActions = (props) => <CustomActions {...props} />;

  //creates a map should the cst have a location on
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

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
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          renderCustomView={this.renderCustomView}
          renderMessageImage={this.renderMessageImage}
          renderActions={this.renderCustomActions}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {/* Android keyboard fix */}
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
