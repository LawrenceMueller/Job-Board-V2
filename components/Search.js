import { useState } from 'react';
import SearchFilters from './SearchFilters';
import IndividualSkill from './IndividualSkill';
import GeneralBtn from './GeneralBtn';

import searchStyles from '../styles/Search.module.css';

function Search() {
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryType, setSalaryType] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState('');

  const handleExperienceChange = (experienceChosen) => {
    setExperience(experienceChosen);
  };

  const handleRemoteChange = (remoteChosen) => {
    setRemote(remoteChosen);
  };

  const handleJobTypeChange = (jobTypeChosen) => {
    setJobType(jobTypeChosen);
  };

  const handleSalaryTypeChange = (salaryTypeValue) => {
    setSalaryType(salaryTypeValue);
  };

  const handleSalaryChange = (salaryValue) => {
    setSalary(salaryValue);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();

    if (skillName.length < 1) {
      alert('The name of the skill you are trying to add is not long enough!');
    } else {
      setSkills([...skills, skillName]);
      setSkillName('');
    }
  };

  const handleSearch = () => {
    console.log('search');
  };

  const handleClearFilters = () => {
    setPosition('');
    setLocation('');
    setExperience('');
    setRemote('');
    setJobType('');
    setSalary('');
    setSalaryType('');
    setSkills([]);
  };
  return (
    <div className={searchStyles.job_search__container}>
      <div className={searchStyles.job_search__position_and_location_container}>
        <label htmlFor='position-title' className={searchStyles.lable_for_SR}>
          Search
        </label>
        <input
          name='position-title'
          className={searchStyles.job_search__search_bar}
          placeholder='Position'
          type='text'
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <label
          htmlFor='position-location'
          className={searchStyles.lable_for_SR}
        >
          Location
        </label>
        <input
          name='position-location'
          className={searchStyles.job_search__search_bar}
          placeholder='Location'
          type='text'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <SearchFilters
        experienceValue={experience}
        experienceChange={handleExperienceChange}
        remoteValue={remote}
        remoteChange={handleRemoteChange}
        jobTypeValue={jobType}
        jobTypeChange={handleJobTypeChange}
        jobSalary={salary}
        jobSalaryChange={handleSalaryChange}
        jobSalaryType={salaryType}
        jobSalaryTypeChange={handleSalaryTypeChange}
      />
      <div className={searchStyles.skills_for_filter__container}>
        <label
          htmlFor='skills-to-filter-by'
          className={searchStyles.skills_for_filter__label}
        >
          Filter by Skills
        </label>
        <div className={searchStyles.skills_for__filter__add_input_section}>
          <form id='add-skill-form'>
            <input
              name='skills-to-filter-by'
              className={searchStyles.skills_for_filter__input}
              placeholder='JavaScirpt'
              type='text'
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
          </form>
          <button
            form='add-skill-form'
            className={searchStyles.skills_for_filter__add_btn}
            type='submit'
            onClick={handleAddSkill}
          >
            Add
          </button>
        </div>
      </div>
      <div className={searchStyles.skills_for_filter__skills_added_section}>
        {skills.map((skill) => {
          return <IndividualSkill name={skill} key={skill} />;
        })}
      </div>
      <div className={searchStyles.job_search__btn_container}>
        <GeneralBtn name='Search' btnFunction={handleSearch} />
        <GeneralBtn name='Clear' btnFunction={handleClearFilters} />
      </div>
      <div className={searchStyles.sort_by__container}>
        <h3 className={searchStyles.sort_by__results_text}>Results</h3>
        <div>
          <select
            className={searchStyles.sort_by__select}
            name='dropdown-to-select-sort-by'
            onChange={console.log('hello')}
          >
            <option value='recent'>Recent</option>
            <option value='location'>Location</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Search;
