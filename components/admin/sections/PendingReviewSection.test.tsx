import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PendingReviewSection from "./PendingReviewSection";

const COLUMNS = [
  { key: "name", label: "Business" },
  { key: "city", label: "City" },
  { key: "type", label: "Category" },
  { key: "submitted", label: "Submitted" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

describe("PendingReviewSection", () => {
  it("includes preview and public view actions in dropdown", async () => {
    const user = userEvent.setup();
    const sample = {
      id: "biz-2",
      name: "Pending Biz",
      city: "Here",
      businessType: "Retail",
      createdAt: "2023-01-01T00:00:00Z",
    } as any;

    render(
      <PendingReviewSection
        loadingData={false}
        filteredCount={1}
        pendingSearch=""
        setPendingSearch={vi.fn()}
        pendingCityFilter="all"
        setPendingCityFilter={vi.fn()}
        pendingCities={[]}
        rows={[sample]}
        columns={COLUMNS}
        busyKey={null}
        onApproveRequest={vi.fn()}
        onDeleteRequest={vi.fn()}
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
        formatDateTime={(val) => String(val)}
      />
    );

    const actionBtn = screen.getByRole("button", { name: /actions/i });
    expect(actionBtn).toBeInTheDocument();

    await user.click(actionBtn);

    expect(screen.getByRole("button", { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view site/i })).toBeInTheDocument();
  });
});
