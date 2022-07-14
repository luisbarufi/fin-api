import "dotenv/config";
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host: "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, { 
      host: process.env.NODE_ENV === "test" ? process.env.HOST : host,
      database: process.env.NODE_ENV === "test" 
        ? "fin_api_test"
        : defaultOptions.database,
    })
  );
};
