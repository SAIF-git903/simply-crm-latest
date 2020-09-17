import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    LayoutAnimation,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
const moment = require('moment-timezone');
import { useDispatch, useSelector } from 'react-redux';

import {
    deleteComment,
    setReplyTo,
    setEdit
} from '../../ducks/comments';
import ChildrenList from './childrenList';
import CommentImage from './commentImage';
import { CustomLayoutLinear, CustomLayoutSpring } from '../../helper/layoutAnimations';

export const Button = ({ text, onPress, style }) => <TouchableOpacity
    style={[{
        paddingTop: 5,
        paddingLeft: 15
    }, style]}
    onPress={onPress}
>
    <Text style={styles.actionText}>{text}</Text>
</TouchableOpacity>

export default function Comment(props) {
    const {
        item,
        index,
        crmTz,
        scrollToIndex
    } = props;

    const [isChildRendered, setChildrenVisible] = useState(false);

    const dispatch = useDispatch();
    const { commentsLoading } = useSelector(
        state => state.comments,
        (p, n) => {
            return p.comments === n.comments
                && p.commentsLoading === n.commentsLoading
        }
    );

    const { userId } = useSelector(state => state.auth.loginDetails)

    function renderCommentButtons() {
        const getRepliesText = (length) => length === 1 ? 'reply' : 'replies';
        return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {
                item.children.length !== 0
                    ? <Button
                        onPress={() => toggleChildren()}
                        text={`${item.children.length} ${getRepliesText(item.children.length)}`}
                        style={{ paddingLeft: 0 }}
                    />
                    : <View />
            }
            {processFile(item)}

            <View style={{ flexDirection: 'row', }}>
                <Button text={'Reply'} onPress={() => onReply()} />
                {
                    getCleanId(item.creator.value) === userId
                        ? <Button text={'Edit'} onPress={() => onEdit()} />
                        : null
                }
                <Button text={'Delete'} onPress={() => {
                    Alert.alert(
                        "Delete Comment",
                        "Are you sure you want to delete this comment?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            {
                                text: "Delete", onPress: () => {
                                    const commentIdClean = getCleanId(item.id);
                                    dispatch(deleteComment(commentIdClean))
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }} />
            </View>
        </View>
    }

    function processFile(item) {
        const imageTypeArray = ['image/bmp', 'image/gif', 'image/jpeg', 'image/png'];
        let fileButton = null;
        if (item.downloadData) {
            if (imageTypeArray.includes(item.downloadData.type)) {
                fileButton = (
                    <CommentImage
                        downloadData={item.downloadData}
                    >
                    </CommentImage>
                );
            } else {
                //download file or something else
            }
        }
        return fileButton;
    }

    function toggleChildren() {
        showChildren(!isChildRendered);
    }

    function showChildren(visible) {
        LayoutAnimation.configureNext(CustomLayoutLinear);
        setChildrenVisible(visible)
        setTimeout(() => {
            scrollToIndex(index)
        }, 350);
    }

    function onReply() {
        const { id, creator, commentcontent } = item;
        showChildren(true);

        setTimeout(() => {
            LayoutAnimation.configureNext(CustomLayoutSpring);

            dispatch(setReplyTo({
                id,
                creator: creator.label,
                content: commentcontent,
                callback: () => showChildren(true)
            }));
        }, 10);
    }

    function onEdit() {
        const { id, creator, commentcontent } = item;

        setTimeout(() => {
            LayoutAnimation.configureNext(CustomLayoutSpring);
            dispatch(setEdit({
                id,
                creator: creator.label,
                content: commentcontent
            }))
        }, 10);
    }

    // Returns record id without module id
    function getCleanId(id) {
        return id.toString().replace(/.*(?=x)+x/, '')
    }

    function renderLoading() {
        if (!isBeingDeleted) return;

        return <View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center'
        }}>
            <ActivityIndicator />
        </View>
    }

    function renderEdited() {
        if (item.createdtime === item.modifiedtime) return;

        return <View style={{ paddingTop: 5 }}>
            {
                item.reasontoedit.length !== 0
                    ? <Text style={styles.editedText}>Edit: {item.reasontoedit}</Text>
                    : null
            }
            <Text style={styles.editedText}>Comment modified {moment(moment.tz(item.modifiedtime, crmTz).format()).fromNow()}</Text>
        </View>
    }

    const isBeingDeleted = commentsLoading.includes(getCleanId(item.id))

    function renderCommentContent() {
        return <View style={{ ...styles.commentBox, opacity: isBeingDeleted ? 0.45 : 1 }}>
            <View style={styles.commentUserData}>
                <View style={styles.userIconBackground}>
                    <Icon
                        name={'user'}
                        solid
                        size={28}
                        color={'#CCCCCC'}
                    />
                </View>
                <View>
                    <Text style={styles.nameText}>{item.creator.label}</Text>
                    <Text style={styles.timeText}>{moment(moment.tz(item.createdtime, crmTz).format()).fromNow()}</Text>
                </View>
            </View>
            <View style={{ paddingTop: 5 }}>
                <Text style={styles.message}>{item.commentcontent}</Text>
                {renderEdited()}
            </View>
            <View>
                {renderCommentButtons()}
            </View>
        </View>
    }

    return <View
        pointerEvents={isBeingDeleted ? 'none' : null}
        style={{ marginBottom: 10 }}
    >
        {renderCommentContent()}
        <ChildrenList
            parentComment={item}
            isChildRendered={isChildRendered}
        />
        {renderLoading()}
    </View >
}

const styles = StyleSheet.create({
    userIconBackground: {
        backgroundColor: 'gray',
        height: 46,
        width: 46,
        borderRadius: 999,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentBox: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    nameText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#2b879e'
    },
    timeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#777777'
    },
    editedText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#777777'
    },
    message: {
        fontFamily: 'Poppins-Regular',
        paddingTop: 5
    },
    actionText: {
        fontFamily: 'Poppins-Medium',
        color: '#00BBF2'
    },
    commentUserData: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});