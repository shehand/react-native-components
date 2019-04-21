import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./styles.js";

export default class HeaderNavigationBar extends Component {
    render() {
        return (
        <View style={styles.navigationBar}>
            <View style={styles.titleArea}><Text style={styles.titleFont}>{this.props.title}</Text></View>
        </View>);
    }
}