import {
    fetchComments,
    deleteRecord,
    saveRecord,
    describe
} from '../helper/api';
import store from '../store';

const GET_ENABLED_MODULES_FULFILLED = 'comments/GET_ENABLED_MODULES_FULFILLED';

const FETCH_COMMENTS = 'comments/FETCH_COMMENTS';
const FETCH_COMMENTS_FULFILLED = 'comments/FETCH_COMMENTS_FULFILLED';
const FETCH_COMMENTS_REJECTED = 'comments/FETCH_COMMENTS_REJECTED';

const DELETE_COMMENT = 'comments/DELETE_COMMENT';
const DELETE_COMMENT_FULFILLED = 'comments/DELETE_COMMENT_FULFILLED';
const DELETE_COMMENT_REJECTED = 'comments/DELETE_COMMENT_REJECTED'

const ADD_COMMENT = 'comments/ADD_COMMENT';
const ADD_COMMENT_FULFILLED = 'comments/ADD_COMMENT_FULFILLED';
const ADD_COMMENT_REJECTED = 'comments/ADD_COMMENT_REJECTED';

const SET_REPLY_TO = 'comments/SET_REPLY_TO';
const SET_EDIT = 'comments/SET_EDIT';

const initialState = {
    comments: [],
    enabledModules: [],
    isLoading: true,
    commentsLoading: [],
    isAddingComment: false,
    replyTo: null,
    editedComment: null
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_ENABLED_MODULES_FULFILLED: {
            return { ...state, enabledModules: action.payload }
        }

        case FETCH_COMMENTS:
            return {
                ...(action.payload ? state : initialState),
                enabledModules: state.enabledModules,
                isLoading: true
            }

        case FETCH_COMMENTS_FULFILLED:
            return {
                ...state,
                comments: action.payload,
                isLoading: false
            }

        case FETCH_COMMENTS_REJECTED:
            return {
                ...state,
                isLoading: false
            }

        case DELETE_COMMENT:
            return {
                ...state,
                commentsLoading: [
                    ...state.commentsLoading,
                    action.payload
                ]
            }

        case DELETE_COMMENT_FULFILLED: {
            const commentId = action.payload;

            // Remove commentId from commentsLoading
            const commentsLoadingClone = JSON.parse(JSON.stringify(state.commentsLoading));
            const index = commentsLoadingClone.indexOf(commentId);
            if (index !== -1) commentsLoadingClone.splice(index, 1)

            // Remove comment from comments
            let commentIndex = -1;
            let i = 0;
            const commentsClone = JSON.parse(JSON.stringify(state.comments));

            for (const comment of commentsClone) {
                if (comment.id === '31x' + commentId) {
                    commentIndex = i;
                    break;
                }

                i++;
            }

            if (commentIndex !== -1) commentsClone.splice(commentIndex, 1)

            return {
                ...state,
                comments: commentsClone,
                commentsLoading: commentsLoadingClone
            }
        }

        case DELETE_COMMENT_REJECTED: {
            const commentId = action.payload;

            // Remove commentId from commentsLoading
            const commentsLoadingClone = JSON.parse(JSON.stringify(state.commentsLoading));
            const index = commentsLoadingClone.indexOf(commentId);
            if (index !== -1) commentsLoadingClone.splice(index, 1)

            return {
                ...state,
                commentsLoading: commentsLoadingClone
            }
        }

        case ADD_COMMENT: {
            const commentsLoadingClone = JSON.parse(JSON.stringify(state.commentsLoading))
            if (action.payload) commentsLoadingClone.push(action.payload.toString().replace(/.*(?=x)+x/, ''))

            return {
                ...state,
                isAddingComment: true,
                commentsLoading: commentsLoadingClone
            }
        }

        case ADD_COMMENT_FULFILLED: {
            return { ...state, isAddingComment: false, commentsLoading: [] }
        }

        case ADD_COMMENT_REJECTED: {
            return { ...state, isAddingComment: false, commentsLoading: [] }
        }

        case SET_REPLY_TO: {
            return {
                ...state,
                replyTo: action.payload,
                editedComment: null
            }
        }

        case SET_EDIT: {
            return {
                ...state,
                replyTo: null,
                editedComment: action.payload
            }
        }

        default:
            return state;
    }
}

