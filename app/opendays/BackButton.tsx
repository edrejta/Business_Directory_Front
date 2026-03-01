"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <button
      type="button"
      className={styles.backBtn}
      onClick={() => {
        const backTo = searchParams.get("backTo");
        if (backTo && backTo.startsWith("/")) {
          router.push(backTo);
          return;
        }

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
