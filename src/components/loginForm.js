import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Image, ActivityIndicator, Text, Animated, TouchableWithoutFeedback, 
    StyleSheet, Alert, Picker } from 'react-native';
import { loginUser } from '../actions/';
import { userUrlHelper, assignUrl } from '../helper';

class LoginForm extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            url: '',
            email: '',
            password: '',
            showUrlList: false,
            urlList: [],
            username: ''
        };
        this.handlePressIn = this.handlePressIn.bind(this);
        this.handlePressOut = this.handlePressOut.bind(this);
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);
        this.buttonAnimatedValue = new Animated.Value(1);
        // userUrlHelper('albert.xhani@outlook.com', '987654321');
    }

    componentDidMount() {
        Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 1000,
        }).start();
    }
    
    onUrlChanged(text) {
        this.setState({ ...this.state, url: text });
    }

    onEmailChanged(text) {
        this.setState({ ...this.state, email: text });
    }

    onPasswordChanged(text) {
        this.setState({ ...this.state, password: text });
    }

    onButtonPress() {
        const { email, password, url, username } = this.state;
        
        console.log(url, this.state.showUrlList);
        if (this.state.showUrlList && url !== '') {
            this.setState({ loading: true });
            assignUrl(url, username, password, this.props.navigation, this, this.state.dispatch);
        } else {
            this.props.loginUser(email, password, '', this.props.navigation, this);
        }
    }

    handlePressIn() {
        Animated.spring(this.buttonAnimatedValue, {
            toValue: 0.7
        }).start();
    }

    handlePressOut() {
        Animated.spring(this.buttonAnimatedValue, {
            toValue: 1
        }).start();
        this.onButtonPress();
    }

    renderLoading() {
        return (
            <View>
                <ActivityIndicator color={'white'} />
            </View>
        );
    }

    renderLoginButton() {
        return (
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }} >Login</Text>
        );
    }

    render() {
        const animatedStyle = { opacity: this.animatedValue };
        const buttonAnimatedStyle = { transform: [{ scale: this.buttonAnimatedValue }] };
        
        const options = this.state.urlList;

        return (
            <View style={{ padding: 5, height: 200, width: '90%', borderRadius: 5 }}>
                {/* <Animated.View 
                style={[styles.formInsideStyle, animatedStyle]}
                >                 */}
                    {
                        (this.state.showUrlList) ? 
                            <View style={styles.inputformStyle}>
                                <View style={styles.inputformImageHolderStyle}>
                                    <Image source={{ uri: 'url' }} style={styles.inputformImageStyle} />
                                </View> 
                                <View style={{ flex: 1, margin: 5 }}>
                                    <Picker 
                                        mode={'dropdown'}
                                        selectedValue={this.state.url} 
                                        onValueChange={(itemValue) => {
                                                if (itemValue !== 0) {
                                                    this.setState({ url: itemValue });
                                                    // this.onUrlPickPress(itemValue);
                                                }
                                            }
                                        }
                                        itemStyle={{ fontSize: 12 }}
                                    >
                                    <Picker.Item label='Please Select Url' value={0} />
                                        {options.map((item, index) => {
                                            return (<Picker.Item label={item.url} value={item.url} key={index} />); 
                                        })}
                                    </Picker>
                                </View>
                            </View> 
                        :
                            undefined
                    }

                        
                        {/* <View style={styles.verticalLine} /> */}
                        {/* <TextInput 
                        clearButtonMode='always'
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        style={styles.textInputStyle} 
                        placeholder='Enter URL'
                        placeholderTextColor='#ddd'
                        onSubmitEditing={() => { 
                            this.refs.email.focus(); 
                        }}
                        autoCapitalize='none'
                        autoCorrect={false}
                        returnKeyType='next'
                        value={this.state.url}
                        onChangeText={this.onUrlChanged.bind(this)}
                        /> */}
                    
                    
                    <View style={styles.inputformStyle}>
                        <View style={styles.inputformImageHolderStyle}>
                            <Image
                            source={{ uri: 'emails' }}
                            style={styles.inputformImageStyle} 
                            />
                        </View>
                       
                        <TextInput 
                        clearButtonMode='always'
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        style={styles.textInputStyle} 
                        placeholder='Enter Email'
                        placeholderTextColor='#ddd'
                        ref='email'
                        onSubmitEditing={() => { 
                            this.refs.password.focus(); 
                        }} 
                        autoCapitalize='none'
                        returnKeyType='next'
                        value={this.state.email}
                        onChangeText={this.onEmailChanged.bind(this)}
                        />
                    </View>
                    
                    <View style={styles.inputformStyle}>
                        <View style={styles.inputformImageHolderStyle}>
                            <Image 
                            source={{ uri: 'password' }} 
                            style={styles.inputformImageStyle} 
                            />
                        </View>
                        {/* <View style={styles.verticalLine} /> */}
                        <TextInput 
                        clearButtonMode='always' 
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={styles.textInputStyle}
                        ref='password' 
                        secureTextEntry 
                        placeholder='Enter Password'
                        placeholderTextColor='#ddd'
                        autoCapitalize='none'
                        returnKeyType='done' 
                        value={this.state.password}
                        onChangeText={this.onPasswordChanged.bind(this)}
                        />
                    </View>
                   
                    <View style={styles.buttonHolderStyle}>
                        <TouchableWithoutFeedback
                        onPressIn={this.handlePressIn} 
                        onPressOut={this.handlePressOut}
                        >
                            <Animated.View style={[styles.buttonStyle, buttonAnimatedStyle]}>
                                {(this.state.loading) ? this.renderLoading() : this.renderLoginButton()}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                {/* </Animated.View> */}
            </View>
        );
   }
}

const styles = StyleSheet.create({
    formInsideStyle: {
        // borderWidth: 1,
        // // backgroundColor: 'white',
        // borderColor: '#d3d3d3',
    },
    inputformStyle: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center', 
        marginTop: 7,
        backgroundColor: 'white',
        borderRadius: 5
    },
    inputformImageHolderStyle: {
        height: '100%',
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputformImageStyle: {
        height: 23,
        width: 23,
        tintColor: '#ddd',
        marginLeft: 8
    },
    horizontalLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#d3d3d3'
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#d3d3d3'
    },
    textInputStyle: {
        height: '100%',
        flex: 1,
        fontSize: 14,
        paddingLeft: 5,
        backgroundColor: 'white',
        margin: 10
    },
    buttonHolderStyle: {
        marginTop: 20,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    buttonStyle: {
        width: 100,
        height: '80%',
        borderRadius: 3,
        // backgroundColor: '#1863ae',
        backgroundColor: '#339DE5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: 'bold'
    }
});
export default connect(undefined, { loginUser })(LoginForm);