export const getEnabledModules = () => async (dispatch) => {
    const getEnabledModulesFulfilled = (payload) => {
        return ({
            type: GET_ENABLED_MODULES_FULFILLED,
            payload
        })
    }

    try {
        const describeResponse = await describe('ModComments');
        if (!describeResponse.success) throw Error(`Failed to fetch enabled modules for ModComments`);

        let modules = null;

        for (const field of describeResponse.result.describe.fields) {
            if (field.name === 'related_to') modules = field.type.refersTo;
        }

        if (!modules) throw Error(`Could not find modules enabled for ModComments`);

        dispatch(getEnabledModulesFulfilled(modules))

    } catch (e) {
        console.log(e);
    }
}

export const getComments = (recordId, keepState) => async (dispatch) => {
    const fetchCommentsFulfilled = (payload) => {
        return ({
            type: FETCH_COMMENTS_FULFILLED,
            payload
        })
    };

    const fetchCommentsRejected = () => {
        return ({
            type: FETCH_COMMENTS_REJECTED
        })
    };

    dispatch({
        type: FETCH_COMMENTS,
        payload: keepState
    });

    try {
        const commentsResponse = await fetchComments(recordId);
        if (!commentsResponse.success) throw Error(`Failed to fetch comments for ${recordId}`);

        const new_comments = changeCommentStructure(commentsResponse.result.records);
        dispatch(fetchCommentsFulfilled(new_comments));
    } catch (e) {
        console.log(e);
        dispatch(fetchCommentsRejected());
    }
};

const changeCommentStructure = (comments) => {
    let new_comments = [];
    for (const comment of comments) {
        //create new record with new structure
        let new_comment = {};
        for (const block of comment.blocks) {
            for (const field of block.fields) {
                new_comment[field.name] = field.value;
            }
        }
        new_comment['id'] = comment.id;
        new_comment['downloadData'] = comment.downloadData;
        //push to array
        new_comments.push(new_comment);
    }
    return new_comments;
};

export const deleteComment = (commentId) => async (dispatch) => {
    const deleteCommentFulfilled = () => {
        return ({
            type: DELETE_COMMENT_FULFILLED,
            payload: commentId
        })
    }

    const deleteCommentRejected = () => {
        return ({
            type: DELETE_COMMENT_REJECTED,
            payload: commentId
        })
    }

    dispatch({
        type: DELETE_COMMENT,
        payload: commentId
    });

    try {
        const deleteCommentResponse = await deleteRecord('ModComments', commentId);
        if (!deleteCommentResponse.success) throw Error(`Failed to delete comment: ${recordId}`);

        dispatch(deleteCommentFulfilled());
    } catch (e) {
        console.log(e);
        dispatch(deleteCommentRejected());
    }
}

export const addComment = (relatedTo, parentCommentId, recordId, content) => async (dispatch) => {
    const addCommentFulfilled = () => {
        return ({
            type: ADD_COMMENT_FULFILLED,
            payload: (recordId) ? recordId : undefined
        });
    }

    const addCommentRejected = () => {
        return ({
            type: ADD_COMMENT_REJECTED,
            payload: (recordId) ? recordId : undefined
        });
    }

    dispatch({
        type: ADD_COMMENT,
        payload: (recordId) ? recordId : undefined
    });

    try {
        const { auth: { loginDetails: { userId } } } = store.getState();
        const saveCommentResponse = await saveRecord(
            'ModComments',
            {
                "related_to": relatedTo,
                "commentcontent": content,
                "is_private": 0,
                "assigned_user_id": '19x'+userId,
                "parent_comments": (parentCommentId) ? parentCommentId : undefined
            },
            recordId
        );
        if (!saveCommentResponse.success) throw Error(`Failed to submit comment.`);
        await dispatch(getComments(relatedTo, true));
        dispatch(addCommentFulfilled());
    } catch (e) {
        console.log(e);
        dispatch(addCommentRejected());
    }
}

export const setReplyTo = (payload) => (dispatch) => {
    dispatch({
        type: SET_REPLY_TO,
        payload
    })
}

export const setEdit = (payload) => (dispatch) => {
    dispatch({
        type: SET_EDIT,
        payload
    })
}