import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    Text, 
    Image,
    ScrollView, 
    AsyncStorage,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { HEADER_COLOR } from '../../variables/themeColors';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { inputValue: '', todoArray: [] };
    }

    componentDidMount() { 
       this.loadNotes.bind(this)(); 
    } 
    
    handleTextChange(value) {
        this.setState({
          inputValue: value
        });
    }

    handleSendButtonPress() {
        if (this.state.inputValue !== '') {
            const newArr = this.state.todoArray.concat({ value: this.state.inputValue });
            AsyncStorage.setItem('@MyNotes:key', JSON.stringify(newArr));   
            this.setState({
            ...this.state,
            inputValue: '',
            todoArray: newArr
            });   
        }
    }

    async loadNotes() {
        const arr = await AsyncStorage.getItem('@MyNotes:key');
        if (arr !== null) {
          this.setState({
            todoArray: JSON.parse(arr),   
          });   
          //console.log(arr);
          //console.log(this.state.todoArray);
        }
    }
    handleDeleteItem(index) {
        //console.log(index);
        this.state.todoArray.splice(index, 1);
        const newArr = this.state.todoArray.slice();
        AsyncStorage.setItem('@MyNotes:key', JSON.stringify(newArr));   
        this.setState({
          ...this.state,
          todoArray: newArr
        });
    }
    renderFlatListItem(item, index) {
        //console.log(index);
        const swipeoutBtns = [
            {
                component: 
                <View style={{ backgroundColor: '#ffffff', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', paddingRight: 12 }}>
                    <Image source={require('./right.png')} style={{ width: 20, height: 20 }} />
                    </View>,                
                onPress: this.handleDeleteItem.bind(this, index)

            }
        ];
        return (     
            <Swipeout right={swipeoutBtns} autoClose buttonWidth={30} style={styles.swipeStyle}>
                <View style={styles.todoItem}>   
                    <Text style={styles.todoText}>{item.value}</Text>
                </View>
            </Swipeout>
        );
    }

    renderSeparator = () => {
        return (
            <View
            style={{
                height: 1,
                width: '100%',
                backgroundColor: '#CED0CE',
            }}
            />
        );
    };
    
    render() {
        return (
        <View style={{ margin: 5, flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <View style={styles.rowContainer}>
                    <TextInput
                        style={styles.inputStyle}
                        value={this.state.inputValue}
                        onChangeText={this.handleTextChange.bind(this)}
                        placeholder="Enter your todo here..."
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholderTextColor="gray"
                    />
                    <TouchableOpacity onPress={this.handleSendButtonPress.bind(this)}>
                        <View 
                            style={{ width: 40, 
                                    height: 20, 
                                    flex: 1, 
                                    marginTop: 2, 
                                    marginBottom: 2, 
                                    backgroundColor: '#34bfa3',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 2 }}
                        >
                            <Text style={{ color: '#ffffff' }}>Add</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                </View>
            
            </View> 
            <View style={styles.messageStyle}>
                <Text style={{ textAlign: 'center', color: '#000000', fontSize: 12 }}>Swipe right to complete the notes</Text>
            </View> 
            <View style={styles.listContainer}>
           
                <ScrollView>
                <FlatList
                    key={'flatlistexample'}
                    data={this.state.todoArray}
                    renderItem={({ item, index }) => this.renderFlatListItem.bind(this)(item, index)}
                    keyExtractor={(item, index) => index} 
                    ItemSeparatorComponent={this.renderSeparator}
                /> 
                </ScrollView>
          
            </View>
        </View>

        );
    }
}
const styles = {
    container: {
       // borderWidth: 1,
       // borderRadius: 2,
        //borderColor: '#000',
        //borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        backgroundColor: '#ffffff',
        elevation: 1,   
        
    },
    subContainer: {
        
        padding: 5,
        
        backgroundColor: HEADER_COLOR,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        
    },
    listContainer: {
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderWidth: 2,
        borderRadius: 2,
        height: '60%',
        //padding: 5,
        
        
    },
    rowContainer: {
        height: 38,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        color: '#ffffff',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 16,
        lineHeight: 15,
        fontStyle: 'italic',
        flex: 1
    },
    todoItem: {
        alignItems: 'flex-start',
        backgroundColor: '#fff', 
        height: 30,
        width: '100%',   
        paddingLeft: 50,
        paddingTop: 5,
        

    },
    todoText: {
        flex: 1,
        fontSize: 16,
    },
    swipeStyle: {
        backgroundColor: '#fff', 
        
    },
    messageStyle: {
        backgroundColor: '#fff',
        height: 20, 
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
        borderColor: '#ddd',
        borderWidth: 1,
        borderBottomWidth: 0
        
        
    }
};

export default Header;
