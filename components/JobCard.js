import { useState } from 'react';
import { getCurrentDate } from '../functions/GetCurrentDate';
import { jobContext } from '../context/JobContext';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { VscRemoteExplorer } from 'react-icons/vsc';
import { FaMoneyBill } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

import jobCardStyles from '../styles/JobCard.module.css';

function JobCard({ individualJob, handleToggleUserApplicationScreen }) {
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
          <strong>Website:</strong>{' '}
          <span className='job-card__website'>{individualJob.website}</span>
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

            /*
            This next part is extremely "hacky". I need to somehow get the individual job
            into the user application screen so that when they apply I can get that job's id.
            Because I did not plan this out very well, achieving this through lifting state is a
            hastel. Since I do not have a global state managment solution, I am just gonna
            save the job into context. This is not the proper context api with a provider and
            all that jazz. This is essentially a global variable.
          */
            jobContext(individualJob);

            handleToggleUserApplicationScreen();
          }}
        >
          Apply
        </button>
      </div>
    </article>
  );
}

export default JobCard;
