import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Hello, World</h1>
        <p className={styles.description}>
          Welcome to my personal website. This is a work in progress.
        </p>
      </div>
    </main>
  );
}

