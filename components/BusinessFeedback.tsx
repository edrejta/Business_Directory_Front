"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { Review } from "@/lib/types/review";
import { addReview, addComment, getReviews } from "@/lib/feedback/storage";
import * as ownerApi from "@/lib/api/ownerBusinesses";
import FavoriteButton from "@/components/FavoriteButton";
import styles from "./BusinessFeedback.module.css";

interface BusinessFeedbackProps {
  businessId: string;
  businessName: string;
  href?: string;
}

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `review-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function BusinessFeedback({ businessId, businessName, href }: BusinessFeedbackProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setReviews(getReviews(businessId));
  }, [businessId]);

  useEffect(() => {
    // Detect whether the current authenticated user is the owner of this
    // business by calling the owner API. The owner endpoint will typically
    // return success only for the owner (or admin). If the call succeeds,
    // we treat the user as the owner and allow posting comments as the
    // business name.
    let mounted = true;
    (async () => {
      try {
        await ownerApi.getBusinessById(businessId);
        if (mounted) setIsOwner(true);
      } catch {
        if (mounted) setIsOwner(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [businessId]);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Login required to post a review.");
      return;
    }

    const trimmed = comment.trim();
    if (trimmed.length < 3) {
      setError("Comment should be at least 3 characters.");
      return;
    }

    const review: Review = {
      id: makeId(),
      businessId,
      // If current user is owner, post the review/comment using the
      // business name instead of the account label.
      userLabel: isOwner ? businessName : user.username || user.email || "User",
      rating,
      comment: trimmed,
      createdAt: new Date().toISOString(),
    };

    // TODO: Replace local storage with backend endpoints when available.
    // const created = await createComment({ businessId, text: trimmed, rate: rating });
    // setReviews((prev) => [normalize(created), ...prev]);

    const next = addReview(businessId, review);
    setReviews(next);
    setComment("");
    setRating(5);
  };

  const handleCommentChange = (reviewId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleAddComment = (reviewId: string) => {
    setError(null);
    if (!user) {
      setError("Login required to post a comment.");
      return;
    }
    const text = (commentInputs[reviewId] || "").trim();
    if (text.length < 1) {
      setError("Comment should not be empty.");
      return;
    }

    const newComment = {
      id: makeId(),
      reviewId,
      // Use businessName when owner posts a reply.
      userLabel: isOwner ? businessName : user.username || user.email || "User",
      text,
      createdAt: new Date().toISOString(),
    };

    const next = addComment(businessId, reviewId, newComment);
    setReviews(next);
    setCommentInputs((prev) => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <section className={styles.section} aria-label="Reviews and comments">
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Reviews & Comments</h2>
          <p className={styles.summary}>
            {reviews.length} review{reviews.length === 1 ? "" : "s"} - Average rating {average || 0}
          </p>
        </div>

        <FavoriteButton
          businessId={businessId}
          name={businessName}
          source="business"
          href={href || `/business/${businessId}`}
        />
      </div>

      {user ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="rating">
            Rating
          </label>
          <div className={styles.formRow}>
            <select
              id="rating"
              className={styles.select}
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
            </select>
            <span className={styles.helper}>Share your experience.</span>
          </div>

          <textarea
            className={styles.textarea}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write your review..."
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton}>
              Post review
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setComment("")}>
              Clear
            </button>
          </div>
        </form>
      ) : (
        <p className={styles.helper}>
          <Link href="/login">Login</Link> to post a review and save favorites.
        </p>
      )}

      <div className={styles.list}>
        {reviews.length === 0 ? (
          <p className={styles.helper}>No reviews yet. Be the first to add one.</p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span>{review.userLabel}</span>
                <span className={styles.rating}>{review.rating} / 5</span>
              </div>
              <p className={styles.comment}>{review.comment}</p>

              <div className={styles.commentList}>
                {(review.comments || []).map((c) => (
                  <div key={c.id} className={styles.commentItem}>
                    <div className={styles.cardHeader}>
                      <span>{c.userLabel}</span>
                      <span className={styles.helper}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className={styles.comment}>{c.text}</p>
                  </div>
                ))}
              </div>

              <div className={styles.commentForm}>
                {user ? (
                  <>
                    <input
                      className={styles.select}
                      value={commentInputs[review.id] || ""}
                      onChange={(e) => handleCommentChange(review.id, e.target.value)}
                      placeholder="Reply to this review"
                    />
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() => handleAddComment(review.id)}
                    >
                      Reply
                    </button>
                  </>
                ) : (
                  <p className={styles.helper}>
                    <Link href="/login">Login</Link> to reply to reviews.
                  </p>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
