import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "" };
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
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder="Your name..."
          />
          <Text>Choose background Colour</Text>
          <View style={styles.chatBackgroundColour}>
            <TouchableOpacity style={styles.chatBackgroundColour1} onPress={(color) => this.setState({ color })}/>
            <TouchableOpacity style={styles.chatBackgroundColour2} onPress={(color) => this.setState({ color })}/>
            <TouchableOpacity style={styles.chatBackgroundColour3} onPress={(color) => this.setState({ color })}/>
            <TouchableOpacity style={styles.chatBackgroundColour5} onPress={(color) => this.setState({ color })}/>
          </View>
        <View style={styles.chatButton}>
          <Button color="#fff"
            title="Start Chat"
            onPress={() =>
              this.props.navigation.navigate("Chat", { name: this.state.name, backgroundColor: this.state.color })
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
    width: '88%',
    height: '44%',
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
    height: 50,
    borderRadius: 50 / 2,
  },

  chatBackgroundColour2: {
    backgroundColor: "#474056",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "space-around",
  },

  chatBackgroundColour3: {
    backgroundColor: "#8A95A5",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },

  chatBackgroundColour5: {
    backgroundColor: "#B9C6AE",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },

  chatButton: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: '#757083',
    width: '60%',
    padding: 10,
    borderRadius: 10,
  },
});
