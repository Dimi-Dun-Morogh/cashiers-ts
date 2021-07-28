import { ConnectDb } from './db';

ConnectDb().then((connection) => connection.end());
