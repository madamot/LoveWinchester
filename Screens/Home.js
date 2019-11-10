/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
 StyleSheet,
 View,
 ScrollView,
 SafeAreaView,
 Text,
 Image,
 Dimensions,
 Button,
 TouchableOpacity,
} from 'react-native';
import MapView, { MAP_TYPES, ProviderPropType } from 'react-native-maps';
import List from '../Screens/Components/List';

const { Marker } = MapView;
const { height, width } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE = 51.064022;
const LONGITUDE = -1.316288;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const locations = [
      {
        id: 1,
        type: 'Attractions',
        name: 'Cathedral',
        image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
        latlng: {
          latitude: 51.060891,
          longitude: -1.313165,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
      },
      {
        id: 2,
        type: 'Attractions',
        name: 'Great Hall',
        image: 'https://thecrestdroxfordholidays.com/wp-content/uploads/2018/09/Winchester-Great-Hall.png',
        latlng: {
          latitude: 51.062759,
          longitude: -1.319771,
        }
      },
      {
        id: 3,
        type: 'Attractions',
        name: 'St Alfred',
        image: 'https://www.historic-uk.com/wp-content/uploads/2017/04/king-alfred-and-the-cakes.jpg',
        latlng: {
          latitude: 51.061520,
          longitude: -1.309099,
        }
      },
      {
        id: 4,
        type: 'Commercial',
        name: 'Weatherspoons',
        image: 'https://www.historic-uk.com/wp-content/uploads/2017/04/king-alfred-and-the-cakes.jpg',
        latlng: {
          latitude: 51.064042,
          longitude: -1.316191,
        }
      },
      ]

    const trails = [
      {
        id: 1,
        name: 'Cathedral',
        image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
      },
      {
        id: 2,
        name: 'Great Hall',
        image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
      },
      {
        id: 3,
        name: 'Cathedral',
        image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
      },
      {
        id: 4,
        name: 'Great Hall',
        image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
      },
      {
        id: 5,
        name: 'Cathedral',
        image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
      },
      {
        id: 6,
        name: 'Great Hall',
        image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
      },
      ]


export default class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    active: 'all',
    selection: false,
    locations: locations,
    trails: trails,
    chosenLocation: "",
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  handleTab = (tabKey) => {
    let newLocations = locations;

    if (tabKey !== 'all') {
      newLocations = locations.filter(locations => locations.type === tabKey);
    }

    this.setState({ active: tabKey, locations: newLocations });
    // console.log(this.state.active);
  }


  goToPlace(location) {
    const chosenLocation = this.state.latlng;
    this.map.animateCamera({ center: {
      latitude:
        location.latitude,
      longitude:
        location.longitude
      }
    });
  }

  goBack() {
    this.map.animateCamera({ center: this.backCoordinate() });
    // this.map.animateCamera({ pitch: this.getRandomFloat(0, 90) });
  }

  backCoordinate() {
    return {
      latitude:
        LATITUDE,
      longitude:
        LONGITUDE,
    };
  }


  focusHandler = (place) => {
    if (this.state.selection === false) {
      this.setState({ selection: true });
      this.setState({ chosenLocation: place });
      if (this.state.chosenLocation) {

        this.goToPlace(this.state.chosenLocation.latlng);
      }
    } else {
      this.setState({ selection: false });
      this.goBack();
    }
  }


  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={{flex: 2, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.login}>
              <Text style={{fontSize: 18, color: 'purple'}}>Login</Text>
            </View>
            <View style={styles.settings}>
              <Button
                title="Settings"
                onPress={() => this.props.navigation.navigate('Settings')}
              />
            </View>
          </View>
        </View>
        {this.renderTabs()}
      </View>
    )
  }

  renderTabs() {
    const { active } = this.state;

    return (
      <View style={styles.tabs}>
        <View style={[styles.tab, active === 'all' ? styles.activeTab : null ]}>
          <Text
            style={[
              styles.tabTitle,
              active === 'all' ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab('all')}
          >
            All
          </Text>
        </View>
        <View style={[styles.tab, active === 'Attractions' ? styles.activeTab : null ]}>
          <Text
            style={[
              styles.tabTitle,
              active === 'attractions' ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab('Attractions')}
          >
            Attractions
          </Text>
        </View>
        <View style={[styles.tab, active === 'Commercial' ? styles.activeTab : null ]}>
          <Text
            style={[
              styles.tabTitle,
              active === 'commercial' ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab('Commercial')}
          >
            Commercial
          </Text>
        </View>
      </View>
    )
  }

  renderMap() {
    const winchMarker = ({type}) => (
      <View style={[styles.marker, styles['${type}Marker']]}>
        {type === 'Attractions' ?
          <Text>A</Text>
        : <Text>C</Text>
        }
      </View>
    )
    return (
      <View style={styles.map}>
        <MapView
          provider={this.props.provider}
          ref={ref => {
            this.map = ref;
          }}
          style={{flex: 1, height: height * 0.5, width,}}
          showsMyLocationButton={true}
          initialRegion={this.state.region}
          onRegionChange={region => this.onRegionChange(region)}
        >
          {this.state.locations.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.latlng}
            >
              {winchMarker(marker)}
            </Marker>
          ))}
        </MapView>
      </View>
    )
  }

  renderList() {
    const { locations, trails, selection, chosenLocation } = this.state;
    if (!selection) {
      return (
        <View style={styles.locations}>
          <ScrollView horizontal={true}>
            <List name="Locations" list={locations} handler={this.focusHandler} />
          </ScrollView>

          <ScrollView horizontal={true}>
            <List name="Trails" list={trails} handler={this.focusHandler} />
          </ScrollView>
        </View>
      )
    }
    else {
      return (
        <ScrollView>
          <View style={styles.focusContainer}>
            <View style={styles.backButton}>
              <Button title='X' onPress={this.focusHandler} />
            </View>
            <View>
              <View style={styles.focusData}>
                <Text style={styles.dataTitle}>{chosenLocation.name}</Text>
                <Text>{chosenLocation.type}</Text>
                <TouchableOpacity
                  style={styles.ARButton}
                  onPress={() => this.props.navigation.navigate('ARContent')}
                ><Text style={styles.buttonTxt}>Go to AR Content</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )
    }
  }

   render() {
     return (
       <SafeAreaView style={styles.container}>
         {this.renderHeader()}
         {this.renderMap()}
         <ScrollView style={styles.container}>
           {this.renderList()}
         </ScrollView>
       </SafeAreaView>
     );
   }
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   headerContainer: {
     backgroundColor: '#fff',
     left: 0,
     right: 0,
     top: 0,
     height: height * 0.1,
     width: width,
   },
   header: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     paddingHorizontal: 14,
   },
   login: {
     alignItems: 'center',
     justifyContent: 'center',
     paddingHorizontal: 14,
   },
   settings: {
     alignItems: 'center',
     justifyContent: 'center',
     paddingHorizontal: 14,
   },
   tabs: {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'center',
     height: height * 0.05,
     alignItems: 'center',
     bottom: -7,
   },
   tab: {
     justifyContent: 'center',
     paddingHorizontal: 20,
   },
   tabTitle: {
     fontWeight: 'bold',
     marginBottom: 10,
   },
   activeTab: {
     borderBottomColor: 'purple',
     borderBottomWidth: 5,
   },
   activeTabTitle: {
     color: 'purple',
   },
   map: {
     flex: 1,
   },
   focusContainer: {
     flex: 1,
     paddingHorizontal: 14,
   },
   backButton: {
     alignItems: 'flex-end',
     justifyContent: 'flex-end',
   },
   focusData: {
     flex: 1,
     paddingHorizontal: 14,
   },
   dataTitle: {
     fontWeight: 'bold',
     fontSize: 18,
   },
   ARButton: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 15,
     borderWidth: 0.5,
     borderColor: '#147EFB',
     borderRadius: 10,
     padding: 15,
     backgroundColor: '#147EFB',
     color: 'white',
   },
   buttonTxt: {
     color: 'white',
     fontSize: 12,
     fontWeight: 'bold',
   },
 });
