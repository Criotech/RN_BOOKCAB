import React from "react";

import { Header, Left, Right, Button, Body } from "native-base";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./HeaderComponentStyles";

export const HeaderComponent = () =>{
    return (
        <Header style={{backgroundColor:"#000000"}} androidStatusBarColor="light-content">
            <Left>
                <Button transparent>
                    <Icon name="bars" style={{color: "#fff", fontSize: 20}} />
                </Button>
            </Left>

            <Body style={{alignItems: "space-around"}}>
                <Text style={styles.headerText}>ZoomIn</Text>
            </Body>

            <Right>
                <Button transparent>
                    <Icon name="gift" style={{color: "#fff", fontSize: 20}} />
                </Button>
            </Right>
        </Header>
    )
}

export default HeaderComponent;