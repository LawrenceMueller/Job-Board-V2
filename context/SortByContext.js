let sortByFilterContext = 'recent';

export default function SortByContext(selectedSortByFilter) {
  if (selectedSortByFilter === undefined) {
    return sortByFilterContext;
  } else {
    sortByFilterContext = selectedSortByFilter;
  }
}
