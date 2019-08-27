import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWrench, faLuggageCart } from '@fortawesome/pro-regular-svg-icons';
import { DRAWER_BORDER_COLOR } from '../../../variables/themeColors';
import { TOOLS, SALES } from '../../../variables/constants';

export default class SectionHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            isArrowVisible: true
        };
    }

    componentWillMount() {
        this.init();
        this.assignIcons();
    }

    componentDidMount() {
        this.props.openSection();
        this.setState({ selected: true });
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.init();
    }


    onHeaderPress() {
        if (this.state.selected) {
            // this.props.closeSection();
            // this.setState({ selected: false });
        } else {
            this.props.openSection();
            this.setState({ selected: true, isArrowVisible: true });
        }
    }

    onClosePress() {
        if (this.state.selected) {
            this.props.closeSection();
            this.setState({ selected: false, isArrowVisible: false });
        } 
    }

    assignIcons() {
        switch (this.props.name) {
            case TOOLS:
                this.setState({ iconName: faWrench });
                break;
           
            case SALES: 
                this.setState({ iconName: faLuggageCart });
                break;
           
            default:


        } 
    }


    init() {
        if (this.props.selected) {
            this.setState({ selected: true });
        } else {
            this.setState({ selected: false });
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.onHeaderPress.bind(this)}>
                <View style={[styles.headerBackground, { backgroundColor: this.props.backgroundColor }]}>
                    { (this.props.headerImage) ?
                        <View style={styles.imageStyle}>
                            <FontAwesomeIcon icon={this.state.iconName} size={23} color={this.props.imageColor} />
                        </View>
                        // <Image 
                        // source={{ uri: this.props.imageName }}
                        // // style={(this.state.selected) ? 
                        // // [styles.imageStyleSelected, { tintColor: this.props.imageSelectedColor }] : 
                        // // [styles.imageStyle, { tintColor: this.props.imageColor }]}
                        // style={styles.imageStyle}
                        // /> 
                        :
                        undefined 
                    }
                    <Text style={{ color: this.props.imageColor, fontSize: 16 }}>{this.props.name}</Text>
                    {/* <Animated.View style={[styles.arrowAnimatedViewStyle, arrowAnimation]}> */}
                    
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        {
                            (this.state.isArrowVisible) ?
                            <TouchableWithoutFeedback onPress={this.onClosePress.bind(this)}>
                                <View style={{ width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 6 }}>
                                    <Image 
                                        source={{ uri: 'uparrow' }}
                                        style={(this.state.selected) ? 
                                        [styles.arrowImageStyleSelected, { tintColor: DRAWER_BORDER_COLOR }] : 
                                        [styles.arrowImageStyle, { tintColor: this.props.imageColor }]}
                                    />
                                </View>

                            </TouchableWithoutFeedback>
                            : 
                            undefined
                            
                        }
                        
                    </View>
                   
                    {/* </Animated.View> */}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    headerBackground: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
        paddingLeft: 5,
        borderColor: DRAWER_BORDER_COLOR,
        marginTop: 5,
        borderBottomWidth: 0.5,
        height: 40,
       
    },
    imageStyle: {
        height: 25,
        width: 25,
        marginRight: 10,
        marginLeft: 5
    },
    imageStyleSelected: {
        height: 25,
        width: 25,
    },
    arrowImageStyle: {
        width: 15, 
        height: 15,
        
    },
    arrowImageStyleSelected: {
        width: 15,
        height: 15
        
    },
    arrowAnimatedViewStyle: {
        flex: 1,
    }
});
