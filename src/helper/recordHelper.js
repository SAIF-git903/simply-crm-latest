export const attachModuleIdToRecords = (id, records) => {
    for (const record of records) {
        if (record.id !== null && record.id !== undefined) {
            record.id = `${id}x${record.id}`;
        }
    }
    return records;
};