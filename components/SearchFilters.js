import searchFiltersStyles from '../styles/SearchFilters.module.css';

function SearchFilters({
  experienceValue,
  experienceChange,
  remoteValue,
  remoteChange,
  jobTypeValue,
  jobTypeChange,
  jobSalary,
  jobSalaryChange,
  jobSalaryType,
  jobSalaryTypeChange,
}) {
  return (
    <div className={searchFiltersStyles.additional_filters}>
      <div
        className={searchFiltersStyles.additional_filters__expereience_required}
      >
        <label htmlFor='dropdown-to-select-amount-of-experience'>
          Expereince (years)
        </label>
        <select
          className={searchFiltersStyles.dropdown}
          name='dropdown-to-select-amount-of-experience'
          value={experienceValue}
          onChange={(e) => experienceChange(e.target.value)}
        >
          <option value='none'>-</option>
          <option value='entry'>0 - 1</option>
          <option value='junior'>1 - 3</option>
          <option value='mid'>3 - 5</option>
          <option value='senior'>5+</option>
        </select>
      </div>
      <div className={searchFiltersStyles.additional_filters__remote_available}>
        <label htmlFor='dropdown-to-select-remote-work-availability'>
          Telecommute
        </label>
        <select
          className={searchFiltersStyles.dropdown}
          name='dropdown-to-select-remote-work-availability'
          value={remoteValue}
          onChange={(e) => remoteChange(e.target.value)}
        >
          <option value='none'>-</option>
          <option value='remote'>Remote</option>
          <option value='on-site'>On-Site</option>
        </select>
      </div>
      <div className={searchFiltersStyles.additional_filters__position_type}>
        <label htmlFor='dropdown-to-select-type-of-wage-hourly-or-salary'>
          Type
        </label>
        <select
          className={searchFiltersStyles.dropdown}
          name='dropdown-to-select-type-of-wage-hourly-or-salary'
          value={jobTypeValue}
          onChange={(e) => jobTypeChange(e.target.value)}
        >
          <option value='none'>-</option>
          <option value='full-time'>Full Time</option>
          <option value='part-time'>Part Time</option>
          <option value='contract'>Contract</option>
          <option value='internship'>Internship</option>
        </select>
      </div>
      <div className={searchFiltersStyles.additional_filters__salary}>
        <label htmlFor='enter-minimum-wage'>Minimum Salary</label>
        <div style={{ display: 'inline-grid' }}>
          <select
            className={searchFiltersStyles.dropdown}
            value={jobSalaryType}
            onChange={(e) => jobSalaryTypeChange(e.target.value)}
          >
            <option value='none'>-</option>
            <option value='yr'>Per Year</option>
            <option value='hr'>Per Hour</option>
          </select>
          <input
            name='enter-minimum-wage'
            className={searchFiltersStyles.additional_filters__salary_input}
            placeholder='70000'
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            type='text'
            value={jobSalary}
            onChange={(e) => jobSalaryChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
