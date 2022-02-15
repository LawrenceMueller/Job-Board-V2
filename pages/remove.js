import { useState } from 'react';
import Link from 'next/link';
import GeneralBtn from '../components/GeneralBtn';
import { useRouter } from 'next/router';

import removeStyles from '../styles/Remove.module.css';

function Remove() {
  const router = useRouter();

  const [uniqueId, setUniqueId] = useState('');

  const handleRemove = () => {
    null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    try {
      const res = await fetch('../api/removeJobListing', {
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
      const result = await res.json();

      result.msg === 'success'
        ? router.push('/#top')
        : console.log('failed removing the job listing');
    } catch (error) {
      console.log('Error with sending the DELETE request');
      console.log('Here is the trace');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className={removeStyles.remove_listing_screen___container}>
        <h2 className={removeStyles.remove_listing_screen___title}>
          Remove your posting from Console.job
        </h2>
        <div className={removeStyles.remove_listing_screen___post_id_section}>
          <label
            htmlFor='removalId'
            className={removeStyles.remove_listing_screen___post_id_label}
          >
            Unique Removal Id of post
          </label>
          <input
            name='removalId'
            id='email'
            className={removeStyles.remove_listing_screen___post_id_input}
            placeholder='xxxxxxxxx'
            type='text'
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
          />
        </div>
        <div className={removeStyles.remove_listing_screen___btn_container}>
          <GeneralBtn
            name='Remove'
            btnFunction={handleRemove}
            submitFlag={'submit'}
          />
          <Link href='/'>
            <a className={removeStyles.back_btn}>back</a>
          </Link>
        </div>
      </section>
    </form>
  );
}

export default Remove;
