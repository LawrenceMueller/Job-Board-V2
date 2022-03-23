import { useState } from 'react';
import SearchFilters from './SearchFilters';
import GeneralBtn from './GeneralBtn';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import searchStyles from '../styles/Search.module.css';

function Search({ handleJobSearch }) {
  const badNotify = (msg) => toast.error(msg);

  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryType, setSalaryType] = useState('');

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    // Need to format the salary correctly
    formData.minimumSalary = parseInt(formData.minimumSalary);

    if (formData.address !== '' && formData.address.length < 3) {
      badNotify('Address entered is too short');
    } else {
      try {
        const devOrProd =
          process.env.NODE_ENV === 'development'
            ? `http://localhost:3000/api/searchJobListings`
            : `https://www.consolejob/api/searchJobListings`;

        //'https://www.job-board-seven.vercel.app/api/searchJobListings'
        const res = await fetch(
          'http://www.job-board-2lug8kos5-amalazing.vercel.app/api/searchJobListings',
          {
            body: JSON.stringify(formData),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }
        );

        const result = await res.json();
        handleJobSearch(Object.entries(result)[0][1]);
      } catch (error) {
        console.log('Error with sending the POST request');
        console.log('Here is the trace');
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ToastContainer />
      <div className={searchStyles.job_search__container}>
        <div
          className={searchStyles.job_search__position_and_location_container}
        >
          <label htmlFor='title' className={searchStyles.lable_for_SR}>
            Search
          </label>
          <input
            name='title'
            className={searchStyles.job_search__search_bar}
            placeholder='Position'
            type='text'
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <label htmlFor='address' className={searchStyles.lable_for_SR}>
            Location
          </label>
          <input
            name='address'
            className={searchStyles.job_search__search_bar}
            placeholder='Location Address'
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
          forSearch={true}
        />
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
          <h3 className={searchStyles.sort_by__results_text}>
            Results | NP = Not Provided
          </h3>
        </div>
      </div>
    </form>
  );
}

export default Search;
