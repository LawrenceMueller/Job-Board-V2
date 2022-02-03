import { removeJob } from '../../lib/redis';

export default async function handler(req, res) {
  const { removalId } = req.body;
  const response = await removeJob(removalId).then(() => {
    res.status(200);
  });
  res.status(200).json({ msg: 'success' });
}
