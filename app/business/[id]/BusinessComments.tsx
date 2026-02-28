"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { createComment, deleteComment } from "@/lib/api/comments";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

type BusinessComment = {
  id: string;
  businessId: string;
  userId: string;
  username: string;
  text: string;
  rate: number;
  createdAt: string;
};

type ApiComment = Partial<BusinessComment> & {
  Id?: string;
  BusinessId?: string;
  UserId?: string;
  Username?: string;
  UserName?: string;
  Text?: string;
  Comment?: string;
  Rate?: number;
  Rating?: number;
  CreatedAt?: string;
  Date?: string;
};

function normalizeComment(raw: ApiComment): BusinessComment | null {
  const id = String(raw.id ?? raw.Id ?? "").trim();
  const businessId = String(raw.businessId ?? raw.BusinessId ?? "").trim();
  const userId = String(raw.userId ?? raw.UserId ?? "").trim();
  const username = String(raw.username ?? raw.Username ?? raw.UserName ?? "user").trim();
  const text = String(raw.text ?? raw.Text ?? raw.Comment ?? "").trim();
  const rate = Number(raw.rate ?? raw.Rate ?? raw.Rating ?? 0);
  const createdAt = String(raw.createdAt ?? raw.CreatedAt ?? raw.Date ?? "");

  if (!id || !businessId || !text) return null;

  return {
    id,
    businessId,
    userId,
    username: username || "user",
    text,
    rate: Number.isFinite(rate) ? Math.max(1, Math.min(5, Math.round(rate))) : 1,
    createdAt,
  };
}

function buildStars(rate: number) {
  const safe = Math.max(1, Math.min(5, Math.round(rate)));
  return `${"\u2605".repeat(safe)}${"\u2606".repeat(5 - safe)}`;
}

export default function BusinessComments({ businessId }: { businessId: string }) {
  const ADMIN_ROLE = 2;
  const pathname = usePathname();
  const { user } = useAuth();
  const [comments, setComments] = useState<BusinessComment[]>([]);
  const [text, setText] = useState("");
  const [rate, setRate] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const canAdminDeleteComments = user?.role === ADMIN_ROLE;

  useEffect(() => {
    let mounted = true;

    const loadComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/comments?businessId=${encodeURIComponent(businessId)}&limit=100`, {
          cache: "no-store",
        });
        const raw = (await res.json().catch(() => [])) as unknown;
        if (!res.ok) {
          if (mounted) setError("Nuk u ngarkuan komentet.");
          return;
        }

        const list = Array.isArray(raw) ? raw : [];
        const normalized = list
          .map((item) => normalizeComment(item as ApiComment))
          .filter((item): item is BusinessComment => item !== null);
        if (mounted) setComments(normalized);
      } catch {
        if (mounted) setError("Backend nuk po pergjigjet.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadComments();
    return () => {
      mounted = false;
    };
  }, [businessId]);

  const loginHref = useMemo(
    () => `/login?next=${encodeURIComponent(pathname || `/business/${businessId}`)}`,
    [pathname, businessId],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    if (!text.trim()) {
      setSubmitMessage("Shkruaj komentin.");
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const created = await createComment({
        businessId,
        text: text.trim(),
        rate,
      });

      const normalized = normalizeComment(created as unknown as ApiComment);
      if (normalized) {
        setComments((prev) => [normalized, ...prev]);
      } else {
        setComments((prev) => [
          {
            id: crypto.randomUUID(),
            businessId,
            userId: "",
            username: user.username ?? user.email ?? "you",
            text: text.trim(),
            rate,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setText("");
      setRate(5);
      setSubmitMessage("Komenti u ruajt.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nuk u ruajt komenti.";
      setSubmitMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onDeleteComment(commentId: string) {
    if (!canAdminDeleteComments) return;

    setDeletingCommentId(commentId);
    setSubmitMessage(null);
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((entry) => entry.id !== commentId));
      setSubmitMessage("Komenti u fshi.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nuk u fshi komenti.";
      setSubmitMessage(message);
    } finally {
      setDeletingCommentId(null);
    }
  }

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Comments</h2>

      {!user ? (
        <p className={styles.commentsHint}>
          Per te komentuar duhet login. <Link href={loginHref}>Hyr ketu</Link>. Komentet mund t&apos;i lexosh pa login.
        </p>
      ) : (
        <form className={styles.commentForm} onSubmit={onSubmit}>
          <label className={styles.commentLabel}>
            Rating
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))} className={styles.commentSelect}>
              <option value={5}>5</option>
              <option value={4}>4</option>
              <option value={3}>3</option>
              <option value={2}>2</option>
              <option value={1}>1</option>
            </select>
          </label>

          <label className={styles.commentLabel}>
            Comment
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.commentInput}
              placeholder="Shkruaj komentin..."
              rows={4}
              maxLength={1000}
            />
          </label>

          <button type="submit" className={styles.btnPrimary} disabled={submitting}>
            {submitting ? "Duke ruajtur..." : "Post Comment"}
          </button>
          {submitMessage ? <p className={styles.commentsHint}>{submitMessage}</p> : null}
        </form>
      )}

      {loading ? <p className={styles.commentsHint}>Duke ngarkuar komentet...</p> : null}
      {error ? <p className={styles.commentsHint}>{error}</p> : null}

      {!loading && comments.length === 0 ? <p className={styles.commentsHint}>Nuk ka komente akoma.</p> : null}

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <article key={comment.id} className={styles.commentCard}>
            <div className={styles.commentHeader}>
              <div className={styles.commentMeta}>
                <strong>{comment.username || "user"}</strong>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              {canAdminDeleteComments ? (
                <button
                  type="button"
                  className={styles.commentDelete}
                  onClick={() => {
                    void onDeleteComment(comment.id);
                  }}
                  disabled={deletingCommentId === comment.id}
                >
                  {deletingCommentId === comment.id ? "Duke fshire..." : "Delete"}
                </button>
              ) : null}
            </div>
            <div className={styles.commentBody}>
              <p className={styles.commentRating}>{buildStars(comment.rate)}</p>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
