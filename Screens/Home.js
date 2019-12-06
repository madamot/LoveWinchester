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
import MapView, { MAP_TYPES, ProviderPropType, Callout } from 'react-native-maps';
import * as axios from 'axios';
import BottomDrawer from 'rn-bottom-drawer';
import List from '../Screens/Components/List';

const { Marker } = MapView;
const { height, width } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE = 51.064022;
const LONGITUDE = -1.316288;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const TAB_BAR_HEIGHT = 49;

    // const locations = [
    //   {
    //     id: 1,
    //     type: 'Attractions',
    //     name: 'Cathedral',
    //     image: 'https://www.winchester-cathedral.org.uk/wp-content/uploads/Winchester-074-23102013-A4.jpg',
    //     latitude: 51.060891,
    //     longitude: -1.313165,
    //   },
    //   {
    //     id: 2,
    //     type: 'Attractions',
    //     name: 'Great Hall',
    //     image: 'https://thecrestdroxfordholidays.com/wp-content/uploads/2018/09/Winchester-Great-Hall.png',
    //     latlng: {
    //       latitude: 51.062759,
    //       longitude: -1.319771,
    //     }
    //   },
    //   {
    //     id: 3,
    //     type: 'Attractions',
    //     name: 'St Alfred',
    //     image: 'https://www.historic-uk.com/wp-content/uploads/2017/04/king-alfred-and-the-cakes.jpg',
    //     latlng: {
    //       latitude: 51.061520,
    //       longitude: -1.309099,
    //     }
    //   },
    //   {
    //     id: 4,
    //     type: 'Commercial',
    //     name: 'Weatherspoons',
    //     image: 'https://www.historic-uk.com/wp-content/uploads/2017/04/king-alfred-and-the-cakes.jpg',
    //     latlng: {
    //       latitude: 51.064042,
    //       longitude: -1.316191,
    //     }
    //   },
    //   ]

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
  componentDidMount = () => {
    this.getLocations();
  }

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
    tabFilter: [],
    selection: false,
    locations: [],
    trails: trails,
    chosenLocation: "",
  }


    getLocations() {
    axios
      .get('http://127.0.0.1:8000/api/v1/')
      .then(res => {
        this.setState({ locations: res.data })
        this.setState({ tabFilter: res.data })
        console.log(this.state.locations);
      })
      .catch(err => {
        console.log("oh no");
      });

  }


  onRegionChange(region) {
    this.setState({ region });
  }

  handleTab = (tabKey) => {
    const newLocations = this.state.locations;
    //
    // if (tabKey !== 'all') {
    //   newLocations = this.state.locations.filter(locations => locations.type === tabKey);
    //   this.setState({ active: tabKey, locations: newLocations });
    // }
    //
    // this.setState({ active: tabKey, locations: newLocations });
    // console.log(newLocations);
    if (tabKey == 'all') {
      this.getLocations();
      this.setState({ active: tabKey });
    }
    else if (tabKey == 'Attraction') {

      tabFilter = this.state.locations.filter(locations => locations.type === tabKey);
      this.setState({ active: tabKey, tabFilter: tabFilter });
    }
    else if (tabKey == 'Commercial') {

      tabFilter = this.state.locations.filter(locations => locations.type === tabKey);
        this.setState({ active: tabKey, tabFilter: tabFilter });
    }
  }


  goToPlace(latitude, longitude) {
    const chosenLocation = this.state.latlng;
    this.map.animateCamera({ center: {
      latitude:
        latitude,
      longitude:
        longitude
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
      console.log(this.state.chosenLocation);
      if (this.state.chosenLocation) {

        this.goToPlace(this.state.chosenLocation.latitude, this.state.chosenLocation.longitude);
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
        <View style={[styles.tab, active === 'Attraction' ? styles.activeTab : null ]}>
          <Text
            style={[
              styles.tabTitle,
              active === 'attractions' ? styles.activeTabTitle : null
            ]}
            onPress={() => this.handleTab('Attraction')}
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
        {type === 'Attraction' ?
          <View style={styles.attractions}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>A</Text>
          </View>
        : <View style={styles.commercial}><Text style={{color: 'white', fontWeight: 'bold'}}>C</Text></View>
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
          {this.state.tabFilter.map(marker => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
            >
              {winchMarker(marker)}
              <Callout onPress={() => this.focusHandler(marker)} style={styles.plainView}>
                <View>
                  <Text>{marker.name}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    )
  }

  renderList() {
    const { locations, trails, selection, chosenLocation, tabFilter } = this.state;
    if (!selection) {
      return (
        <View style={styles.locations}>
          <List name="Locations" list={tabFilter} handler={this.focusHandler} />
          <List name="Trails" list={trails} handler={this.focusHandler} />
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
                  onPress={() => this.props.navigation.navigate('ARContent', {
                    location: chosenLocation.name,
                    otherParam: 'anything you want here',
                  })
                  }
                >
                  <Text style={styles.buttonTxt}>Go to AR Content</Text>
                </TouchableOpacity>
                <Text>{chosenLocation.description}</Text>
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
         <BottomDrawer
           containerHeight={500}
           offset={TAB_BAR_HEIGHT}
           startUp={false}
         >
           <ScrollView>
             {this.renderList()}
           </ScrollView>
         </BottomDrawer>
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
   attractions: {
     backgroundColor: 'green',
     borderRadius: 100,
     borderColor: 'white',
     borderWidth: 3,
     paddingHorizontal: 6,
     paddingVertical: 3,
   },
   commercial: {
     backgroundColor: 'red',
     borderRadius: 100,
     borderColor: 'white',
     borderWidth: 3,
     paddingHorizontal: 6,
     paddingVertical: 3,
   },
   plainView: {
    width: 100,
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
