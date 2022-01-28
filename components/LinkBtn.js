import Link from 'next/link';

import linkBtnStyles from '../styles/LinkBtn.module.css';

function LinkBtn({ name, width, link }) {
  return (
    <Link href={link}>
      <a style={{ width: width }} className={linkBtnStyles.link_btn}>
        {name}
      </a>
    </Link>
  );
}

export default LinkBtn;
