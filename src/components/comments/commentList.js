import React, { createRef } from 'react';
import {
    FlatList
} from 'react-native';

import Comment from './comment';
import { useSelector } from 'react-redux';

const CommentList = (props) => {
    const { crmTz } = useSelector(state => state.auth.loginDetails)
    let scrollViewRef = createRef();

    const {
        comments,
        isLoading,
        style,
        contentContainerStyle,
        scrollEnabled,
        ListEmptyComponent,
        refreshControl,
    } = props;

    return (
        <FlatList
            inverted={true}
            ref={scrollViewRef}
            keyboardShouldPersistTaps='always'
            contentContainerStyle={{
                padding: 10,
                ...contentContainerStyle
            }}
            style={{
                ...style
            }}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={refreshControl}
            refreshing={isLoading}
            data={JSON.parse(JSON.stringify(comments)).reverse()}
            scrollEnabled={scrollEnabled}
            renderItem={({ item, index }) =>
                <Comment
                    item={item}
                    index={index}
                    crmTz={crmTz}
                    scrollToIndex={(index) => {
                        if (!scrollEnabled) return;
                        scrollViewRef?.current?.scrollToIndex({ index, animated: true });
                    }}
                />
            }
        />
    );
}

export default React.memo(CommentList, (p, n) => p.comments === n.comments)