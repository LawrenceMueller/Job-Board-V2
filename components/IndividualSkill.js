import individualSkillStyles from '../styles/IndividualSkill.module.css';

function IndividualSkill({ name }) {
  return <p className={individualSkillStyles.individual_skill}>{name}</p>;
}

export default IndividualSkill;
