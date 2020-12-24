import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text } from 'react-native';
import { drawerButtonPress } from '../../../actions';
import {
    DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR, DRAWER_SECTION_HEADER_TEXT_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_COLOR
} from '../../../variables/themeColors';
import { HOME, CALENDAR } from '../../../variables/constants';
import { fontStyles } from '../../../styles/common';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';

// class ImageButton extends Component {

//     constructor(props) {
//         super(props);
//         // this.state = { iconName: faTachometerAlt };
//     }

//     UNSAFE_componentWillMount() {
//         this.assignIcons();
//     }

//     onButtonPress() {
//         console.log('TODO: replace navigation with hook')
//         if (this.props.type === HOME) {
//             this.props.dispatch(drawerButtonPress(this.props.type));
//             this.props.navigation.jumpTo('Dashboard');
//         } else {
//             this.props.dispatch(drawerButtonPress(this.props.module.name,
//                 this.props.module.label, this.props.module.id));
//             this.props.navigation.jumpTo('Records', {
//                 moduleName: this.props.module.name,
//                 moduleLable: this.props.module.label,
//                 moduleId: this.props.module.id
//             });
//         }
//     }

//     assignIcons() {
//         switch (this.props.type) {
//             case ACCOUNTS:
//                 // this.setState({ iconName: faBuilding });
//                 break;

//             case CONTACTS:
//                 // this.setState({ iconName: faUser });
//                 break;

//             default:


//         }
//     }


//     render() {
//         // console.log(this.props.selectedButton, this.props.type);
//         return (


//         );
//     }
// }

// const mapStateToProps = ({ drawer }) => {
//     const { selectedButton } = drawer;
//     return { selectedButton };
// };

// export default connect(mapStateToProps)(ImageButton);

export default function ImageButton({
    icon,
    type,
    label,
    module
}) {

    const { selectedButton } = useSelector(state => state.drawer);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    function onButtonPress() {

        switch (type) {
            case HOME:
                dispatch(drawerButtonPress(type));
                navigation.navigate('Dashboard');
                break;

            case CALENDAR:
                dispatch(drawerButtonPress(type));
                navigation.navigate('Calendar');
                break;

            default:
                dispatch(drawerButtonPress(
                    module.name,
                    module.label,
                    module.id
                ));
                navigation.navigate('Records', {
                    moduleName: module.name,
                    moduleLable: module.label,
                    moduleId: module.id
                });
                break;
        }
    }

    return (
        <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => onButtonPress()}
        >
            <View
                style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',

                }}
            >
                <View
                    style={{ paddingLeft: 15, width: 46 }}
                >
                    <Icon
                        name={icon}
                        size={20}
                        color={(selectedButton !== type) ? DRAWER_SECTION_HEADER_TEXT_COLOR : DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR}
                    />
                </View>
                <Text style={[fontStyles.drawerMenuButtonText, { color: selectedButton === type ? DRAWER_MODULE_BUTTON_TEXT_SELECTED_COLOR : DRAWER_SECTION_HEADER_IMAGE_COLOR }]}>
                    {label}
                </Text>
            </View>
        </ TouchableOpacity>
    );
}