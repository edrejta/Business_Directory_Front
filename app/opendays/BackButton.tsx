"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className={styles.backBtn}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.push("/homepage");
      }}
    >
      Back
    </button>
  );
}
