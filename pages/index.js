import Search from '../components/Search';
import SortBy from '../components/SortBy';
import JobCard from '../components/JobCard';

import indexStyles from '../styles/Index.module.css';

import jobs from '../dummyData.json';

export default function Home({
  handleToggleUserApplicationScreen,
  handleSortByChange,
}) {
  return (
    <>
      <Search />
      <main className={indexStyles.job_card__container}>
        <SortBy handleSortByChange={handleSortByChange} />
        {jobs.map((job) => (
          <JobCard individualJob={job} key={job.jobId} />
        ))}
      </main>
    </>
  );
}
