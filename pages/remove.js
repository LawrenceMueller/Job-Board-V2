import { useState } from 'react';
import Link from 'next/link';
import GeneralBtn from '../components/GeneralBtn';

import removeStyles from '../styles/Remove.module.css';

function Remove() {
  const [uniqueId, setUniqueId] = useState('');
  const [postEmailContact, setPostEmailContact] = useState('');

  const handleRemove = () => {
    console.log('remove');
  };

  return (
    <section className={removeStyles.remove_listing_screen___container}>
      <h2 className={removeStyles.remove_listing_screen___title}>
        Remove your posting from Console.job
      </h2>
      <div className={removeStyles.remove_listing_screen___post_id_section}>
        <label
          htmlFor='unique-post-id'
          className={removeStyles.remove_listing_screen___post_id_label}
        >
          Unique Id of Post
        </label>
        <input
          name='unique-post-id'
          id='email'
          className={removeStyles.remove_listing_screen___post_id_input}
          placeholder='xxxxxxxxx'
          type='text'
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
        />
      </div>
      <div
        className={removeStyles.remove_listing_screen___email_contact_section}
      >
        <label
          htmlFor='contact-email'
          className={removeStyles.remove_listing_screen___email_contact_label}
        >
          Contact email used for posting
        </label>
        <input
          name='contact-email'
          id='email'
          className={removeStyles.remove_listing_screen___email_contact_input}
          placeholder='email'
          type='text'
          value={postEmailContact}
          onChange={(e) => setPostEmailContact(e.target.value)}
        />
      </div>
      <div className={removeStyles.remove_listing_screen___btn_container}>
        <GeneralBtn name='Remove' btnFunction={handleRemove} />
        <Link href='/'>
          <a className={removeStyles.back_btn}>back</a>
        </Link>
      </div>
    </section>
  );
}

export default Remove;
