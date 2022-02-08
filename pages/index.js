import { useState } from 'react';
import Search from '../components/Search';
import JobCard from '../components/JobCard';

import indexStyles from '../styles/Index.module.css';

// import jobs from '../dummyData.json';

export default function Home({ data }) {
  const [jobs, setJobs] = useState(data);

  if (jobs.length !== 0) {
    return (
      <>
        <Search />
        <main className={indexStyles.job_card__container}>
          {jobs.map((job) => (
            <JobCard individualJob={job} key={job.entityId} />
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

export async function getStaticProps(context) {
  const res = await fetch('http://localhost:3000/api/searchJobListings');
  let data = await res.json();

  // Need to take the json and format into a simple form
  data = Object.entries(data)[0][1];

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data }, // will be passed to the page component as props
  };
}
