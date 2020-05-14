import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import { isIphoneX } from 'react-native-iphone-x-helper';

let { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const renderBullets = (data) => data.map((item) => {
    return <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 12,
    }}>
        <Icon
            name='check-circle'
            solid
            size={14}
            color='#48CB53'
            style={{
                top: 5,
                paddingRight: 5
            }}
        />
        <Text style={styles.bullet}>
            {item}
        </Text>
    </View>
})

export default function IntroSlide({ image, subtitle, title, bullets }) {
    const imageSize = Image.resolveAssetSource(image);

    const imagePreferredWidth = verticalScale(280);
    const scaledHeight = (imagePreferredWidth) * imageSize.height / imageSize.width;

    return (
        <View style={styles.wrapper}>
            {/* image container */}
            <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: (Platform.OS === 'ios') ? (isIphoneX() ? 42 : 30) : 20, marginBottom: 20 }}>
                <Image
                    source={image}
                    style={{
                        width: imagePreferredWidth,
                        height: scaledHeight,
                    }}
                />
            </View>

            {/* content container */}
            <View style={{ flex: 1, justifyContent: 'center', marginBottom: 30, paddingHorizontal: 20 }}>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.title}>{title}</Text>
                <View style={{
                    paddingHorizontal: 10
                }}>
                    {renderBullets(bullets)}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    subtitle: {
        fontFamily: 'Poppins-Light',
        fontSize: moderateScale(14),
        color: '#2688f2',
        textAlign: 'center'
    },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(20),
        color: '#1c1c1c',
        textAlign: 'center',
    },
    bullet: {
        fontFamily: 'Poppins-Regular',
        fontSize: moderateScale(13),
        color: '#59636f',
        lineHeight: moderateScale(22)
    }
});