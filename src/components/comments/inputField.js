import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Text,
  Dimensions,
  LayoutAnimation,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SafeAreaView from 'react-native-safe-area-view';
import {useSelector, useDispatch} from 'react-redux';

import {addComment, setReplyTo, setEdit} from '../../ducks/comments';
import {CustomLayoutSpring} from '../../helper/layoutAnimations';

const screenWidth = Dimensions.get('screen').width;

export default function InputField(props) {
  const {onChangeText, onSubmit, value, placeholder, recordId} = props;

  const dispatch = useDispatch();

  const {isAddingComment, replyTo, editedComment} = useSelector(
    (state) => state.comments,
  );

  async function submit() {
    Keyboard.dismiss();

    await dispatch(
      addComment(
        recordId,
        replyTo ? replyTo.id : undefined,
        editedComment ? editedComment.id : undefined,
        value,
      ),
    );

    dispatch(setReplyTo(null));
    dispatch(setEdit(null));
    onSubmit();
    if (replyTo?.callback) replyTo.callback();
  }

  function renderReplyOrEdit() {
    if (!replyTo && !editedComment) return null;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 8,
          maxWidth: screenWidth * 0.85,
          left: -10,
        }}>
        <TouchableOpacity
          style={{
            height: 32,
            width: 44,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            LayoutAnimation.configureNext(CustomLayoutSpring);
            dispatch(setReplyTo(null));
            dispatch(setEdit(null));
          }}>
          <Icon name={'times'} solid size={18} color={'#CCCCCC'} />
        </TouchableOpacity>
        <View>
          <Text style={styles.replyText}>
            {replyTo ? 'Replying to' : 'Editing:'}{' '}
            <Text style={styles.nameText}>
              {replyTo ? replyTo.creator : editedComment.creator}
            </Text>
            :
          </Text>
          <Text
            style={styles.replyText}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {replyTo ? replyTo.content : editedComment.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.inputWrapper} forceInset={{bottom: 'always'}}>
      {renderReplyOrEdit()}

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{...styles.inputFieldWrapper}}>
          <TextInput
            editable={!isAddingComment}
            // autoCorrect={false}
            autoCorrect={true}
            multiline={true}
            // autoCapitalize="none"
            autoCapitalize="sentences"
            style={{
              ...styles.inputField,
              color: isAddingComment ? 'gray' : 'black',
              marginTop: 10,
            }}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={'#B2B3B5'}
            returnKeyType={'default'}
            onSubmitEditing={submit}
          />
        </View>
        <TouchableOpacity
          disabled={isAddingComment}
          onPress={value.length === 0 ? null : submit}
          style={{
            height: 46,
            width: 46,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {isAddingComment ? (
            <ActivityIndicator />
          ) : (
            <Icon
              name={'paper-plane'}
              solid
              size={23}
              color={value.length === 0 ? '#CCCCCC' : '#00BBF2'}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputFieldWrapper: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    // height: 48,
    borderRadius: 10,
  },
  inputField: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 20,
    fontSize: 15,
    height: 80,
  },
  nameText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#2b879e',
  },
  replyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});
