import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  GiftedChat,
  Bubble
} from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
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

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //reference to Firestore collection
    this.referenceShoppingLists = firebase
      .firestore()
      .collection("TalkTime/messages");
  }

  //fetch and display existing messages
  componentDidMount() {
    this.referenceTalkTime = firebase.firestore().collection("TalkTime");
    if (
      this.referenceTalkTime !== null ||
      this.referenceTalkTime !== undefined
    ) {
      this.unsubscribe = this.referenceTalkTime.onSnapshot(
        this.onCollectionUpdate
      );
    } else {
      alert("You have no messages");
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
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
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });

  //   //add messages to db
  // addMessage() {
  //   const message = this.state.messages[0];
  //   this.referenceChatMessages.add({
  //     _id: message._id,
  //     text: message.text,
  //     createdAt: message.createdAt,
  //     user: message.user,
  //     image: message.image || null,
  //     location: message.location || null,
  //   });
  // }

  this.setState({
    messages: [{
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

  };

   // Adds messages to cloud storage
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

   //Event handler for sending messages
   onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessage();
      }
    );
  }
  

  //change bubble color

  renderBubble(props) {
    return ( <
      Bubble {
        ...props
      }
      wrapperStyle = {
        {
          right: {
            backgroundColor: "black",
          },
        }
      }
      />
    );
  }

  render() {
    //access the user’s name
    let userName = this.props.route.params.userName;
    //access the background colour selected
    let backgroundColor = this.props.route.params.backgroundColor;

    return ( <
      View style = {
        {
          flex: 1,
          backgroundColor: backgroundColor
        }
      } >
      <
      GiftedChat renderBubble = {
        this.renderBubble.bind(this)
      }
      messages = {
        this.state.messages
      }
      onSend = {
        (messages) => this.onSend(messages)
      }
      user = {
        {
          _id: 1,
        }
      }
      /> {
        Platform.OS === "android" ? ( <
          KeyboardAvoidingView behavior = "height" / >
        ) : null
      } </View>
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