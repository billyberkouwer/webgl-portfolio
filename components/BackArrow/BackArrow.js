import Link from "next/link";
import Image from "next/image";
import styles from './BackArrow.module.scss'

const BackArrow = (props) => {
  return (
    <div className={styles.arrowContainer}>
      <Link href="/" priority>
        <a>
          <Image
            src="/icons/arrow.svg"
            height={40}
            width={70}
            className={styles.arrow}
            alt="return home"
          />
        </a>
      </Link>
    </div>
  );
};

export default BackArrow;
