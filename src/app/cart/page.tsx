import { redirect } from "next/navigation";
import { PRODUCT_PAGE_URL } from "@/lib/product-data";

/** Cart removed for single-product flow; keep URL stable for old links. */
export default function CartPage() {
  redirect(PRODUCT_PAGE_URL);
}
