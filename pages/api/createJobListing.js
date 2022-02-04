import { createJobListing } from '../../lib/redis';

export default async function handler(req, res) {
  try {
    const response = await createJobListing(req.body);
    response === 'error'
      ? res.status(500).json({ msg: 'Failed to Create listing' })
      : res.status(200).json({ msg: 'Successfully created listing' });
  } catch (error) {
    console.log('Error with calling the post job listing function');
    console.log('Here is the trace');
    console.error(error);
  }
}
