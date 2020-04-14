import React, { Component } from 'react';
import { Text } from 'react-native';
import { View, InputGroup, Input } from "native-base";

import Icon from "react-native-vector-icons/FontAwesome"

import styles from "./SearchBoxStyles"

export const SearchBox = ({ getInputData, toggleSearchResultModal, getAddressPredictions, selectedAddress }) => {
    const { selectedPickUp, seletedDropOff } = selectedAddress || {}
    function handleInput(key, val){
        getInputData({
            key,
            value: val
        })
        getAddressPredictions()
    }
    return (
        <View style={styles.searchBox}>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>PICK UP</Text>
                <InputGroup>
                    <Icon name="search" size={15} color="#FFSE3A" />
                    <Input 
                    onFocus={()=>toggleSearchResultModal("pickUp")} 
                    style={styles.inputSearch} 
                    placeholder="Chose pick-up location" 
                    onChangeText={handleInput.bind(this, "pickUp")} 
                    value={selectedPickUp && selectedPickUp.name} />
                </InputGroup>
            </View>
            <View style={styles.secondInputWrapper}>
                <Text style={styles.label}>DROP OFF</Text>
                <InputGroup>
                    <Icon name="search" size={15} color="#FFSE3A" />
                    <Input onFocus={()=>toggleSearchResultModal("dropOff")} 
                    style={styles.inputSearch} 
                    placeholder="Chose drop-off location" 
                    onChangeText={handleInput.bind(this, "dropOff")} 
                    value={seletedDropOff && seletedDropOff.name} />
                </InputGroup>
            </View>
            
        </View>
    )
}


export default SearchBox;