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
  forSearch,
}) {
  return (
    <div className={searchFiltersStyles.additional_filters}>
      <div
        className={searchFiltersStyles.additional_filters__expereience_required}
      >
        <label htmlFor='experience'>Expereince (years)</label>
        <select
          className={searchFiltersStyles.dropdown}
          name='experience'
          value={experienceValue}
          onChange={(e) => experienceChange(e.target.value)}
        >
          <option value='none'>-</option>
          <option value='entry'>Entry (0-1)</option>
          <option value='junior'>Junior (1-3)</option>
          <option value='mid'>Mid (3-5)</option>
          <option value='senior'>Senior (5+)</option>
        </select>
      </div>
      <div className={searchFiltersStyles.additional_filters__remote_available}>
        <label htmlFor='telecommute'>Telecommute</label>
        <select
          className={searchFiltersStyles.dropdown}
          name='telecommute'
          value={remoteValue}
          onChange={(e) => remoteChange(e.target.value)}
        >
          <option value='none'>-</option>
          <option value='remote'>Remote</option>
          <option value='on-site'>On-Site</option>
        </select>
      </div>
      <div className={searchFiltersStyles.additional_filters__position_type}>
        {forSearch === true ? (
          <label htmlFor='positionType'>Type</label>
        ) : (
          <label htmlFor='positionType'>
            Type <span style={{ color: 'red' }}>*</span>
          </label>
        )}
        <select
          className={searchFiltersStyles.dropdown}
          name='positionType'
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
        <label htmlFor='salaryType'>Compensation</label>
        <div style={{ display: 'inline-grid' }}>
          <select
            name='salaryType'
            className={searchFiltersStyles.dropdown}
            value={jobSalaryType}
            onChange={(e) => jobSalaryTypeChange(e.target.value)}
          >
            <option value='none'>-</option>
            <option value='yr'>Per Year</option>
            <option value='hr'>Per Hour</option>
          </select>
          <label
            className={searchFiltersStyles.additional_filters__special_label}
            htmlFor='minimumSalary'
          >
            Compensation Number
          </label>
          <input
            name='minimumSalary'
            className={searchFiltersStyles.additional_filters__salary_input}
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
