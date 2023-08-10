import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

let {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const renderBullets = data =>
  data.map((item, index) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingTop: index === 0 ? 0 : 12,
          flexWrap: 'wrap',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          <Icon
            name="check-circle"
            solid
            size={moderateScale(18)}
            color="#48CB53"
            style={{
              paddingRight: 5,
              top: 4,
            }}
          />
          <Text style={styles.bullet}>{item}</Text>
        </View>
      </View>
    );
  });

export default function IntroSlide({image, subtitle, title, bullets}) {
  const imageSize = Image.resolveAssetSource(image);

  const imagePreferredWidth = verticalScale(270);
  const scaledHeight =
    (imagePreferredWidth * imageSize.height) / imageSize.width;

  return (
    <View style={styles.wrapper}>
      {/* image container */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <Image
          resizeMode={'contain'}
          source={image}
          style={{
            width: imagePreferredWidth,
            height: scaledHeight,
          }}
        />
      </View>

      {/* content container */}
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>
        <View>{renderBullets(bullets)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    padding: 20,
    paddingBottom: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontFamily: 'Poppins-Light',
    fontSize: verticalScale(14),
    color: '#2688f2',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: verticalScale(19),
    color: '#1c1c1c',
    textAlign: 'center',
    paddingVertical: 10,
  },
  bullet: {
    fontFamily: 'Poppins-Regular',
    fontSize: verticalScale(15),
    color: '#59636f',
    flex: 1,
  },
});
