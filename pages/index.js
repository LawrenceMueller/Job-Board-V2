import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import Search from '../components/Search';

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
      <div className={indexStyles.no_jobs}>
        <h3>No jobs are currently listed</h3>
        <br />
        <h3>Post one using the button above!</h3>
      </div>
    );
  }
}

export async function getStaticProps() {
  try {
    const res = await fetch('http://localhost:3000/api/searchJobListings');
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
