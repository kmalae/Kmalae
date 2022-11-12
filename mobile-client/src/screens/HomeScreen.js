import { SafeAreaView, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import RideLiftOptions from '../components/RideLiftOptions'
import { useNavigation } from '@react-navigation/native';
import ShowAllLiftRequests from './ShowAllLiftRequests';
import ShowAllRideRequests from './ShowAllRideRequests';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style = {{flex: 1, borderColor: 'black', borderWidth: 4}}>
      <Image 
          style={page.image}
          source={require('../../assets/images/logo.png')}
      />

      
      <RideLiftOptions/>

      <View style={{marginTop: 40, display: 'flex', flexDirection: 'row', justifyContent : 'space-between', padding: 10 }}>
        <TouchableOpacity style= {{backgroundColor : 'gray', padding: 10}}
              onPress = {() => {navigation.navigate(ShowAllRideRequests)}}>
          <Text> Show all Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity style= {{backgroundColor : 'gray', padding: 10}}
            onPress = {() => {navigation.navigate(ShowAllLiftRequests)}}>
          <Text> Show all Lifts</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const page = StyleSheet.create({
  image : {
    width: 70,
    height: 70,
    marginTop: 80,
    marginLeft: 20,
  }
})
export default HomeScreen