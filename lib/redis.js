import { Client, Entity, Schema, Repository } from 'redis-om';
import fetch from 'node-fetch';
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

export async function createJobListing(userInputedData) {
  let errorFlag = false; // This flag is set to true if something went wrong and the job listing wiill not be made correctly

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

  try {
    await connect(); // Connect to db

    const repository = new Repository(schema, client); // Create the repository instance

    console.log(userInputedData);

    const jobListing = repository.createEntity(userInputedData); // Create a new jobListing using the data from the front end

    // TODO: Process Payment

    await repository.save(jobListing); // Get the id of the newly saved db entry

    return 'success';
  } catch (error) {
    console.log('Error in the create job listing function');
    console.log('Here is the trace');
    console.error(error);
    errorFlag = true;
  }

  if (errorFlag) {
    return 'error';
  }
}

export async function searchJobs(req) {
  const {
    title,
    address,
    experience,
    telecommute,
    positionType,
    salaryType,
    minimumSalary,
  } = req.body;

  let jobs;

  if (req.body) {
    // Fires off when the user actually searches using filters
    let lat;
    let lng;

    try {
      // Convert address given to lat and lng for geospatial searching
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          address +
          '&key=' +
          process.env.GOOGLE_GEO_API_KEY
      )
        .then((res) => res.json())
        .then((text) => {
          lat = text.results[0].geometry.location.lat;
          lng = text.results[0].geometry.location.lng;
        });

      await connect();

      const repository = new Repository(schema, client);

      console.log(req.body);
      console.log(lat);
      console.log(lng);

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

      if (minimumSalary !== null || isNaN(minimumSalary)) {
        jobs = jobs.filter((job) => {
          return job.minimumSalary <= minimumSalary;
        });
      }

      if (telecommute !== 'none') {
        jobs = jobs.filter((job) => {
          return job.telecommute === telecommute;
        });
      }

      jobs.forEach((job) => {
        job.entityData.removalId = 'Not Authorized';
        job.entityData.contactEmail = 'Not Authorized';
      });

      let sortedResults = [];

      jobs.forEach((job) => {
        sortedResults.push(job.entityData);
      });

      sortedResults.sort(sortByData);

      // If the user is not looking for remote jobs and they have entered an address, then do geospatial search
      if (telecommute !== 'remote' && address !== '') {
        sortedResults = sortByProximity(lat, lng, sortedResults);
      }

      return sortedResults;
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

      let sortedResults = [];

      jobs.forEach((job) => {
        sortedResults.push(job.entityData);
      });

      sortedResults.sort(sortByData);

      return sortedResults;
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
export function randomString(length, chars) {
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

// Util function that sorts job listings by data
function sortByData(a, b) {
  const jobA = a.postedTime;
  const jobB = b.postedTime;

  let comparison = 0;
  if (jobA < jobB) {
    comparison = 1;
  } else if (jobA > jobB) {
    comparison = -1;
  }
  return comparison;
}

// Util function that sorts job listings by proximity
function sortByProximity(lat, lng, jobs) {
  jobs.forEach((job) => {
    let R = 6371e3; // metres
    let φ1 = (lat * Math.PI) / 180; // φ, λ in radians
    let φ2 = (job.lat * Math.PI) / 180;
    let Δφ = ((job.lat - lat) * Math.PI) / 180;
    let Δλ = ((job.lng - lng) * Math.PI) / 180;

    let a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = R * c; // in metres

    job.distance = d;
  });

  jobs.sort(compareByProximity);

  return jobs;
}

// Util function for comparing distances of jobs
function compareByProximity(a, b) {
  const jobA = a.distance;
  const jobB = b.distance;

  let comparison = 0;
  if (jobA > jobB) {
    comparison = 1;
  } else if (jobA < jobB) {
    comparison = -1;
  }
  return comparison;
}
