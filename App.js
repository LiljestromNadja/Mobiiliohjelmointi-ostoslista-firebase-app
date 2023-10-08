import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View, Keyboard, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, update, remove } from 'firebase/database';
import { useEffect, useState } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  projectId: "ostoslista-firebase-app",
  storageBucket: "ostoslista-firebase-app.appspot.com",
  messagingSenderId: " ",
  appId: " "
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Luodaan tietokantakahva
const database = getDatabase(app);


export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct]  =useState('');
  const [items, setItems] = useState([]);

  
  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    setItems(Object.values(data));
    console.log(data);
    })
    }, []);


  const saveItem = () => {
    if (product == undefined || amount == undefined) {
      Alert.alert("Please fill both fields");

    } else {      
      const newRef = push(ref(database, "items/"));
      const newKey = newRef.key;
      const newItem = {
        product: product,
        amount: amount,
        id: newKey,
      };

      update(ref(database, "items/" + newKey), newItem);
      console.log('Added item: ', newItem);
      console.log('Added item, key:', newItem.id);
      setProduct();
      setAmount();
      Keyboard.dismiss();
      
    }
  };
  

  const deleteItem = (id) => {
    remove(ref(database, "items/" + id));
    console.log('Deleted item, id: ', id);
  };

    
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.container}>
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping List</Text>
      <TextInput placeholder='Product' style={{ textAlign: 'center', marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount'  style={{ textAlign: 'center', marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Buy: </Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>- {item.product}, {item.amount} </Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> Ok</Text></View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />   
      <StatusBar style="auto" />   
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});

