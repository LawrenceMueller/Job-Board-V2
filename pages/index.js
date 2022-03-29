import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JobCard from '../components/JobCard';
import Search from '../components/Search';
import Head from 'next/head';
import { timeDifference } from '../functions/timeDifference';

import indexStyles from '../styles/Index.module.css';

import { Client, Entity, Schema, Repository } from 'redis-om';

export default function Home({ sortedResults }) {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [searchedJobs, setSearchedJobs] = useState(null);

  useEffect(() => {
    setJobs(sortedResults);

    if (router.asPath === '/?success=true') {
      setSearchedJobs(null);
    }
  }, [jobs, sortedResults]);

  const handleJobSearch = (jobsReturned) => {
    setSearchedJobs(jobsReturned);
  };

  if (jobs.length !== 0) {
    return (
      <>
        <Head>
          <title>
            Console.job | The best job board for software developers!
          </title>
        </Head>
        <Search handleJobSearch={handleJobSearch} />
        {searchedJobs !== null && Object.keys(searchedJobs).length === 0 ? (
          <div className={indexStyles.no_jobs}>
            <h3>No results found</h3>
          </div>
        ) : (
          <main className={indexStyles.job_card__container}>
            {searchedJobs === null
              ? jobs.map((job) => (
                  <JobCard individualJob={job} key={job.pageId} />
                ))
              : searchedJobs.map((job) => (
                  <JobCard individualJob={job} key={job.pageId} />
                ))}
          </main>
        )}
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>
            Console.job | The best job board for software developers!
          </title>
        </Head>
        <div className={indexStyles.no_jobs}>
          <h3>No jobs are currently listed</h3>
          <br />
          <h3>Post one using the button above!</h3>
        </div>
      </>
    );
  }
}

export async function getStaticProps() {
  try {
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

    // Util function that sorts job listings by data
    function sortByData(a, b) {
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

    if (!sortedResults) {
      return {
        notFound: true,
      };
    }

    return {
      props: { sortedResults }, // will be passed to the page component as props
      revalidate: 5, // in seconds, in order to show newly posted jobs
    };
  } catch (error) {
    console.log('error thrown in the getStaticProps function of home page');
    console.log('here is the trace');
    console.error(error);
  }
}
