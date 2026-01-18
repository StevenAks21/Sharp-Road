const fs = require("fs");

beforeAll(() => {
    if (process.env.DB_FILE && fs.existsSync(process.env.DB_FILE)) {
    fs.unlinkSync(process.env.DB_FILE);
    }
});