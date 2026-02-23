"use client";

import type { Category } from "@/lib/api/admin";
import DataTable, { type DataColumn } from "@/components/admin/DataTable";
import SectionCard from "@/components/admin/SectionCard";

type CategoriesSectionProps = {
  loadingData: boolean;
  categories: Category[];
  columns: DataColumn[];
};

export default function CategoriesSection({ loadingData, categories, columns }: CategoriesSectionProps) {
  return (
    <SectionCard title="Categories" subtitle="Business count by category">
      <DataTable columns={columns} loading={loadingData} empty={categories.length === 0} emptyMessage="No categories found.">
        {categories.map((entry, index) => (
          <tr key={`${entry.id}-${index}`}>
            <td>{entry.name}</td>
            <td>{entry.businessesCount ?? "-"}</td>
          </tr>
        ))}
      </DataTable>
    </SectionCard>
  );
}
