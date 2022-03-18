import { Client, Entity, Schema, Repository } from 'redis-om';

export default async function handler(req, res) {
  // Initialize Redis
  const client = new Client();

  async function connect() {
    if (!client.isOpen()) {
      await client.open(process.env.REDIS_URL);
    }
  }

  class JobListing extends Entity {}
  let schema = new Schema(
    JobListing,
    {
      pageId: { type: 'string' },
      removalId: { type: 'string' },
      title: { type: 'string', textSearch: true },
      companyName: { type: 'string' },
      contactEmail: { type: 'string' },
      country: { type: 'string' },
      state: { type: 'string' },
      city: { type: 'string' },
      zip: { type: 'string' },
      lat: { type: 'number' },
      lng: { type: 'number' },
      experience: { type: 'string' },
      telecommute: { type: 'string' },
      positionType: { type: 'string' },
      salaryType: { type: 'string' },
      minimumSalary: { type: 'number' },
      emailForward: { type: 'string' },
      redirectURL: { type: 'string' },
      companyWebsite: { type: 'string' },
      description: { type: 'string', textSearch: true },
      postedTime: { type: 'string' },
      applied: { type: 'number' },
    },
    {
      dataStructure: 'JSON',
    }
  );

  const { removalId } = req.body;

  try {
    await connect();

    const repository = new Repository(schema, client);

    const listingToRemove = await repository
      .search()
      .where('removalId')
      .eq(removalId)
      .return.first();

    await repository.remove(listingToRemove.entityId);

    res.status(200).json({ msg: 'success' });
  } catch (error) {
    console.log('Error in the remove a job function');
    console.log('Here is the trace');
    console.error(error);
    res.status(500).json({ msg: 'Failed to remove job listing' });
  }
}
