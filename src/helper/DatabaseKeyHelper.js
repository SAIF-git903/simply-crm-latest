import { AsyncStorage } from 'react-native';
import { DB_KEYS_COLLECTION } from '../variables/constants';

export const addDatabaseKey = async (key) => {
    try {
        let allKeys = JSON.parse(await AsyncStorage.getItem(DB_KEYS_COLLECTION));
        if (allKeys !== null) {
            allKeys.push(key);
            const uniqueArray = allKeys.filter((item, index, inputArray) => 
            (inputArray.indexOf(item) === index));
            await AsyncStorage.setItem(DB_KEYS_COLLECTION, JSON.stringify(uniqueArray));
        } else {
            allKeys = [];
            allKeys.push(key);
            await AsyncStorage.setItem(DB_KEYS_COLLECTION, JSON.stringify(allKeys));
        }
    } catch (error) {
        //create a new key
        const allKeys = [];
        allKeys.push(key);
        await AsyncStorage.setItem(DB_KEYS_COLLECTION, allKeys);
    }
};

export const removeAllDatabase = async (callback) => {
    try {
        const allKeys = JSON.parse(await AsyncStorage.getItem(DB_KEYS_COLLECTION));
        if (allKeys !== null) {
            await AsyncStorage.multiRemove(allKeys, callback);
        } 
    } catch (error) {
        //Do nothing
    }
};
