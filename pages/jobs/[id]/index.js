import GeneralBtn from '../../../components/GeneralBtn';
import Link from 'next/link';
import { getCurrentDate } from '../../../functions/GetCurrentDate';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { VscRemoteExplorer } from 'react-icons/vsc';
import { FaMoneyBill } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

import jobDetailsStyles from '../../../styles/jobDetails.module.css';
import jobCardStyles from '../../../styles/JobCard.module.css';

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
      <article className={jobDetailsStyles.job_card__card_application}>
        <div className={jobCardStyles.job_card__information}>
          <div className={jobCardStyles.job_card__at_a_glance}>
            <p className={jobCardStyles.job_card__company}>
              {jobDetails[0].companyName}
            </p>
            <h3 className={jobCardStyles.job_card__title}>
              {jobDetails[0].title}
            </h3>
            <p className={jobCardStyles.job_card__posted}>
              Posted:&nbsp;{getCurrentDate()}
            </p>
          </div>
          <div className={jobCardStyles.job_card__details}>
            <div>
              <p className={jobCardStyles.job_card__type}>
                <FaBookOpen />
                &nbsp;{jobDetails[0].positionType}
              </p>
              <p className={jobCardStyles.job_card__salary}>
                <FaMoneyBill />
                &nbsp;${jobDetails[0].minimumSalary}/{jobDetails[0].salaryType}
              </p>
            </div>
            <div>
              <p className={jobCardStyles.job_card__location}>
                <FaMapMarkerAlt />
                {jobDetails[0].address}
              </p>
              <p className={jobCardStyles.job_card__remote}>
                <VscRemoteExplorer />
                &nbsp;{jobDetails[0].telecommute}&nbsp;
                {jobDetails[0].telecommute === 'remote' ? (
                  <FaCheckCircle />
                ) : null}
              </p>
            </div>
          </div>
        </div>
        <div>
          <p>
            Website:{' '}
            <span className={jobCardStyles.job_card__website}>
              {jobDetails[0].website}
            </span>
          </p>
          <div
            className={jobCardStyles.job_card__description}
            dangerouslySetInnerHTML={{ __html: jobDetails[0].description }}
          />
        </div>
      </article>
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
