import { useState, useEffect } from 'react';
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
  const [skillName, setSkillName] = useState('');
  const [skillsPreview, setSkillsPreview] = useState([]);
  const [skillsToFilter, setSkillsToFilter] = useState('');

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
      setSkillsPreview([...skillsPreview, skillName]);
      setSkillsToFilter((skillName) => {
        skillsToFilter = skillsToFilter + skillName;
      });
      setSkillName('');
    }
  };

  const handleSearch = () => {
    null;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    console.log(skillsToFilter);

    console.log(formData);

    try {
      const res = await fetch('../api/searchJobListings', {
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.log('Error with sending the POST request');
      console.log('Here is the trace');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={searchStyles.job_search__container}>
        <div
          className={searchStyles.job_search__position_and_location_container}
        >
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
            <input
              name='skills-to-filter-by'
              placeholder='JavaScirpt'
              type='text'
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
            <button
              className={searchStyles.skills_for_filter__add_btn}
              onClick={handleAddSkill}
            >
              Add
            </button>
          </div>
        </div>
        <div className={searchStyles.skills_for_filter__skills_added_section}>
          {skillsPreview.map((skill) => {
            return <IndividualSkill name={skill} key={skill} />;
          })}
        </div>
        <div className={searchStyles.job_search__btn_container}>
          <GeneralBtn
            name='Search'
            btnFunction={handleSearch}
            submitFlag={'submit'}
          />
          <GeneralBtn
            name='Clear'
            btnFunction={handleClearFilters}
            submitFlag={'button'}
          />
        </div>
        <div className={searchStyles.sort_by__container}>
          <h3 className={searchStyles.sort_by__results_text}>Results</h3>
          <div>
            <select
              className={searchStyles.sort_by__select}
              name='dropdown-to-select-sort-by'
              onChange={null}
            >
              <option value='recent'>Recent</option>
              <option value='location'>Location</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Search;
