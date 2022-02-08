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
  // userInputedData.removalId = randomString(
  //   32,
  //   '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  // );
  // userInputedData.pageId = v4();

  try {
    await connect(); // Connect to db

    const repository = new Repository(schema, client); // Create the repository instance

    const jobListing = repository.createEntity(userInputedData); // Create a new jobListing using the data from the front end

    // TODO: Process Payment

    const id = await repository.save(jobListing); // Get the id of the newly saved db entry

    return id; // Return the id of the new entry
  } catch (error) {
    console.log('Error in the create job listing function');
    console.log('Here is the trace');
    console.error(error);
    return 'error';
  }
}

export async function searchJobs(req) {
  console.log(req.body);
  if (req.body) {
    // Fires off when the user actually searches using filters
    try {
      await connect();

      const repository = new Repository(schema, client);

      const jobs = await repository.search().return.all();

      return jobs;
    } catch (error) {
      console.log('Error in the search jobs function with parameters');
      console.log('Here is the trace');
      console.error(error);
    }
  } else {
    // Fires off when no search parameters are set, like on initial load of sight
    try {
      await connect();

      const repository = new Repository(schema, client);

      const jobs = await repository.search().return.all();

      return jobs;
    } catch (error) {
      console.log('Error in the search jobs function without parameters');
      console.log('Here is the trace');
      console.error(error);
    }
  }
}

export async function removeJob(removalId) {
  try {
    await connect();

    const repository = new Repository(schema, client);

    const listingToRemove = await repository
      .search()
      .where('removalId')
      .eq(removalId)
      .return.first();

    await repository.remove(listingToRemove.entityId);

    return 'success';
  } catch (error) {
    console.log('Error in the remove a job function');
    console.log('Here is the trace');
    console.error(error);
    return 'error';
  }
}

// Util function to create the random removal id for each job listing
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// Util funciton so that redis has an index for the current schema
export async function createIndex() {
  await connect();

  const repository = new Repository(schema, client);
  await repository.dropIndex();
  await repository.createIndex();
}
