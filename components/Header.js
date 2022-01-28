import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import HeroImage from '../public/images/hero.webp';

import headerStyles from '../styles/Header.module.css';

function Header() {
  const router = useRouter();

  return (
    <header className={headerStyles.hero__container}>
      <div className={headerStyles.hero__text_content}>
        <p className={headerStyles.hero__subtext}>
          Find your next career in Software
        </p>
        <h1 className={headerStyles.hero__title}>Console.job&#40;&#41;</h1>
        <h2 className={headerStyles.hero__text_description}>
          Job board for developers
        </h2>
        <div className={headerStyles.hero__btn_container}>
          {router.asPath === '/' ? (
            <>
              <Link href='/postjob'>
                <a className={headerStyles.hero__btn}>Post a Job</a>
              </Link>
              <Link href='/remove'>
                <a className={headerStyles.hero__btn}>Remove Listing</a>
              </Link>
            </>
          ) : (
            <Link href='/'>
              <a className={headerStyles.hero__btn}>Find a Job</a>
            </Link>
          )}
        </div>
      </div>
      <Image
        src={HeroImage}
        alt='Trendy cartoon of people working'
        priority={true}
        className={headerStyles.hero__image}
      />
    </header>
  );
}

export default Header;
