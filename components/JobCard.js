import { useState } from 'react';
import { getCurrentDate } from '../functions/GetCurrentDate';
import LinkBtn from './LinkBtn';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { VscRemoteExplorer } from 'react-icons/vsc';
import { FaMoneyBill } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

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
          <p className={jobCardStyles.job_card__posted}>
            Posted:&nbsp;{getCurrentDate()}
          </p>
        </div>
        <div className={jobCardStyles.job_card__details}>
          <div>
            <p className={jobCardStyles.job_card__type}>
              <FaBookOpen />
              &nbsp;{individualJob.positionType}
            </p>
            <p className={jobCardStyles.job_card__salary}>
              <FaMoneyBill />
              &nbsp;${individualJob.minimumSalary}/{individualJob.salaryType}
            </p>
          </div>
          <div>
            <p className={jobCardStyles.job_card__location}>
              <FaMapMarkerAlt />
              {individualJob.address}
            </p>
            <p className={jobCardStyles.job_card__remote}>
              <VscRemoteExplorer />
              &nbsp;{individualJob.telecommute}&nbsp;
              {individualJob.telecommute === 'remote' ? (
                <FaCheckCircle />
              ) : null}
            </p>
          </div>
        </div>
      </div>
      <div className={expanded ? '' : jobCardStyles.invisible}>
        <p>
          <strong>Website:</strong>{' '}
          <span className='job-card__website'>
            {individualJob.companyWebsite}
          </span>
        </p>
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
