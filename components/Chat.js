import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  render() {
    //access the user’s name
    let { name } = this.props.route.params.name;

    //access the selected color
    let { color } = this.props.route.params.color;

      //add an object as a second parameter to navigate and add the data you want to use in the screen you’re transitioning to
    this.props.navigation.setOptions({ title: name });

    return (
      
      <View style={styles.container}>
        <Text>Hi, {name}</Text>
    
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: this.props.route.params.color,
  },

})