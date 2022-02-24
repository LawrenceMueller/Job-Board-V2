import { Client, Entity, Schema, Repository } from 'redis-om';
import { v4 } from 'uuid';

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
}

// Schema for job listings
class JobListing extends Entity {}
let schema = new Schema(
  JobListing,
  {
    pageId: { type: 'string' },
    removalId: { type: 'string' },
    title: { type: 'string', textSearch: true },
    companyName: { type: 'string' },
    contactEmail: { type: 'string' },
    address: { type: 'string', textSearch: true },
    experience: { type: 'string' },
    telecommute: { type: 'string' },
    positionType: { type: 'string' },
    salaryType: { type: 'string' },
    minimumSalary: { type: 'number' },
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
  userInputedData.removalId = randomString(
    32,
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  );
  userInputedData.pageId = v4();

  try {
    await connect(); // Connect to db

    const repository = new Repository(schema, client); // Create the repository instance

    const jobListing = repository.createEntity(userInputedData); // Create a new jobListing using the data from the front end

    // TODO: Process Payment

    await repository.save(jobListing); // Get the id of the newly saved db entry

    return 'success';
  } catch (error) {
    console.log('Error in the create job listing function');
    console.log('Here is the trace');
    console.error(error);
    return 'error';
  }
}

export async function searchJobs(req) {
  const {
    title,
    experience,
    telecommute,
    positionType,
    salaryType,
    minimumSalary,
  } = req.body;

  let jobs;

  if (req.body) {
    // Fires off when the user actually searches using filters
    try {
      await connect();

      const repository = new Repository(schema, client);

      if (title !== '') {
        jobs = await repository
          .search()
          .where('title')
          .matches(title)
          .return.all();
      } else {
        jobs = await repository.search().return.all();
      }

      if (experience !== 'none') {
        jobs = jobs.filter((job) => {
          return job.experience === experience;
        });
      }

      if (telecommute !== 'none') {
        jobs = jobs.filter((job) => {
          return job.telecommute === telecommute;
        });
      }

      if (positionType !== 'none') {
        jobs = jobs.filter((job) => {
          return job.positionType === positionType;
        });
      }

      if (salaryType !== 'none') {
        jobs = jobs.filter((job) => {
          return job.salaryType === salaryType;
        });
      }

      if (minimumSalary !== null) {
        jobs = jobs.filter((job) => {
          return job.minimumSalary === minimumSalary;
        });
      }

      jobs.forEach((job) => {
        console.log(job.entityData.removalId);
        job.entityData.removalId = 'Not Authorized';
        job.entityData.contactEmail = 'Not Authorized';
      });

      return jobs;
    } catch (error) {
      console.log('Error in the search jobs function with parameters');
      console.log('Here is the trace');
      console.error(error);
    }
  } else {
    // Fires off when no search parameters are set, like on initial load of site
    try {
      await connect();

      const repository = new Repository(schema, client);

      let jobs = await repository.search().return.all();

      jobs.forEach((job) => {
        job.entityData.removalId = 'Not Authorized';
        job.entityData.contactEmail = 'Not Authorized';
      });

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
