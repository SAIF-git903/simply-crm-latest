import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';

const Summery = ({navigation, moduleName, recordId}) => {
  const [data, setData] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {};

  return (
    <View>
      <Text>{moduleName}</Text>
      <Text>{recordId}</Text>
    </View>
  );
};

export default Summery;
