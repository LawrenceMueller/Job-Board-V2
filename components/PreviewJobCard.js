import { useState } from 'react';
import { VscRemoteExplorer } from 'react-icons/vsc';
import {
  FaMapMarkerAlt,
  FaBookOpen,
  FaMoneyBill,
  FaCheckCircle,
  FaCreativeCommonsShare,
} from 'react-icons/fa';

import jobCardStyles from '../styles/JobCard.module.css';

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

function PreviewJobCard({ individualJob }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandCard = () => {
    setExpanded(!expanded);
  };

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
          <p className={jobCardStyles.job_card__mb_15_px}>Posted: Today</p>
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
              &nbsp;${individualJob.salary}/{individualJob.salaryType}
            </p>
          </div>
          <div>
            <p className={jobCardStyles.job_card__experience}>
              <FaBookOpen /> {individualJob.experience}
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
          <strong className={jobCardStyles.job_card__website}>Website:</strong>{' '}
          <span className={jobCardStyles.job_card__website}>
            {individualJob.website}
          </span>
        </p>
        <div
          className={jobCardStyles.job_card__description}
          dangerouslySetInnerHTML={{ __html: individualJob.description }}
        />
        <button
          className={jobCardStyles.job_card__btn_preview_apply}
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
