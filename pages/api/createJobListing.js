import { createJobListing } from '../../lib/redis';

export default async function handler(req, res) {
  const id = await createJobListing(req.body);
  res.status(200).json({ id });
}
