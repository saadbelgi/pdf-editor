"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
console.log(__dirname);
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/models/*.{ts,js}'],
    logging: true,
    synchronize: true,
});
dataSource
    .initialize()
    .then(() => console.log('Datasource initialized'))
    .catch((error) => console.error('Error during Data Source initialization', error));
exports.default = dataSource;
