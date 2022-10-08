const { Database } = require('./index.js'); 

const db = new Database({ filename: 'store.db' });
const records = [
    {
        firstName: "Pramilla",
        lastName: "James",
        userId: "pjames",
        startDate: "02/01/08"
    },
    {
        firstName: "Alex",
        lastName: "Ramsdell",
        userId: "pjames",
        startDate: "02/01/08"
    }
]; 

async function main() {
    await db.set(1, records[0]); 
    await db.set(2, records[1]); 
    await db.set(1, records[0]); 
    await db.set(2, records[1]); 
}

main()
