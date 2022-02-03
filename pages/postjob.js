import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import GeneralBtn from '../components/GeneralBtn';
import PreviewJobCard from '../components/PreviewJobCard';
import dynamic from 'next/dynamic';

import postJobStyles from '../styles/PostJob.module.css';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

function Postjob() {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [jobEmail, setJobEmail] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [remoteAvailable, setRemoteAvailable] = useState('');
  const [positionType, setPositionType] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [positionSalary, setPositionSalary] = useState('');
  const [positionSalaryType, setPositionSalaryType] = useState('');
  const [positionDescription, setPositionDescription] = useState('');

  let positionPreview = {
    positionName: jobTitle,
    companyName: companyName,
    positionType: positionType,
    location: companyLocation,
    applicationEmail: jobEmail,
    applicationRedirect: jobLink,
    salaryType: positionSalaryType,
    salary: positionSalary,
    remote: remoteAvailable,
    website: companyWebsite,
    description: positionDescription,
  };

  useEffect(() => {
    positionPreview.positionName = jobTitle;
    positionPreview.companyName = companyName;
    positionPreview.positionType = positionType;
    positionPreview.location = companyLocation;
    positionPreview.applicationEmail = jobEmail;
    positionPreview.applicationRedirect = jobLink;
    positionPreview.salaryType = positionSalaryType;
    positionPreview.salary = positionSalary;
    positionPreview.remote = remoteAvailable;
    positionPreview.website = companyWebsite;
    positionPreview.description = positionDescription;
  });

  const handleExperienceRequired = (expereinceRequiredValue) => {
    setExperienceRequired(expereinceRequiredValue);
  };

  const handleRemoteAvailable = (remoteAvailableValue) => {
    setRemoteAvailable(remoteAvailableValue);
  };

  const handlePositionType = (positionTypeValue) => {
    setPositionType(positionTypeValue);
  };

  const handleSalaryTypeChange = (salaryTypeValue) => {
    setPositionSalaryType(salaryTypeValue);
  };

  const handleSalaryChange = (salaryValue) => {
    setPositionSalary(salaryValue);
  };

  const handlePost = () => {
    null;
  };

  const handleClear = () => {
    setJobTitle('');
    setCompanyName('');
    setCompanyLocation('');
    setJobEmail('');
    setJobLink('');
    setExperienceRequired('');
    setRemoteAvailable('');
    setPositionType('');
    setCompanyWebsite('');
    setPositionSalaryType('');
    setPositionSalary('');
    setPositionDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    const res = await fetch('../api/createJobListing', {
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const result = await res.json();
    console.log(result);
  };

  useEffect(() => {
    let userApplyLinkChoiceEmail = document.getElementById('email');
    let userApplyLinkChoiceLink = document.getElementById('link');

    userApplyLinkChoiceEmail.value !== ''
      ? (userApplyLinkChoiceLink.disabled = true)
      : (userApplyLinkChoiceLink.disabled = false);
    userApplyLinkChoiceLink.value !== ''
      ? (userApplyLinkChoiceEmail.disabled = true)
      : (userApplyLinkChoiceEmail.disabled = false);
  }, [jobEmail, jobLink]);

  return (
    <form onSubmit={handleSubmit}>
      <div className={postJobStyles.post_job_screen__Container}>
        <h2>Post a job for 60 days! Only X$</h2>
        <label htmlFor='title' className={postJobStyles.post_job_screen__label}>
          Title
        </label>
        <input
          name='title'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Title'
          type='text'
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <label
          htmlFor='companyName'
          className={postJobStyles.post_job_screen__label}
        >
          Name of Company
        </label>
        <input
          name='companyName'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Company Name'
          type='text'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <label
          htmlFor='contactEmail'
          className={postJobStyles.post_job_screen__label}
        >
          Contact Email (for receipt)
        </label>
        <input
          name='contactEmail'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Email'
          type='text'
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label
          htmlFor='address'
          className={postJobStyles.post_job_screen__label}
        >
          Location
        </label>
        <input
          name='address'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Address'
          type='text'
          value={companyLocation}
          onChange={(e) => setCompanyLocation(e.target.value)}
        />
        <SearchFilters
          experienceValue={experienceRequired}
          experienceChange={handleExperienceRequired}
          remoteValue={remoteAvailable}
          remoteChange={handleRemoteAvailable}
          jobTypeValue={positionType}
          jobTypeChange={handlePositionType}
          jobSalary={positionSalary}
          jobSalaryChange={handleSalaryChange}
          jobSalaryType={positionSalaryType}
          jobSalaryTypeChange={handleSalaryTypeChange}
        />
        <label
          htmlFor='emailForward'
          className={
            (postJobStyles.post_job_screen__label,
            postJobStyles.additional_margin_top)
          }
        >
          Email address to forward applicaitions
        </label>
        <input
          name='emailForward'
          id='email'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Email'
          type='text'
          value={jobEmail}
          onChange={(e) => setJobEmail(e.target.value)}
        />
        <p className={postJobStyles.post_job_screen__or}>OR</p>
        <label
          htmlFor='redirectURL'
          className={postJobStyles.post_job_screen__label}
        >
          Redirect link to send candidates
        </label>
        <input
          name='redirectURL'
          id='link'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='URL of internal application'
          type='text'
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
        />
        <label
          htmlFor='companyWebsite'
          className={
            (postJobStyles.post_job_screen__label,
            postJobStyles.additional_margin_top)
          }
        >
          Company Website
        </label>
        <input
          name='companyWebsite'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Company website'
          type='text'
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
        <label
          htmlFor='description'
          className={
            (postJobStyles.post_job_screen__label,
            postJobStyles.additional_margin_top)
          }
        >
          Description
        </label>
        <SunEditor
          name='description'
          setOptions={{
            height: 250,
            buttonList: [
              // default
              ['undo', 'redo'],
              ['fontSize'],
              ['bold', 'underline', 'italic', 'list'],
              ['link'],
            ],
          }}
          onChange={setPositionDescription}
          setContents={positionDescription}
        />
        <label
          htmlFor='display-only-preview-of-post'
          className={
            (postJobStyles.post_job_screen__label,
            postJobStyles.additional_margin_top)
          }
        >
          Preview of Post
        </label>
        <hr className={postJobStyles.hr} />
        <PreviewJobCard individualJob={positionPreview} />
        <hr className={postJobStyles.hr} />
        <div className={postJobStyles.post_job_screen__btn_container}>
          <GeneralBtn
            name='Post!'
            btnFunction={handlePost}
            submitFlag={'submit'}
          />
          <GeneralBtn
            name='Clear'
            btnFunction={handleClear}
            submitFlag={'button'}
          />
          <Link href='/'>
            <a className={postJobStyles.back_btn}>back</a>
          </Link>
        </div>
      </div>
    </form>
  );
}

export default Postjob;
