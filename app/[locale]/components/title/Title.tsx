import styles from './Title.module.scss'

type Props = {
  children: React.ReactNode;
  title: "h1" | "h2"
  className?: string;
};

const Title = ({ title, children, className }: Props) => {
  switch (title) {
    case "h1":
      return <h1 className={`${styles.h1} ${className}`}>{children}</h1>;
    case "h2":
      return <h2 className={`${styles.h2} ${className}`}>{children}</h2>;
    default:
      return <></>;
  }
};

export default Title;