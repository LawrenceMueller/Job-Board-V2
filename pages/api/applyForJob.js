import { applyForJob } from '../../lib/redis';

export default async function handler(req, res) {
  try {
    const response = await applyForJob(req);
    response === 'error'
      ? res.status(500).json({ msg: 'Failed to apply for position' })
      : res.status(200).json({ msg: 'success' });
  } catch (error) {
    console.log('Error with calling the method to apply for a position');
    console.log('Here is the trace');
    console.error(error);
  }
}
