import { removeJob } from '../../lib/redis';

export default async function handler(req, res) {
  try {
    const { removalId } = req.body;
    const response = await removeJob(removalId);
    response === 'error'
      ? res.status(500).json({ msg: 'Failed to delete listing' })
      : res.status(200).json({ msg: 'Successfully deleted listing' });
  } catch (error) {
    console.log('Error with calling the remove post method');
    console.log('Here is the trace');
    console.error(error);
  }
}
