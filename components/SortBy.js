import SortByContext from '../context/SortByContext';

import sortByStyles from '../styles/SortBy.module.css';

export default function SortBy({ handleSortByChange }) {
  return (
    <div className={sortByStyles.sort_by__container}>
      <h3 className={sortByStyles.sort_by__results_text}>Results</h3>
      <div>
        <select
          className={sortByStyles.sort_by__select}
          name='dropdown-to-select-sort-by'
          onChange={(e) => {
            SortByContext(e.target.value);
            handleSortByChange();
          }}
        >
          <option value='recent'>Recent</option>
          <option value='location'>Location</option>
        </select>
      </div>
    </div>
  );
}
