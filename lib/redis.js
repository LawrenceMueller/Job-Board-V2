import { Client, Entity, Schema, Repository } from 'redis-om';
import { v4 } from 'uuid';

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
    companyName: { type: 'string', textSearch: true },
    contactEmail: { type: 'string' },
    address: { type: 'string', textSearch: true },
    experience: { type: 'string' },
    telecommute: { type: 'string' },
    positionType: { type: 'string' },
    salaryType: { type: 'string' },
    minimumSalary: { type: 'string' },
    emailForward: { type: 'string' },
    redirectURL: { type: 'string' },
    companyWebsite: { type: 'string' },
    description: { type: 'string', textSearch: true },
  },
  {
    dataStructure: 'JSON',
  }
);

export async function createJobListing(userInputedData) {
  await connect(); // Connect to db

  const repository = new Repository(schema, client); // Create the repository instance

  const jobListing = repository.createEntity(userInputedData); // Create a new jobListing using the data from the front end
  jobListing.removalId = v4();
  jobListing.pageId = randomString(
    32,
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  );

  // TODO: Process Payment

  await repository.save(jobListing); // Get the id of the newly saved db entry

  return id; // Return the id of the new entry
}

export async function searchJobs() {
  await connect();

  const repository = new Repository(schema, client);

  const jobs = await repository.search().return.all();

  return jobs;
}

export async function removeJob(removalId) {
  await connect();

  const repository = new Repository(schema, client);

  const listingToRemove = await repository.fetch(removalId);

  await repository.remove(listingToRemove.entityId);

  return 'success';
}

// Util function to create the random removal id for each job listing
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
