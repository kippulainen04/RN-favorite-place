import { useNavigation } from "@react-navigation/native"
import { getCurrentPositionAsync, PermissionStatus, useForegroundPermissions } from "expo-location"
import { useState } from "react"
import { Alert, Image, StyleSheet, Text, View } from "react-native"
import { Colors } from "../../constants/colors"
import { getMapPreview } from "../../util/location"
import OutlineButton from "../UI/OutlineButton"

const LocationPicker = () => {
    const navigation = useNavigation();
    const [pickedLocation, setPickedLocation] = useState();
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

    async function verifyPermissions() {

        if(locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        if(locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
            'Insufficient Permissions!',
            'You need to grant location permissions to use this app.'
            );

            return false;
        }

        return true;
    }

    async function getLocationHandler() {
        const hasPermission = verifyPermissions();

        if(!hasPermission) {
            return;
        }

        const location = await getCurrentPositionAsync();
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude,

        })
    }
    function pickOnMapHandler() {
        navigation.navigate('Map');
    }

    let locationPreview = <Text>No location picked yet.</Text>
    if(pickedLocation) {
        locationPreview =  (
            <Image 
            source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}}
            style={styles.image}
            />
        );
    }
   return (
    <View>
        <View style={styles.mapPreview}>
            {locationPreview}
        </View>
        <View style={styles.actions}>
            <OutlineButton icon='location' onPress={getLocationHandler}>Locate User</OutlineButton>
            <OutlineButton icon='map' onPress={pickOnMapHandler}>Pick on Map</OutlineButton>
        </View>
    </View>
  )
}

export default LocationPicker

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    }
})