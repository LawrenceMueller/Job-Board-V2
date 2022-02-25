import { useState } from 'react';
import { getCurrentDate } from '../functions/GetCurrentDate';
import LinkBtn from './LinkBtn';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { VscRemoteExplorer } from 'react-icons/vsc';
import { FaMoneyBill } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCreativeCommonsShare } from 'react-icons/fa';

import jobCardStyles from '../styles/JobCard.module.css';

function JobCard({ individualJob }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandCard = () => setExpanded(!expanded);

  return (
    <article
      className={jobCardStyles.job_card__card}
      onClick={handleExpandCard}
    >
      <div className={jobCardStyles.job_card__information}>
        <div className={jobCardStyles.job_card__at_a_glance}>
          <p className={jobCardStyles.job_card__company}>
            {individualJob.companyName}
          </p>
          <h3 className={jobCardStyles.job_card__title}>
            {individualJob.title}
          </h3>
          <p style={{ marginBottom: '.5em' }}>
            Posted:&nbsp;{getCurrentDate()}
          </p>
          <FaMapMarkerAlt /> {individualJob.state}
          {', '} {individualJob.city}
        </div>
        <div className={jobCardStyles.job_card__details}>
          <div>
            <p className={jobCardStyles.job_card__type}>
              <FaCreativeCommonsShare />
              &nbsp;{individualJob.positionType}
            </p>
            <p className={jobCardStyles.job_card__salary}>
              <FaMoneyBill />
              &nbsp;$
              {individualJob.minimumSalary === ''
                ? 'NP'
                : individualJob.minimumSalary}
              /
              {individualJob.salaryType === 'none'
                ? 'NP'
                : individualJob.salaryType}
            </p>
          </div>
          <div>
            <p className={jobCardStyles.job_card__location}>
              <FaBookOpen />{' '}
              {individualJob.experience === 'none'
                ? 'NP'
                : individualJob.experience}
            </p>
            <p className={jobCardStyles.job_card__remote}>
              <VscRemoteExplorer />
              &nbsp;
              {individualJob.telecommute === 'none'
                ? 'NP'
                : individualJob.telecommute}
              &nbsp;
              {individualJob.telecommute === 'remote' ? (
                <FaCheckCircle />
              ) : null}
            </p>
          </div>
        </div>
      </div>
      <div className={expanded ? '' : jobCardStyles.invisible}>
        <strong>Website:</strong>{' '}
        <span className='job-card__website'>
          {individualJob.companyWebsite === ''
            ? 'NP'
            : individualJob.companyWebsite}
        </span>
        <div
          className={jobCardStyles.job_card__description}
          dangerouslySetInnerHTML={{ __html: individualJob.description }}
        />
        <LinkBtn
          name={'Apply'}
          width={'80%'}
          link={`http://localhost:3000/jobs/${individualJob.pageId}`}
        />
      </div>
    </article>
  );
}

export default JobCard;
