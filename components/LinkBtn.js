import Link from 'next/link';

import linkBtnStyles from '../styles/LinkBtn.module.css';

function LinkBtn({ name, width, link, newTab }) {
  return (
    <Link href={link}>
      {newTab ? (
        <a
          style={{ width: width }}
          className={linkBtnStyles.link_btn}
          target='_blank'
        >
          {name}
        </a>
      ) : (
        <a style={{ width: width }} className={linkBtnStyles.link_btn}>
          {name}
        </a>
      )}
    </Link>
  );
}

export default LinkBtn;
