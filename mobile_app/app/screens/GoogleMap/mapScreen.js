import React, { Component } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { f, database } from "../../../config/config.js";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import SearchTo from "../../components/GetToLocation/searchView.js";
import SearchFrom from "../../components/GetFromLocation/searchView.js";
import HeaderBar from "../../components/HeaderBar/headerBar.js";

import styles from "./styles";

export default class MapScreen extends Component {
  state = {
    region: null,
    from: null,
    to: null,
    routeNo: null,
    userName: null,
    shared: true
  };

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }
        });
        this.shareLocation; // reload the current location and set it in the firebase when location is changing
      }, // success
      () => {}, //error
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 10000
      }
    );

    var that = this;
    f.auth().onAuthStateChanged(auth => {
      that.setState({
        userName: auth.uid
      });
    });
  }

  getFromLocation = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;
    this.setState({
      from: {
        latitude,
        longitude,
        title1: data.structured_formatting.main_text
      }
    });
  };

  getToLocation = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;
    this.setState({
      to: {
        latitude,
        longitude,
        title2: data.structured_formatting.main_text
      }
    });
  };

  shareLocation = () => {
    const { region, from, to, routeNo, userName } = this.state;
    const sharableObject = {
      to: from,
      from: to,
      routeNo: routeNo,
      finished: false,
      current: region
    };

    var that = this;
    database
      .ref("/BusDetails")
      .child(userName)
      .set(sharableObject)
      .then(that.setState({ shared: false }))
      .catch(err => console.log("Can't share the location in Bus"));
  };

  render() {
    const { region, from, to } = this.state;
    return (
      <View>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={region}
            showsUserLocation
            loadingEnabled
          >
          {from && (
            <Marker coordinate={from} />
          )}
          {to && (
            <Marker coordinate={to} />
          )}
          </MapView>
        </View>
        <HeaderBar title={"Share Your Location"} />

        <View style={styles.textContainer}>
          <TextInput
            placeholder="Bus Route Number"
            placeholderTextColor="#000"
            style={{
              height: 45,
              width: "100%",
              borderRadius: 50,
              backgroundColor: "#e8e8e8",
              marginBottom: 15,
              color: "#FFF",
              paddingLeft: 10,
              marginTop: 50
            }}
            onChangeText={text => this.setState({ routeNo: text })}
          />
          {this.state.shared == true ? (
            <TouchableOpacity
              style={styles.shareLocationButton}
              onPress={this.shareLocation}
            >
              <Text style={styles.touchableText}>Share Location</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelLocationButton}>
              <Text style={styles.touchableText}>Cancel Sharing</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.shared && (
          <SearchFrom onLocationSelected={this.getFromLocation} />
        )}

        {this.state.shared && (
          <SearchTo onLocationSelected={this.getToLocation} />
        )}
      </View>
    );
  }
}
