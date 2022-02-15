// Getting job in props from getStaticProps
export default function JobPosting({ jobData }) {
  return (
    <section>
      <h1>Hello</h1>
      {jobData}
    </section>
  );
}

export async function getStaticPaths() {
  console.log('here2');
  const res = await fetch('http://localhost:3000/api/searchJobListings');

  let data = await res.json();
  data = data = Object.entries(data)[0][1];

  const paths = data.map((job) => ({
    params: { id: job.pageId },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log('here');
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`http://localhost:3000/jobs/${params.id}`);
  const jobData = await res.json();

  console.log(jobData);

  // Pass post data to the page via props
  return { props: { jobData } };
}
