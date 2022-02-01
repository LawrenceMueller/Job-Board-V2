import { searchJobs } from '../../lib/redis';

export default async function handler(req, res) {
  const jobs = await searchJobs();
  res.status(200).json({ jobs });
}
