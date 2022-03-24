import { useState } from 'react';
import LinkBtn from './LinkBtn';
import { VscRemoteExplorer } from 'react-icons/vsc';
import { timeDifference } from '../functions/timeDifference';
import {
  FaMapMarkerAlt,
  FaBookOpen,
  FaMoneyBill,
  FaCheckCircle,
  FaCreativeCommonsShare,
} from 'react-icons/fa';

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
          <p className={jobCardStyles.job_card__mb_15_px}>
            Posted:&nbsp;{timeDifference(individualJob.postedTime)}
          </p>
          <p className={jobCardStyles.job_card__mb_15_px}>
            <FaMapMarkerAlt /> {individualJob.state}
            {', '} {individualJob.city}
          </p>
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
            <p className={jobCardStyles.job_card__experience}>
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
        <strong className={jobCardStyles.job_card__website}>Website:</strong>{' '}
        <span>
          {individualJob.companyWebsite === ''
            ? 'NP'
            : individualJob.companyWebsite}
        </span>
        <div
          className={jobCardStyles.job_card__description}
          dangerouslySetInnerHTML={{ __html: individualJob.description }}
        />
        {individualJob.emailForward ? (
          <LinkBtn
            name={'Apply'}
            width={'80%'}
            link={
              process.env.NODE_ENV === 'development'
                ? `http://localhost:3000/jobs/${individualJob.pageId}`
                : `https://www.consolejob.com/jobs/${individualJob.pageId}`
            }
            newTab={false}
          />
        ) : (
          <LinkBtn
            name={'Apply'}
            width={'80%'}
            link={`${individualJob.redirectURL}`}
            newTab={true}
          />
        )}
      </div>
    </article>
  );
}

export default JobCard;
