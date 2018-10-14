import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

import User from './User';

const { width } = Dimensions.get('window');

export default class Home extends Component {
  state = {
    scrollOffset: new Animated.Value(0),
    userSelected: null,
    listProgress: new Animated.Value(0),
    userInfoProgress: new Animated.Value(0),
    userInfoVisible: false,
    users: [
      {
        id: 1,
        name: "Diego Fernandes",
        description: "Head de programação!",
        avatar: "https://avatars0.githubusercontent.com/u/2254731?s=460&v=4",
        thumbnail:
          "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80",
        likes: 200,
        color: "#57BCBC"
      },
      {
        id: 2,
        name: "Robson Marques",
        description: "Head de empreendedorismo!",
        avatar: "https://avatars2.githubusercontent.com/u/861751?s=460&v=4",
        thumbnail:
          "https://images.unsplash.com/photo-1490633874781-1c63cc424610?auto=format&fit=crop&w=400&q=80",
        likes: 350,
        color: "#E75A63"
      },
      {
        id: 3,
        name: "Cleiton Souza",
        description: "Head de mindset!",
        avatar: "https://avatars0.githubusercontent.com/u/4669899?s=460&v=4",
        thumbnail:
          "https://images.unsplash.com/photo-1506440905961-0ab11f2ed5bc?auto=format&fit=crop&w=400&q=80",
        likes: 250,
        color: "#2E93E5"
      },
      {
        id: 4,
        name: "Robson Marques",
        description: "Head de empreendedorismo!",
        avatar: "https://avatars2.githubusercontent.com/u/861751?s=460&v=4",
        thumbnail:
          "https://images.unsplash.com/photo-1490633874781-1c63cc424610?auto=format&fit=crop&w=400&q=80",
        likes: 350,
        color: "#E75A63"
      }
    ]
  }

  selectUser = user => {
    this._scrollView.getNode().scrollTo({
      y: 0,
      animated: true,
    })
    
    this.setState({ userSelected: user });
    
    const { listProgress, userInfoProgress } = this.state

    Animated.sequence([
      Animated.timing(listProgress, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(userInfoProgress, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => this.setState({ userInfoVisible: true }))
    
  }

  renderDetail = () => (
    <View>
      <User user={this.state.userSelected} onPress={() => { }} />
    </View>
  );

  renderList = () => (
    <Animated.View 
    style={[
      styles.container, 
      { 
        marginVertical: 20,
      },
      {
        transform: [
          {
            translateX: this.state.listProgress.interpolate({
              inputRange: [0, 100],
              outputRange: [0, width],
            })
          }
        ]
      }
     ]}>
      <Animated.ScrollView 
        ref={ref => this._scrollView = ref}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { 
                  y: this.state.scrollOffset 
                }
              },
            }
          ]
        )}>
        {this.state.users.map(user => (
          <User
            key={user.id}
            user={user}
            onPress={() => this.selectUser(user)}
          />
        ))}
      </Animated.ScrollView>
    </Animated.View>
  );

  render() {
    const { userSelected, userInfoVisible } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Animated.View style={[
            styles.header,
            {
              height: this.state.scrollOffset.interpolate({
                inputRange: [0, 200],
                outputRange: [200, 85],
                extrapolate: 'clamp'
              }),
              backgroundColor: this.state.scrollOffset.interpolate({
                inputRange: [100, 200],
                outputRange: ['rgba(141, 112, 255, 1)', 'rgba(0, 0, 0, 1)'],
                extrapolate: 'clamp'
              })
            }
          ]}>
          <Animated.Image
            style={[
              styles.headerImage,
              {
                opacity: this.state.userInfoProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 1],
                })
              }
            ]}
            source={userSelected ? { uri: userSelected.thumbnail } : null}
          />

          <Animated.Text style={[
            styles.headerText,
            {
              fontSize: userSelected ? 24 : this.state.scrollOffset.interpolate({
                inputRange: [120, 200],
                outputRange: [24, 16],
                extrapolate: 'clamp'
              }),
              transform: [
                {
                  translateX: this.state.userInfoProgress.interpolate({ 
                    inputRange: [0, 100],
                    outputRange: [0, width],
                  })
                }
              ]
            }
          ]}>
            GoNative
          </Animated.Text>

          <Animated.Text style={[
            styles.headerText,
            {
              transform: [
                {
                  translateX: this.state.userInfoProgress.interpolate({
                    inputRange: [0, 100],
                    outputRange: [width * -1, 0],
                  })
                }
              ]
            }
          ]}>
            { userSelected ? userSelected.name : null }
          </Animated.Text>
        </Animated.View>
        {this.state.userInfoVisible ? this.renderDetail() : this.renderList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingHorizontal: 15,
    // backgroundColor: 'rgba(52, 52, 52, 0.8)'
    // height: 200
  },

  headerImage: {
    ...StyleSheet.absoluteFillObject
  },

  headerText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
    backgroundColor: "transparent",
    position: "absolute",
    left: 15,
    bottom: 20
  }
});