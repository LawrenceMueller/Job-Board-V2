import { createJobListing } from '../../lib/redis';

export default async function handler(req, res) {
  try {
    const response = await createJobListing(req.body);
    response === 'error' ? res.status(500) : res.status(200);
  } catch (error) {
    console.log('Error with calling the post job listing function');
    console.log('Here is the trace');
    console.error(error);
  }
}
