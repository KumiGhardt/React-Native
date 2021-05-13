import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: " ",
      backgroundColor: " ",
    };
  }

  render() {
    return (
      <ImageBackground
        source={require("./img/BackgroundImage.png")}
        style={styles.container}
      >
        <Text style={styles.headerTitle}>Lets Chat</Text>

        <View style={styles.view}>
          <TextInput
            style={styles.textInput}
            onChangeText={(userName) => this.setState({ userName })}
            value={this.state.userName}
            placeholder="Username..."
          />
          <Text>Choose a background colour</Text>
          <View style={styles.chatBackgroundColour}>
            <TouchableOpacity
              style={styles.chatBackgroundColour1}
              onPress={(color) => this.setState({ backgroundColor: "#090C08" })}
            />
            <TouchableOpacity
              style={styles.chatBackgroundColour2}
              onPress={(color) => this.setState({ backgroundColor: "#474056" })}
            />
            <TouchableOpacity
              style={styles.chatBackgroundColour3}
              onPress={(color) => this.setState({ backgroundColor: "#8A95A5" })}
            />
            <TouchableOpacity
              style={styles.chatBackgroundColour4}
              onPress={(color) => this.setState({ backgroundColor: "#474056" })}
            />
          </View>

          {/* navigate to chat screen */}
          <View style={styles.chatButton}>
            <Button
              color="#757083"
              title="Start Chat"
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  userName: this.state.userName,
                  backgroundColor: this.state.backgroundColor,
                })
              }
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 20,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },

  view: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderRadius: 3,
    width: "88%",
    height: "44%",
    opacity: 0.88,
    paddingTop: 20,
    marginBottom: 30,
    borderRadius: 10,
  },

  textInput: {
    height: 40,
    width: 150,
    marginBottom: 30,
    borderColor: "gray",
    borderWidth: 2,
    fontSize: 16,
    fontWeight: "300",
    opacity: 50,
    color: "#757083",
    borderRadius: 10,
  },

  chatBackgroundColour: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },

  chatBackgroundColour1: {
    backgroundColor: "#090C08",
    width: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10
  },

  chatBackgroundColour2: {
    backgroundColor: "#474056",
    width: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10
  },

  chatBackgroundColour3: {
    backgroundColor: "#8A95A5",
    width: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10
  },

  chatBackgroundColour4: {
    backgroundColor: "#B9C6AE",
    width: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10
  },

  chatButton: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    //marginTop: 10,
    width: "60%",
    borderRadius: 10,
  },
});
