import { useState } from 'react';
import GeneralBtn from '../../../components/GeneralBtn';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { VscRemoteExplorer } from 'react-icons/vsc';
import { FaMoneyBill } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { timeDifference } from '../../../functions/timeDifference';
import { FaCreativeCommonsShare } from 'react-icons/fa';

import jobDetailsStyles from '../../../styles/jobDetails.module.css';
import jobCardStyles from '../../../styles/JobCard.module.css';

// Getting job in props from getStaticProps
export default function JobPosting({ jobDetails }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

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
      {console.log(jobDetails[0])}
      <article className={jobDetailsStyles.job_card__card_application}>
        <div className={jobCardStyles.job_card__information}>
          <div className={jobCardStyles.job_card__at_a_glance}>
            <p className={jobCardStyles.job_card__company}>
              {jobDetails[0].companyName}
            </p>
            <h3 className={jobCardStyles.job_card__title}>
              {jobDetails[0].title}
            </h3>
            <p className={jobCardStyles.job_card__mb_half_em}>
              Posted:&nbsp;{timeDifference(jobDetails[0].postedTime)}
            </p>
            <p className={jobCardStyles.job_card__mb_half_em}>
              <FaMapMarkerAlt /> {jobDetails[0].state}
              {', '} {jobDetails[0].city}
            </p>
          </div>
          <div className={jobCardStyles.job_card__details}>
            <div>
              <p className={jobCardStyles.job_card__type}>
                <FaCreativeCommonsShare />
                &nbsp;{jobDetails[0].positionType}
              </p>
              <p className={jobCardStyles.job_card__salary}>
                <FaMoneyBill />
                &nbsp;${jobDetails[0].minimumSalary}/{jobDetails[0].salaryType}
              </p>
            </div>
            <div>
              <p className={jobCardStyles.job_card__experience}>
                <FaBookOpen />{' '}
                {jobDetails[0].experience === 'none'
                  ? 'NP'
                  : jobDetails[0].experience}
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
            <span className='job-card__website'>
              {jobDetails[0].companyWebsite === ''
                ? 'NP'
                : jobDetails[0].companyWebsite}
            </span>
          </p>
          <div
            className={jobCardStyles.job_card__description}
            dangerouslySetInnerHTML={{ __html: jobDetails[0].description }}
          />
        </div>
      </article>
      <label
        htmlFor='candidateFirstName'
        className={jobDetailsStyles.job_details__label}
      >
        First Name <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        name='candidateFirstName'
        className={jobDetailsStyles.job_details__text_input}
        placeholder='First Name'
        type='text'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <label
        htmlFor='candidateLastName'
        className={jobDetailsStyles.job_details__label}
      >
        Last Name <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        name='candidateLastName'
        className={jobDetailsStyles.job_details__text_input}
        placeholder='Last Name'
        type='text'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <label
        htmlFor='candidateEmail'
        className={jobDetailsStyles.job_details__label}
      >
        Email <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        name='candidateEmail'
        className={jobDetailsStyles.job_details__text_input}
        placeholder='Email'
        type='text'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label
        htmlFor='candidatePhone'
        className={jobDetailsStyles.job_details__label}
      >
        Phone <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        name='candidatePhone'
        className={jobDetailsStyles.job_details__text_input}
        placeholder='(xxx) xxx-xxxx'
        type='text'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <label
        htmlFor='candidateResume'
        className={jobDetailsStyles.job_details__label}
      >
        Resume <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        name='candidateResume'
        type='file'
        value={resume}
        onChange={(e) => setResume(e.target.files[0])}
      />
      <label
        htmlFor='candidateCoverLetter'
        className={jobDetailsStyles.job_details__label}
      >
        Cover Letter
      </label>
      <input
        name='candidateCoverLetter'
        type='file'
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.files[0])}
      />
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
