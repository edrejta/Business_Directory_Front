import { DealsCategoryPage } from "@/components/deals/DealsCategoryPage";

export default async function FlashSalesPage() {
  return DealsCategoryPage({ title: "Flash Sales", category: "FlashSales" });
}
