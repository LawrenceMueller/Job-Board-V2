import { useState } from 'react';
import { getCurrentDate } from '../../functions/GetCurrentDate';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { VscRemoteExplorer } from 'react-icons/vsc';
import { FaMoneyBill } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

import jobCardStyles from '../styles/JobCard.module.css';

function PreviewJobCard({ individualJob }) {
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
            {individualJob.positionName}
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
              &nbsp;${individualJob.salary}/{individualJob.salaryType}
            </p>
          </div>
          <div>
            <p className={jobCardStyles.job_card__location}>
              <FaMapMarkerAlt />
              {individualJob.location}
            </p>
            <p className={jobCardStyles.job_card__remote}>
              <VscRemoteExplorer />
              &nbsp;{individualJob.remote}&nbsp;
              {individualJob.remote === 'Remote' ? <FaCheckCircle /> : null}
            </p>
          </div>
        </div>
      </div>
      <div className={expanded ? '' : jobCardStyles.invisible}>
        <p>
          Website:{' '}
          <span className={jobCardStyles.job_card__website}>
            {individualJob.website}
          </span>
        </p>
        <div
          className={jobCardStyles.job_card__description}
          dangerouslySetInnerHTML={{ __html: individualJob.description }}
        />
        <button
          className={jobCardStyles.job_card__btn}
          onClick={(e) => {
            /* 
          This next line is too prevent event bubbling which took me quite a while
          to figure out. When the apply button is clicked it propgates the event of
          a click up the DOM and triggers the handleExpandCard function which would
          close the job card. Very annoying but glad thier is a simple solution.
        */
            e.stopPropagation();
          }}
        >
          Apply
        </button>
      </div>
    </article>
  );
}

export default PreviewJobCard;
