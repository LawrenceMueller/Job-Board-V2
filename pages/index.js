import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Search from '../components/Search';
import Head from 'next/head';

import indexStyles from '../styles/Index.module.css';

export default function Home({ data }) {
  const [jobs, setJobs] = useState([]);
  const [searchedJobs, setSearchedJobs] = useState(null);

  useEffect(() => {
    setJobs(data);
  }, [jobs, data]);

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
        <main className={indexStyles.job_card__container}>
          {searchedJobs === null
            ? jobs.map((job) => (
                <JobCard individualJob={job} key={job.pageId} />
              ))
            : searchedJobs.map((job) => (
                <JobCard individualJob={job} key={job.pageId} />
              ))}
        </main>
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
    const devOrProd =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/api/searchJobListings`
        : `https://www.consolejob/api/searchJobListings`;

    const res = await fetch(devOrProd);
    let data = await res.json();

    // Need to take the response and format it for mapping over
    data = Object.entries(data)[0][1];

    if (!data) {
      return {
        notFound: true,
      };
    }

    return {
      props: { data }, // will be passed to the page component as props
    };
  } catch (error) {
    console.log(
      'error thrown in the getStaticProps function in the index.js file'
    );
    console.log('here is the trace');
    console.error(error);
  }
}
