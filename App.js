import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Alert,
  FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';

function ResultList(props){

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[backgroundColor]}>
      <Text style={[textColor]} selectable={true}>{item.title}</Text>
    </TouchableOpacity>
  );
  
    const {selectedId, setSelectedId, data} = props;
  
    const renderItem = ({ item }) => {
      const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
      const color = item.id === selectedId ? 'white' : 'black';
  
      return (
        <Item
          item={item}
          onPress={() => setSelectedId(item.id)}
          backgroundColor={{ backgroundColor }}
          textColor={{ color }}
        />
      );
    };
  
    return (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        />
    );

}

export default function App() {
  const [image, setImage] = useState(null);
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      BarCodeScanner.scanFromURLAsync(result.uri).then(arr => {
        console.log(arr);
        setList(arr.map((item,index)=>({id: index, title: item.data})));
      }).catch( err =>{
        console.error(err);
        Alert.alert("failed to recognize qr code");
      })
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <View>
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      {list.length > 0 ? <ResultList data={list} {...{selectedId, setSelectedId}}/> : <Text style={{color: 'red'}}>No QR Code Found, make sure image has no transparency.</Text>}
      </View>}
    </SafeAreaView>
  );
}

