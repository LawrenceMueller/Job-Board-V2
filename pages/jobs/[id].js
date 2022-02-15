// Getting job in props from getStaticProps
export default function JobPosting({ job }) {
  return (
    <section>
      <h1>Hello</h1>
    </section>
  );
}

export const getStaticPaths = async () => {
  const res = await fetch('');
  const data = await res.json();

  const paths = data.map((jobPost) => {
    return {
      params: { id: jobPost.entityId.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

// Getting context from getStaticPathts
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await fetch('' + id);
  const data = await res.json();

  return {
    porps: { job: data },
  };
};
