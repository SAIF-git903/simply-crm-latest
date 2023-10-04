import {Alert} from 'react-native';
import {
  API_listModuleRecords,
  API_fetchRecordsWithGrouping,
  API_deleteRecord,
} from '../helper/api';

const GET_CALENDAR_RECORDS = 'calendar/GET_CALENDAR_RECORDS';
const GET_CALENDAR_RECORDS_FULFILLED =
  'calendar/GET_CALENDAR_RECORDS_FULFILLED';
const GET_CALENDAR_RECORDS_REJECTED = 'calendar/GET_CALENDAR_RECORDS_REJECTED';

const DELETE_CALENDAR_RECORD = 'calendar/DELETE_CALENDAR_RECORD';
const DELETE_CALENDAR_RECORD_FULFILLED =
  'calendar/DELETE_CALENDAR_RECORD_FULFILLED';
const DELETE_CALENDAR_RECORD_REJECTED =
  'calendar/DELETE_CALENDAR_RECORD_REJECTED';

const initialState = {
  records: [],
  isLoading: false,
  isRefreshing: false,
  recordsLoading: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_CALENDAR_RECORDS:
      return {
        ...state,
        isLoading: true,
        isRefreshing: action.payload ? action.payload : state.isRefreshing,
      };
    case GET_CALENDAR_RECORDS_FULFILLED:
      return {
        ...state,
        records: action.payload,
        isLoading: false,
        isRefreshing: false,
      };
    case GET_CALENDAR_RECORDS_REJECTED:
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
      };
    case DELETE_CALENDAR_RECORD:
      return {
        ...state,
        recordsLoading: cloneArrayAndPush(state.recordsLoading, action.payload),
      };
    case DELETE_CALENDAR_RECORD_FULFILLED:
      let newRecords = JSON.parse(JSON.stringify(state.records));
      newRecords = newRecords.filter((x) => x.id !== action.payload);
      return {
        ...state,
        records: newRecords,
        recordsLoading: cloneArrayAndRemove(
          state.recordsLoading,
          action.payload,
        ),
      };
    case DELETE_CALENDAR_RECORD_REJECTED:
      return {
        ...state,
        recordsLoading: cloneArrayAndRemove(
          state.recordsLoading,
          action.payload,
        ),
      };
    default:
      return state;
  }
}

export const getCalendarRecords = (isRefreshing, page) => async (dispatch) => {
  const getCalendarRecordsFulfilled = (records) => {
    return {
      type: GET_CALENDAR_RECORDS_FULFILLED,
      payload: records,
    };
  };

  const getCalendarRecordsRejected = () => {
    return {
      type: GET_CALENDAR_RECORDS_REJECTED,
    };
  };

  dispatch({
    type: GET_CALENDAR_RECORDS,
    payload: isRefreshing,
  });

  try {
    const response = await API_listModuleRecords('Calendar', page);
    const calendarRecords = response.result?.records || [];

    let eventIds = [];
    let taskIds = [];

    for (const record of calendarRecords) {
      let ids = record.id.split('x');
      if (record.type === 'Event') {
        eventIds.push(ids[1]);
      } else {
        taskIds.push(ids[1]);
      }
    }

    eventIds = eventIds.map((x) => `18x${x}`);
    taskIds = taskIds.map((x) => `9x${x}`);

    let eventsResponse;
    let tasksResponse;

    if (eventIds?.length)
      eventsResponse = await API_fetchRecordsWithGrouping('Events', eventIds);
    if (taskIds?.length)
      tasksResponse = await API_fetchRecordsWithGrouping('Calendar', taskIds);

    const success = eventsResponse || tasksResponse;

    // if (!success) {
    //   dispatch(getCalendarRecordsRejected());
    //   return;
    // }

    const eventRecords = eventsResponse?.result.records?.map((x) => ({
      ...x,
      type: 'Event',
    }));

    const taskRecords = tasksResponse?.result.records?.map((x) => ({
      ...x,
      type: 'Task',
    }));

    let records = [
      ...(Array.isArray(eventRecords) ? eventRecords : []),
      ...(Array.isArray(taskRecords) ? taskRecords : []),
    ];
    let mappedRecords = [];

    // Fields that we filter out from the record
    const requiredFields = [
      'subject',
      'date_start',
      'time_start',
      'time_end',
      'taskstatus',
      'type',
      'id',
    ];

    for (let record of records) {
      const taskDetailsFields = record.blocks[0].fields;
      taskDetailsFields.push({name: 'type', value: record.type});
      taskDetailsFields.push({name: 'id', value: record.id});

      mappedRecords.push(
        taskDetailsFields.filter((x) => requiredFields.includes(x.name)),
      );
    }

    mappedRecords = mappedRecords.map((x) => {
      let item = {};
      for (const field of x) {
        item[field.name] = field.value;
      }
      return item;
    });

    dispatch(getCalendarRecordsFulfilled(mappedRecords));
  } catch (e) {
    console.log(e);
    dispatch(getCalendarRecordsRejected());
  }
};

export const deleteCalendarRecord = (recordId) => async (dispatch) => {
  const deleteCalendarRecordFulfilled = (recordId) => {
    return {
      type: DELETE_CALENDAR_RECORD_FULFILLED,
      payload: recordId,
    };
  };

  const deleteCalendarRecordRejected = (recordId) => {
    return {
      type: DELETE_CALENDAR_RECORD_REJECTED,
      payload: recordId,
    };
  };

  dispatch({
    type: DELETE_CALENDAR_RECORD,
    payload: recordId,
  });

  try {
    const recordIdClean = recordId.toString().replace(/.*(?=x)+x/, '');
    const response = await API_deleteRecord('Calendar', recordIdClean);
    if (!response.success) throw Error('Failed to delete record: ' + response);
    dispatch(deleteCalendarRecordFulfilled(recordId));
  } catch (e) {
    console.log(e);
    dispatch(deleteCalendarRecordRejected());
  }
};

// Utils
const cloneArrayAndPush = (array, item) => {
  const newArray = JSON.parse(JSON.stringify(array));
  newArray.push(item);
  return newArray;
};

const cloneArrayAndRemove = (array, item) => {
  const newArray = JSON.parse(JSON.stringify(array));
  const index = array.indexOf(item);

  if (index !== -1) {
    newArray.splice(index, 1);
  }

  return newArray;
};
