require('dotenv').config({});

import express, { Application, Request, Response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import { isEmpty } from 'lodash';

const corsOptions = {
  origin: 'https://twitter.com',
  methods: 'GET',
};

const app: Application = express();
app.use(cors(corsOptions));

const connection = mysql.createConnection(process.env.MYSQL!);
connection.connect();

app.get('/:handle', async (req: Request, res: Response) => {
  const handle = req.params.handle;

  console.log(req.params);

  // Search the database for the name associated with the handle
  connection.query(
    `
      SELECT name FROM twitter WHERE handle = '${handle}'
    `,
    (error, results, _) => {
      if (error) return res.status(500).end(error.message);
      if (isEmpty(results)) return res.status(404).end('Could not find name');
      return res.status(200).send({
        name: results[0].name,
      });
    },
  );
});

const PORT = 3000;
try {
  app.listen(PORT, (): void => {
    console.log(`[INFO] Started on *::${PORT}`);
  });
} catch (error) {
  console.error(error);
}
