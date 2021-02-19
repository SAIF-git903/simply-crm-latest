import React, { useEffect, useState, memo } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Text,
    ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fontStyles } from '../../../styles/common';
import { getComments } from '../../../ducks/comments';
import CommentList from '../../../components/comments/commentList';
import InputField from '../../../components/comments/inputField';

export default function Comments({ recordId }) {
    const [isFirstLoad, setFirstLoad] = useState(true);
    const [inputValue, setInputValue] = useState('');

    const dispatch = useDispatch();
    const { isLoading, comments, isAddingComment, editedComment } = useSelector(
        state => state.comments,
        (p, n) => p.comments === n.comments
            && p.isLoading === n.isLoading
            && p.isAddingComment === n.isAddingComment
            && p.editedComment === n.editedComment
    );

    useEffect(() => {
        dispatch(getComments(recordId));
    }, []);

    useEffect(() => {
        if (editedComment) {
            setInputValue(editedComment.content);
        } else {
            setInputValue('');
        }
    }, [editedComment]);

    function onChangeText(text) {
        setInputValue(text);
    }

    function getRootComments() {
        const result = [];

        for (const comment of comments) {
            if (comment.parent_comments.value?.length === 0) {
                const com = comment;
                com.children = getChildComments(comment);
                result.push(com);
            }
        }

        return result;
    }

    function getChildComments(parentComment) {
        const childComments = [];
        for (const comment of comments) {
            if (comment.parent_comments.value === parentComment.id) {
                const com = comment;
                com.children = getChildComments(comment);
                childComments.push(com);
            }
        }

        return childComments;
    }

    function onSubmit() {
        setInputValue('');
    }

    function renderEmpty() {
        let view = (
            <View style={styles.emptyList}>
                <Text style={fontStyles.fieldLabel}>No comments added yet.</Text>
            </View>
        );
        if (isLoading && isFirstLoad) {
            view = (
                <View
                    style={{
                        flex: 1,
                        margin: 10,
                        justifyContent: 'center'
                    }}
                >
                    <ActivityIndicator size={'large'} />
                </View>
            );
        }

        return view;
    }

    function onRefresh() {
        if (isFirstLoad) {
            setFirstLoad(false);
        }
        dispatch(getComments(recordId, true));
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={(Platform.OS === "ios") ? "padding" : "height"}
            keyboardVerticalOffset={122}
        >
            <View style={styles.wrapper}>
                <CommentList
                    isLoading={isLoading}
                    scrollEnabled={true}
                    comments={getRootComments()}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading && !isAddingComment}
                            onRefresh={onRefresh}
                        />}
                />

                <InputField
                    onChangeText={onChangeText}
                    value={inputValue}
                    placeholder={'Add your comment here'}
                    onSubmit={onSubmit}
                    recordId={recordId}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        flex: 1
    },
    emptyList: {
        transform: [{ scaleY: -1 }],
        backgroundColor: 'white',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
