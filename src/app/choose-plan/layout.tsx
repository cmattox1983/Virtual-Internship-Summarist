import styles from "./ChoosePlan.module.css";

export default function ChoosePlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="wrapper wrapper__full">
        <div
          className={`${styles.sidebar__overlay} ${styles["sidebar__overlay--hidden"]}`}
        ></div>
        <div className="plan">{children}</div>
      </div>
    </>
  );
}
