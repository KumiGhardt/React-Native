import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {


  render() {
    //access the user’s name
    let userName = this.props.route.params.userName;
    //access the background colour selected
    let backgroundColor = this.props.route.params.backgroundColor;
   

    return (
      
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Text>Hi {userName}</Text>
    
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
   
  },

})