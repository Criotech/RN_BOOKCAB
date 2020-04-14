import update from "react-addons-update";
import constants from "./actionConstants";
import { Dimensions } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import RNGooglePlaces from "react-native-google-places";

import request from "../../../util/request"

import calculateFare from "../../../util/fareCalculator"

//CONSTANTS
const { GET_CURRENT_LOCATION,
    GET_INPUT,
    TOGGLE_SEARCH_RESULT,
    GET_ADDRESS_PREDICTIONS,
    GET_SELETED_ADDRESS,
    GET_DISTANCE_MATRIX,
    GET_FARE,
} = constants;

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA

//ACTIONS
export function getCurrentLocation() {
    console.log('hello')
    return (dispatch) => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                dispatch({
                    type: GET_CURRENT_LOCATION,
                    payload: position
                })
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }
}

//GET USER INPUT
export function getInputData(payload) {
    return {
        type: GET_INPUT,
        payload
    }
}
//toogle search result modal
export function toggleSearchResultModal(payload) {
    return {
        type: TOGGLE_SEARCH_RESULT,
        payload
    }
}
//get address sugestions from google places
export function getAddressPredictions() {
    return (dispatch, store) => {
        let userInput = store().home.resultTypes.pickUp ? store().home.inputData.pickUp : store().home.inputData.dropOff;
        RNGooglePlaces.getAutocompletePredictions(userInput,
            {
                country: "NG"
            })
            .then((results) => {
                dispatch({
                    type: GET_ADDRESS_PREDICTIONS,
                    payload: results
                })
            })
            .catch((error) => console.log(error.message)); 
    }
}

//GET SELECTED ADDRESS
export function getSelectedAddress(payload) {
    const dummyNumbers ={
		baseFare:2000,
		timeRate:0.14,
		distanceRate:0.97,
		surge:1
	}
    return (dispatch, store) => {
        RNGooglePlaces.lookUpPlaceByID(payload)
            .then((results) => {
                dispatch({
                    type: GET_SELETED_ADDRESS,
                    payload: results
                })
            })
            .then(() => {
                //Get the distance and time
			if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.seletedDropOff){
				request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
				.query({
					origins:store().home.selectedAddress.selectedPickUp.location.latitude + "," + store().home.selectedAddress.selectedPickUp.location.longitude,
					destinations:store().home.selectedAddress.seletedDropOff.location.latitude + "," + store().home.selectedAddress.seletedDropOff.location.longitude,
					mode:"driving",
					key:"PLACE YOUR API KEY HERE"
				})
				.finish((error, res)=>{
					dispatch({
						type:GET_DISTANCE_MATRIX,
						payload:res.body
					});
				})
                }
                setTimeout(function(){
                    if(store().home.selectedAddress.selectedPickUp && store().home.selectedAddress.seletedDropOff){
                        const fare = calculateFare(
                            dummyNumbers.baseFare,
                            dummyNumbers.timeRate,
                            store().home.distanceMatrix.rows[0].elements[0].duration.value,
                            dummyNumbers.distanceRate,
                            store().home.distanceMatrix.rows[0].elements[0].distance.value,
                            dummyNumbers.surge,
                        );
                        dispatch({
                            type:GET_FARE,
                            payload:fare
                        })
                    }
    
    
                },2000)
            })
            .catch((error) => console.log("Error", error))
    }
}

//ACTIONS END//
function handleGetCurrentLocation(state, action) {
    return update(state, {
        region: {
            latitude: {
                $set: action.payload.coords.latitude
            },
            longitude: {
                $set: action.payload.coords.longitude
            },
            latitudeDelta: {
                $set: LATITUDE_DELTA
            },
            longitudeDelta: {
                $set: LONGITUDE_DELTA
            }
        }
    })
}

function handleGetInputData(state, action) {
    const { key, value } = action.payload;
    return update(state, {
        inputData: {
            [key]: {
                $set: value
            }
        }
    })
}

function handleToggleSearchResult(state, action) {
    if (action.payload == "pickUp") {
        return update(state, {
            resultTypes: {
                pickUp: {
                    $set: true
                },
                dropOff: {
                    $set: false
                }
            },
            predictions: {
                $set: []
            }
        })
    }
    if (action.payload == "dropOff") {
        return update(state, {
            resultTypes: {
                pickUp: {
                    $set: false
                },
                dropOff: {
                    $set: true
                }
            },
            predictions: {
                $set: []
            }
        })
    }
}

function handleGetAddressPredictions(state, action) {
    return update(state, {
        predictions: {
            $set: action.payload
        }
    })
}

function handleGetSelectedAddress(state, action) {
    let selectedTitle = state.resultTypes.pickUp ? "selectedPickUp" : "seletedDropOff"
    return update(state, {
        selectedAddress: {
            [selectedTitle]: {
                $set: action.payload
            }
        },
        resultTypes: {
            pickUp: {
                $set: false
            },
            dropOff: {
                $set: false
            }
        }
    })
}

function handleGetDistanceMatrix(state, action) {
    return update(state, {
        distanceMatrix: {
            $set: action.payload
        }
    })
}

function handleGetFare(state, action){
	return update(state, {
		fare:{
			$set:action.payload
		}
	})
}


//ACTION HANDLERS


const Action_Handlers = {
    GET_CURRENT_LOCATION: handleGetCurrentLocation,
    GET_INPUT: handleGetInputData,
    TOGGLE_SEARCH_RESULT: handleToggleSearchResult,
    GET_ADDRESS_PREDICTIONS: handleGetAddressPredictions,
    GET_SELETED_ADDRESS: handleGetSelectedAddress,
    GET_DISTANCE_MATRIX: handleGetDistanceMatrix,
    GET_FARE: handleGetFare,
}


const initialState = {
    region: {},
    inputData: {},
    resultTypes: {},
    selectedAddress: {},
    predictions: []
};

export function HomeReducer(state = initialState, action) {
    const handler = Action_Handlers[action.type];

    return handler ? handler(state, action) : state;
}