import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import HeaderBar from "../../components/HeaderBar/headerBar.js";
import styles from "./style.js";
import { Card, Button, Rating } from "react-native-elements";
import { f, database } from "../../../config/config.js";

let deviceHeight = Dimensions.get("window").height;

export default class ProfileScreen extends Component {
  state = {
    name: null,
    picUrl: null,
    bd: null,
    userID: null,
    loading: false
  };
  componentDidMount() {
    var user = f.auth().currentUser;
    this.setState({
      name: user.displayName,
      picUrl: user.photoURL,
      bd: user.email,
      loading: true,
      userID: user.uid
    });
  }

  setUserProfile() {
    var user = f.auth().currentUser;

    this.setState({});
  }
  render() {
    const { name, picUrl, bd, userID } = this.state;

    if (this.state.loading === false) {
      return (
        <View style={styles.container}>
          <HeaderBar title={"Profile"} />
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <HeaderBar title={"Profile"} />
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.container}>
              <View style={styles.coverImageArea}>
                <Image
                  style={styles.coverImage}
                  source={require("../../images/cover_photo.jpeg")}
                />
              </View>

              <Image
                style={styles.profileImage}
                source={{uri: picUrl}}
              />
              <Card
                containerStyle={{
                  width: "90%",
                  height: deviceHeight * 0.58
                }}
              >
                <View style={styles.contentArea}>
                  <Text style={styles.nameFont}>{name}</Text>
                  <Text style={styles.cityFont}>{bd}</Text>
                </View>

                <View style={styles.ratingStyles}>
                  <Rating
                    imageSize={this.props.size}
                    readonly
                    startingValue={this.props.rating}
                  />
                </View>

                <View>
                  <Text>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </Text>
                </View>
                <Button
                  title="Sign Out"
                  containerStyle={{
                    paddingTop: deviceHeight * 0.1
                  }}
                />
              </Card>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}
