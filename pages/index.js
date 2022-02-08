import Search from '../components/Search';
import JobCard from '../components/JobCard';

import indexStyles from '../styles/Index.module.css';

// import jobs from '../dummyData.json';

export default function Home({ data }) {
  const search = async () => {
    const res = await fetch('../api/searchJobListings');
    const results = await res.json();
    console.log(results);

    setJobs(results);
  };

  return (
    <>
      <Search />
      {console.log(Object.entries(data)[0][1].length)}
      <main className={indexStyles.job_card__container}>
        {Object.entries(data)[0][1].map((job) => (
          <JobCard individualJob={job} key={job.entityId} />
        ))}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  const res = await fetch('http://localhost:3000/api/searchJobListings');
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data }, // will be passed to the page component as props
  };
}
