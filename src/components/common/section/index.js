import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import SectionHeader from './sectionHeader';
import SectionContent from './sectionContent';

export default class Section extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionSelected: false
        };
        this.animatedScale = new Animated.Value(1);
        this.animatedHeight = new Animated.Value(0);
        this.arrowDegree = new Animated.Value(0);
        this.sectionHeight = this.props.contentHeight;
    }

    componentWillMount() {
        this.init();
    }

    componentWillReceiveProps(newProps) {
        this.props = newProps;
        this.init();
    }

    onOpenSection() {
        this.animate(true);
    }

    onCloseSection() {
        this.animate(false);
    }

    init() {
        if (this.props.open) {
            this.animatedHeight = new Animated.Value(this.props.contentHeight);
            this.arrowDegree = new Animated.Value(1);
        }
    }

    animate(open) {
        let scaleToValue = 0;
        let heightToValue = 0;
        let degreeToValue = 0;
        if (open) {
            scaleToValue = 1;
            heightToValue = this.sectionHeight;
            degreeToValue = 1;
        }

        const scaleAnimation = Animated.timing(this.animatedScale, {
            toValue: scaleToValue,
            duration: (open) ? 10 : 1000,
        });

        const heightAnimation = Animated.timing(this.animatedHeight, {
            toValue: heightToValue,
            duration: 225,
        });

        // let sequenceAnimation;
        // if (open) {
        //     sequenceAnimation = Animated.sequence([heightAnimation, scaleAnimation]);   
        // } else {     
        //     sequenceAnimation = Animated.sequence([scaleAnimation, heightAnimation]);
        // }

        Animated.parallel([
            Animated.timing(this.arrowDegree, {
                toValue: degreeToValue,
                duration: 1000,
            }),
            heightAnimation
        ]).start();
    }

    render() {
        return (
            <View
                style={[{
                    backgroundColor: this.props.sectionBackgroundColor
                },
                this.props.style
                ]}
            >
                <SectionHeader
                    drawerMenu={this.props.drawerMenu}
                    style={this.props.headerStyle}
                    hideBorder={true}
                    backgroundColor={this.props.sectionHeaderBackground}
                    imageColor={this.props.sectionHeaderImageColor}
                    selected={this.props.open}
                    imageSelectedColor={this.props.sectionHeaderImageSelectedColor}
                    textColor={this.props.sectionHeaderTextColor}
                    name={this.props.headerName} imageName={this.props.imageName}
                    headerImage={this.props.headerImage}
                    openSection={this.onOpenSection.bind(this)}
                    closeSection={this.onCloseSection.bind(this)}
                    arrowDegree={this.arrowDegree}
                />
                <SectionContent
                    style={{ flex: 1 }}
                    content={this.props.content}
                    animatedScale={this.animatedScale}
                    animatedHeight={this.animatedHeight}
                />
            </View>
        );
    }
}
