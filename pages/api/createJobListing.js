import { Client, Entity, Schema, Repository } from 'redis-om';
import fetch from 'node-fetch';
import { v4 } from 'uuid';

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
    },
    {
      dataStructure: 'JSON',
    }
  );

  const userInputedData = req.body;

  try {
    // Convert address given to lat and lng for geospatial searching
    await fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        req.body.city +
        '+' +
        req.body.state +
        '+' +
        req.body.zip +
        '&key=' +
        process.env.GOOGLE_GEO_API_KEY
    )
      .then((res) => res.json())
      .then((text) => {
        req.body.lat = text.results[0].geometry.location.lat;
        req.body.lng = text.results[0].geometry.location.lng;
      });

    let errorFlag = false; // This flag is set to true if something went wrong and the job listing will not be made correctly

    // Create a unique removal id to allow users to remove listing later on
    userInputedData.removalId = randomString(
      32,
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    );

    // Create a unique page id, in order to navigate to a job details page
    userInputedData.pageId = v4();

    // Get the current date in order to provide information to users
    userInputedData.postedTime = new Date().toString();

    console.log(userInputedData);

    await connect(); // Connect to db

    const repository = new Repository(schema, client); // Create the repository instance

    console.log(userInputedData);

    const jobListing = repository.createEntity(userInputedData); // Create a new jobListing using the data from the front end

    // TODO: Process Payment

    await repository.save(jobListing); // Get the id of the newly saved db entry

    res.status(200).json({ msg: 'success' });
  } catch (error) {
    console.log('Error with the creating job listing function');
    console.log('Here is the trace');
    console.error(error);
  }
}

// Util function to create the random removal id for each job listing
export function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
