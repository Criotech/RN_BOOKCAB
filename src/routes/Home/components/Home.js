import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapContainer from "./MapContainer";
import HeaderComponent from "../../../components/HeaderComponent";
import FooterComponent from "../../../components/FooterComponent";
import Fare from "./Fare";

import { Container } from "native-base";

class Home extends Component {
    componentDidMount() {
        this.props.getCurrentLocation();
    }

    render() {
        const region = {
            latitude: 3.146642,
            longitude: 101.695845,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        return (
            <Container>
                <HeaderComponent />
                {this.props.region.latitude &&
                    <MapContainer
                    region={this.props.region}
                    getInputData={this.props.getInputData}
                    toggleSearchResultModal={this.props.toggleSearchResultModal}
                    getAddressPredictions={this.props.getAddressPredictions}
                    resultTypes={this.props.resultTypes}
                    predictions={this.props.predictions}
                    getSelectedAddress= {this.props.getSelectedAddress}
                    selectedAddress={this.props.selectedAddress}
                />
                } 
                {this.props.fare && <Fare fare={this.props.fare} />}
                <FooterComponent /> 
            </Container>
        )
    }
}


export default Home;