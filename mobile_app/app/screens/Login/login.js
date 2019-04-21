import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from "react-native";
import { SocialIcon } from "react-native-elements";
import styles from "./style.js";
import { WaveIndicator } from "react-native-indicators";
import { f, database, auth, storage } from "../../../config/config.js";
const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken } = FBSDK;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSpinner: true
    };
  }

  componentDidMount() {
    this.fireBaseListener = f.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.firebaseRef = f.database().ref("users");
        this.firebaseRef.child(auth.uid).on("value", snap => {
          const user = snap.val();
          if (user != null) {
            this.firebaseRef.child(auth.uid).off("value");

            this.props.navigation.navigate("App");
          }
        });
      } else {
        this.setState({ showSpinner: false });
      }
    });
  }

  onPressLogin() {
    this.setState({ showSpinner: true });
    LoginManager.logInWithReadPermissions([
      "public_profile",
      "user_birthday",
      "email",
      "user_photos"
    ]).then(result => this._handleCallBack(result), function(error) {
      alert("Login fail with error: " + error);
    });
  }

  _handleCallBack(result) {
    let _this = this;
    if (result.isCancelled) {
      alert("Login cancelled");
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        const token = data.accessToken;
        fetch(
          "https://graph.facebook.com/v2.8/me?fields=id,first_name,last_name,gender,birthday&access_token=" +
            token
        )
          .then(response => response.json())
          .then(json => {
            const imageSize = 120;
            const facebookID = json.id;
            const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`;
            this.authenticate(data.accessToken).then(function(result) {
              const { uid } = result;
              _this.createUser(uid, json, token, fbImage);
            });
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    }
  }

  authenticate = token => {
    const provider = f.auth.FacebookAuthProvider;
    const credential = provider.credential(token);
    let ret = f.auth().signInWithCredential(credential);
    return ret;
  };

  createUser = (uid, userData, token, dp) => {
    const defaults = {
      uid,
      token,
      dp,
      ageRange: [20, 30]
    };
    f.database()
      .ref("users")
      .child(uid)
      .update({ ...userData, ...defaults });
  };

  render() {
    return (
      <ImageBackground
        source={require("../../images/landing.jpg")}
        style={{ width: "100%", height: "100%", flex: 1 }}
      >
        <View style={styles.firstContainer}>
          <ScrollView style={styles.scrollStyle}>
            <View style={styles.container2}>
              <Text>Logo Goes Here</Text>
              <WaveIndicator color="black" style={styles.indicator} />
            </View>
            <View style={styles.container}>
              <TouchableOpacity onPress={this.onPressLogin.bind(this)}>
                <SocialIcon
                  style={{ width: 200 }}
                  title="Sign In With Facebook"
                  button
                  type="facebook"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.container3}>
              <Text>Login with Email and Password</Text>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}
