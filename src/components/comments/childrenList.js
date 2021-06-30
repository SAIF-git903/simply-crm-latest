import React from 'react';
import { View } from 'react-native';
import CommentList from './commentList';

export default function ChildrenList(props) {
    const {
        isChildRendered,
        parentComment,
    } = props;

    if (!isChildRendered || parentComment.children.length === 0) {
        return null;
    }

    return (
        <View style={{
            marginTop: 10,
        }}>
            <CommentList
                scrollEnabled={false}
                style={{
                    borderLeftColor: '#D7D7D7',
                    borderLeftWidth: 2,
                    paddingLeft: 15,
                    paddingBottom: 10,
                }}
                comments={parentComment.children}
            />
        </View>
    );
}