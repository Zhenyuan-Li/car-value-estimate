import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  // move up one directory, and delete the file called sqlite
  await rm(join(__dirname, '..', 'test.sqlite'));
});

global.afterEach(async () => {
  // close the connection to db
  const conn = await getConnection();
  await conn.close();
});
