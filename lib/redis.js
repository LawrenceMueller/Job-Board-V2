import { Client, Entity, Schema, Repository } from 'redis-om';
import { timeDifference } from '../functions/timeDifference';

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
    applied: { type: 'number' },
  },
  {
    dataStructure: 'JSON',
  }
);

// Handles both with and without search filters
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
      if (address !== '') {
        // Convert address given to lat and lng for geospatial searching
        await fetch(
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
      }

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
          return job.minimumSalary >= minimumSalary;
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

      sortedResults.sort(sortByDate);

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

      sortedResults.sort(sortByDate);

      return sortedResults;
    } catch (error) {
      console.log('Error in the search jobs function without parameters');
      console.log('Here is the trace');
      console.error(error);
    }
  }
}

// Util funciton so that redis has an index for the current schema
export async function createIndex() {
  await connect();

  const repository = new Repository(schema, client);
  await repository.dropIndex();
  await repository.createIndex();
}

// Util function that sorts job listings by data
function sortByDate(a, b) {
  let jobA = timeDifference(a.postedTime);
  let jobB = timeDifference(b.postedTime);

  jobA = jobA.substring(0, jobA.length - 9);

  jobB = jobB.substring(0, jobB.length - 9);

  let comparison = 0;
  if (jobA > jobB) {
    comparison = 1;
  } else if (jobA < jobB) {
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
  //tretst
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
