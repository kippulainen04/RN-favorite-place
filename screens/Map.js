import { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps"

const Map = () => {
    const [selectedLocation, setSeletecedLocation] = useState()
    const region = {
        latitude: 37.78,
        longitude: -122,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    };
    function selectLocationHanlder(event) {
        console.log(event)
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;

        setSeletecedLocation({
            lat: lat,
            lng: lng
        })
    }

  return (
    <MapView 
    style={styles.map}
    initialRegion={region}
    onPress={selectLocationHanlder}    
    >
        {selectedLocation && (
            <Marker
            title='Picked Location'
            coordinate={{latitude: selectedLocation.lat, longitude: selectedLocation.lng}}
            />
        )}
    </MapView>
  )
}

export default Map

const styles = StyleSheet.create({
    map: {
        flex: 1
    }
})