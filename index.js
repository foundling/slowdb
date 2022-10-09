// store value under key. value can be valid json.
// update db.table set name = 'alex' where id = 1;
// insert into db.table values 

const { appendFile, read, writeFile, readFile } = require('node:fs/promises');

class Database {

    constructor({ filename }) {
        this._store_path = filename; 
    }

    parseRecord(line) {

        const [ key, ...valueParts ] = line.trim().split(',');
        const value = valueParts.join(',');

        return [ key, value ]; 
    }
 
    parseRecords(content) {
        return content.split('\n').filter(line => line.trim()).map(this.parseRecord); 
    }

    toLogEntry(record) {
        const [k, v] = record;
        return `${k},${v}\n`
    }

    async bulkSet(records) {
    }

    async set(key, value) {

        const serialized = JSON.stringify(value);
        const record = `${key},${serialized}\n`;

        await appendFile(this._store_path, record, 'utf8');
        await this.compact();
    }

    async get(key) {

        const content = await readFile(this._store_path, 'utf8');
        const records = this.parseRecords(content);

        const matchingRecords = records.filter(([k, v]) => k === key.toString());
        const matchingValues = matchingRecords.map(([k,v]) => v);
        const lastMatchingValue = matchingValues.slice(-1)[0];

        return JSON.parse(lastMatchingValue);

    }

    async compact() { 

        console.log('compacting ...')
        const content = await readFile(this._store_path, 'utf8');
        const records = this.parseRecords(content);

        // latest value wins
        const deduped = Object.values(
            records.reduce((memo, record) => {

                const [k] = record;
                const logLine = this.toLogEntry(record);
                memo[k] = logLine;

                return memo;
            }, {})
        );

        await writeFile(this._store_path, deduped, 'utf8');

    }

}

module.exports = { Database }
