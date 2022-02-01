import Search from '../components/Search';
import JobCard from '../components/JobCard';

import indexStyles from '../styles/Index.module.css';

import jobs from '../dummyData.json';

export default function Home() {
  return (
    <>
      <Search />
      <main className={indexStyles.job_card__container}>
        {jobs.map((job) => (
          <JobCard individualJob={job} key={job.jobId} />
        ))}
      </main>
    </>
  );
}
