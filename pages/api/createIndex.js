import { createIndex } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await createIndex();
    res.status(200).send('ok');
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
