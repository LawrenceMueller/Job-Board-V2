let selectedJob = {};

export function jobContext(job) {
  if (job === undefined) {
    return selectedJob;
  } else {
    selectedJob = job;
  }
}
