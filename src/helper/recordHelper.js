export const attachModuleIdToRecords = (id, records) => {
    console.log('attach')
    console.log(records)
    for (const record of records) {
        console.log(record)
        if (record.id !== null && record.id !== undefined) {
            record.id = `${id}x${record.id}`;
        }
    }

    console.log('returning:')
    console.log(records)
    return records;
}