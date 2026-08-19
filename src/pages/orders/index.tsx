import { Page } from "@/components";
import { useDocumentTitle } from "@/hooks";

export default function OrdersPage() {
  useDocumentTitle("我的订单");

  return (
    <Page className="bg-[#f8f8f8]">
      <Page.Header title="我的订单" backTo="/profile" />
      <Page.Content>
        <div className="grid min-h-[60dvh] place-items-center px-6 text-center">
          <div>
            <div className="mx-auto grid size-14 place-items-center rounded-lg bg-white text-stone-400 shadow-sm">
              <span className="icon-[lucide--receipt-text] size-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-stone-900">暂无订单</h2>
            <p className="mt-2 text-sm text-stone-500">
              完成点餐后，订单进度会显示在这里
            </p>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
}
