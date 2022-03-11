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
import Head from 'next/head';
import validateEmail from '../../../functions/validateEmail';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import jobDetailsStyles from '../../../styles/jobDetails.module.css';
import jobCardStyles from '../../../styles/JobCard.module.css';

// Getting job in props from getStaticProps
export default function JobPosting({ jobDetails }) {
  const badNotify = (msg) => toast.error(msg);
  const goodNotify = (msg) => toast.success(msg);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState();
  const [coverLetter, setCoverLetter] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (firstName === '') {
      badNotify('Missing First Name');
    } else if (lastName === '') {
      badNotify('Missing Last Name');
    } else if (email === '' || (email !== '' && !validateEmail(email))) {
      badNotify('Missing Email or Email Provided is not valid');
    } else if (phone === '') {
      badNotify('Missing Phone Number or Phone Number Provided is not valid');
    } else if (!resume) {
      badNotify('Missing Resume');
    } else {
      try {
        const data = {};

        Array.from(e.currentTarget.elements).forEach((field) => {
          if (!field.name) return;
          data[field.name] = field.value;
        });

        data.position = jobDetails[0].title;

        // // Append Files
        // data.resume = resume;
        // coverLetter ? (data.coverLetter = coverLetter) : null;

        const res = await fetch('http://localhost:3000/api/applyForJob', {
          method: 'post',
          body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log(result);
      } catch (error) {
        console.log('Error with sending the POST request');
        console.log('Here is the trace');
        console.error(error);
      }
    }
  };

  const handleApply = async (e) => {
    null;
  };

  const handleClear = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setResume();
    setCoverLetter();
  };

  return (
    <>
      <ToastContainer />
      <Head>
        <title>Console.job | {jobDetails[0].title}</title>
      </Head>
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
              <p className={jobCardStyles.job_card__mb_15_px}>
                Posted:&nbsp;{timeDifference(jobDetails[0].postedTime)}
              </p>
              <p className={jobCardStyles.job_card__mb_15_px}>
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
                  &nbsp;${jobDetails[0].minimumSalary}/
                  {jobDetails[0].salaryType}
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
              <strong className={jobCardStyles.job_card__website}>
                Website:
              </strong>{' '}
              <span>
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
          type='file'
          name='candidateResume'
          onChange={(event) => {
            const file = event.target.files[0];
            setResume(file);
          }}
          accept='.pdf,.txt,.doc,.docx'
        />
        <label
          htmlFor='candidateCoverLetter'
          className={jobDetailsStyles.job_details__label}
        >
          Cover Letter
        </label>
        <input
          type='file'
          name='candidateCoverLetter'
          onChange={(event) => {
            const file = event.target.files[0];
            setCoverLetter(file);
          }}
          accept='.pdf,.txt,.doc,.docx'
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
    </>
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

// else if (
//   resume.type === 'application/pdf' ||
//   resume.type ===
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//   resume.type === 'text/plain' ||
//   resume.type === 'application/msword'
// ) {
//   badNotify('Resume must be one of these types: .pdf .txt .docx .doc');
// }
