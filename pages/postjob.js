import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchFilters from '../components/SearchFilters';
import GeneralBtn from '../components/GeneralBtn';
import PreviewJobCard from '../components/PreviewJobCard';
import dynamic from 'next/dynamic';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import postJobStyles from '../styles/PostJob.module.css';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

function Postjob() {
  const router = useRouter();

  const badNotify = (msg) => toast.error(msg);
  const goodNotify = (msg) => toast.success(msg);

  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
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
    country: country,
    state: state,
    city: city,
    zip: zip,
    experience: experienceRequired,
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
    positionPreview.country = country;
    positionPreview.state = state;
    positionPreview.city = city;
    positionPreview.zip = zip;
    positionPreview.applicationEmail = jobEmail;
    positionPreview.experience = experienceRequired;
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
    setContactEmail('');
    setJobEmail('');
    setJobLink('');
    setCountry('');
    setState('');
    setCity('');
    setZip('');
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

    if (formData.title === '') {
      badNotify('Missing title');
    } else if (formData.companyName === '') {
      badNotify('Missing company name');
    } else if (formData.contactEmail === '') {
      badNotify('Missing email for receipt');
    } else if (formData.country === '') {
      badNotify('Missing country');
    } else if (formData.state === '' || formData.state.length < 3) {
      badNotify('Missing state or you need to spell it out completely');
    } else if (formData.city === '') {
      badNotify('Missing city');
    } else if (formData.zip === '') {
      badNotify('Missing zip');
    } else if (formData.positionType === 'none') {
      badNotify('Missing type of position');
    } else if (formData.emailForward === '' || formData.redirectURL === '') {
      badNotify(
        'No email to forard applicants information or no URL provided to redirect applicants'
      );
    } else if (formData.description === '') {
      badNotify('Missing description');
    } else {
      // Need to format the salary correctly
      formData.minimumSalary = parseInt(formData.minimumSalary);

      console.log(formData);

      try {
        const res = await fetch('../api/createJobListing', {
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        const result = await res.json();

        if (result.msg === 'success') {
          goodNotify('Posted successful! Redirecting soon');
          setTimeout(() => {
            router.push('/#top');
          }, 2000);
        } else {
          badNotify('Problem with posting the job listing');
        }
      } catch (error) {
        console.log('Error with sending the POST request');
        console.log('Here is the trace');
        console.error(error);
      }
    }
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
      <ToastContainer />
      <div className={postJobStyles.post_job_screen__Container}>
        <h2>Post a job for 60 days! Only X$</h2>
        <label htmlFor='title' className={postJobStyles.post_job_screen__label}>
          Title <span style={{ color: 'red' }}>*</span>
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
          Name of Company <span style={{ color: 'red' }}>*</span>
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
          Contact Email (for receipt) <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          name='contactEmail'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Email'
          type='text'
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label className={postJobStyles.post_job_screen__label}>
          Company Location <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          name='country'
          className={postJobStyles.post_job_screen__text_input}
          style={{ marginBottom: '10px' }}
          placeholder='Country'
          type='text'
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          name='state'
          className={postJobStyles.post_job_screen__text_input}
          style={{ marginBottom: '10px' }}
          placeholder='State/Territory'
          type='text'
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <input
          name='city'
          className={postJobStyles.post_job_screen__text_input}
          style={{ marginBottom: '10px' }}
          placeholder='City'
          type='text'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          name='zip'
          className={postJobStyles.post_job_screen__text_input}
          placeholder='Zipcode'
          type='text'
          value={zip}
          onChange={(e) => setZip(e.target.value)}
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
          forSearch={false}
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
        <p className={postJobStyles.post_job_screen__or}>
          OR <span style={{ color: 'red' }}>*</span>
        </p>
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
          Description <span style={{ color: 'red' }}>*</span>
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
