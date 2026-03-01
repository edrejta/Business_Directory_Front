import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BusinessSuspensionSection from "./BusinessSuspensionSection";

const COLUMNS = [
  { key: "name", label: "Business" },
  { key: "city", label: "City" },
  { key: "type", label: "Category" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

// minimal shape of an approved business entry for tests
interface TestBusiness {
  id: string;
  name: string;
  city?: string;
  businessType?: string;
}

describe("BusinessSuspensionSection", () => {
  it("shows actions dropdown with view and suspend options", async () => {
    const user = userEvent.setup();
    const sample: TestBusiness = {
      id: "biz-1",
      name: "Sample Biz",
      city: "TestCity",
      businessType: "Food",
    };

    render(
      <BusinessSuspensionSection
        loadingData={false}
        approvedSearch=""
        setApprovedSearch={vi.fn()}
        approvedCityFilter="all"
        setApprovedCityFilter={vi.fn()}
        approvedCities={[]}
        rows={[sample]}
        columns={COLUMNS}
        busyKey={null}
        onSuspendRequest={vi.fn()}
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    const actionBtn = screen.getByRole("button", { name: /actions/i });
    expect(actionBtn).toBeInTheDocument();

    await user.click(actionBtn);

    expect(screen.getByRole("button", { name: /view site/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /suspend/i })).toBeInTheDocument();
  });
});
