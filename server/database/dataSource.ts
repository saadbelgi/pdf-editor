import { DataSource } from 'typeorm';
console.log(__dirname);
const dataSource = new DataSource({
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
  .catch((error) =>
    console.error('Error during Data Source initialization', error)
  );

export default dataSource;
