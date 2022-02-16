// Getting job in props from getStaticProps
export default function JobPosting({ jobDetails }) {
  return (
    <section>
      <h1>Hello</h1>
    </section>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const jobId = params.id;

  const res = await fetch('http://localhost:3000/api/searchJobListings');
  let data = await res.json();
  data = data = Object.entries(data)[0][1];

  const job = data.filter((jobListing) => jobListing.pageId === jobId);

  return {
    props: {
      jobDetails: job,
    },
  };
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/searchJobListings');

  let data = await res.json();
  data = data = Object.entries(data)[0][1];

  const paths = data.map((job) => ({
    params: { id: job.pageId },
  }));

  return {
    paths,
    fallback: false,
  };
}
