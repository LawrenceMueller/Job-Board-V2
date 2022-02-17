import GeneralBtn from '../../../components/GeneralBtn';
import Link from 'next/link';

import jobDetailsStyles from '../../../styles/jobDetails.module.css';

// Getting job in props from getStaticProps
export default function JobPosting({ jobDetails }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('handle');
  };

  const handleApply = async (e) => {
    null;
  };

  const handleClear = async (e) => {
    console.log('clear');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={jobDetailsStyles.job_details__Container}
    >
      <div className={jobDetailsStyles.job_details__btn_container}>
        <GeneralBtn
          name='Apply!'
          btnFunction={handleApply}
          submitFlag={'Send'}
        />
        <GeneralBtn
          name='Clear'
          btnFunction={handleClear}
          submitFlag={'button'}
        />
        <Link href='/'>
          <a className={jobDetailsStyles.back_btn}>Back</a>
        </Link>
      </div>
    </form>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const jobId = params.id;

  const res = await fetch('http://localhost:3000/api/searchJobListings');
  let data = await res.json();
  data = data = Object.entries(data)[0][1];

  const job = data.filter((jobListing) => jobListing.pageId === jobId);

  return {
    props: {
      jobDetails: job,
    },
  };
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/searchJobListings');

  let data = await res.json();
  data = data = Object.entries(data)[0][1];

  const paths = data.map((job) => ({
    params: { id: job.pageId },
  }));

  return {
    paths,
    fallback: false,
  };
}
