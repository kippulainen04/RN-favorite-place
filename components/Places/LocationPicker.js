import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native"
import { getCurrentPositionAsync, PermissionStatus, useForegroundPermissions } from "expo-location"
import { useEffect, useState } from "react"
import { Alert, Image, StyleSheet, Text, View } from "react-native"
import { Colors } from "../../constants/colors"
import { getAddress, getMapPreview } from "../../util/location"
import OutlineButton from "../UI/OutlineButton"

const LocationPicker = ({ onPickLocation }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const [pickedLocation, setPickedLocation] = useState();
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    
    useEffect(() => {
        if (isFocused && route.params) {
            const mapPickedLocation = { 
                lat: route.params.pickedLat, 
                lng: route.params.pickedLng
            };
            setPickedLocation(mapPickedLocation);
        }
    } ,[route, isFocused]);

    useEffect(() => {
        async function handlerLocation() {
            if (pickedLocation) {
                const address = await getAddress(
                    pickedLocation.lat, 
                    pickedLocation.lng
                );
                onPickLocation({ ...pickedLocation, address: address })
            }
        }
        handlerLocation();
       
    }, [pickedLocation, onPickLocation]);

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
        });
       
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