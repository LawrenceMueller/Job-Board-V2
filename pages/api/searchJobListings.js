import { searchJobs } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'GET') {
    try {
      const jobs = await searchJobs(req);
      jobs === 'error'
        ? res.status(500).json({ msg: 'Failed getting jobs from db' })
        : res.status(200).json({ jobs });
    } catch (error) {
      console.log('Error with calling the search method');
      console.log('Here is the trace');
      console.error(error);
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
