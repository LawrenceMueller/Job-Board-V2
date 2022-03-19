import { timeDifference } from '../../functions/timeDifference';

export default async function handler(req, res) {
  console.log('here');
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

  try {
    await connect(); // Connect to db

    const repository = new Repository(schema, client); // Create the repository instance

    let oldListings = await repository
      .search()
      .where(timeDifference(postedTime))
      .is.greaterThan(60)
      .return.all();

    console.log(oldListings);
  } catch (error) {
    console.log('Error in the cron job function to remove old listings');
    console.log('Here is the trace');
    console.error(error);
    res.status(500).json({ msg: 'Failed to delete old jobs' });
  }
  res.status(200).send('ok');
}
