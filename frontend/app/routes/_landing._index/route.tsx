import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import searchMonkeySvg from "~/assets/images/search-monkey.svg";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { TooltipProvider } from "~/components/ui/tooltip";
import { clientLoader } from "./client_loader";
import StoreTable from "./store_table";
import NearExpiredFoodTable from "./near_expired_food_table";
import { BookmarkProvider, HasBookmarkedButton } from "./bookmark";
import LocateToggle from "./locate_toggle";
import StoreList from "./store_list";

export { loader } from "./loader";
export { clientLoader } from "./client_loader";
export { action } from "./action";

export const meta: MetaFunction = () => {
  return [
    { title: "首頁 | The Overload Of Beggars 乞丐超人" },
    //
  ];
};

export default function Index() {
  const data = useLoaderData<typeof clientLoader>();
  const filteredStores = data?.stores.filter((store) => store !== null) ?? [];
  return (
    <BookmarkProvider>
      <div className="max-w-screen-lg mx-auto px-4 md:px-8 pt-4 md:pt-8 md:pb-8">
        <div className="flex gap-4">
          <Form className="flex gap-4 flex-1">
            <Input
              type="search"
              name="keyword"
              defaultValue={data?.query.keyword ?? ""}
              placeholder="搜尋 店名 / 地址"
              autoComplete="off"
            />

            <Button type="submit">送出</Button>

            {data?.query.location && (
              <input
                type="hidden"
                name="location"
                value={data.query.location}
              />
            )}
          </Form>

          <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-4 md:static md:flex-row">
            <Form className="w-12 h-12 md:w-auto md:h-auto">
              <LocateToggle />

              {data?.query.keyword && (
                <input
                  type="hidden"
                  name="keyword"
                  value={data.query.keyword}
                />
              )}
            </Form>

            <HasBookmarkedButton />
          </div>
        </div>

        {/* display the nearby stores and their near expired foods */}
        <TooltipProvider>
          <div className="mt-4 pt-4 overflow-auto max-h-[80vh]">
            <div className="block md:hidden">
              <StoreList
                data={filteredStores}
                expanded={data?.query.stores ?? undefined}
                renderSubComponent={(store) => {
                  const found = data?.storesWithNearExpiredFoods?.find(
                    (item) => item.storeid === store.id
                  );
                  return (
                    <NearExpiredFoodTable
                      data={found?.nearExpiredFoods ?? []}
                    />
                  );
                }}
              />
            </div>

            <div className="hidden md:block">
              <StoreTable
                data={filteredStores}
                expanded={data?.query.stores ?? undefined}
                renderSubComponent={(store) => {
                  const found = data?.storesWithNearExpiredFoods?.find(
                    (item) => item.storeid === store.id
                  );
                  return (
                    <div
                      className="-mt-32 pt-32"
                      ref={(ref) => ref?.scrollIntoView({ behavior: "smooth" })}
                    >
                      <NearExpiredFoodTable
                        data={found?.nearExpiredFoods ?? []}
                      />
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </TooltipProvider>

        {data?.query.keyword && filteredStores.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <img src={searchMonkeySvg} width={186} height={174} alt="monkey" />
            <p className="text-xl">這家店在哪？猴子都找不到</p>
            <p className="text-sm">請換個關鍵字或移除篩選條件</p>
          </div>
        )}
      </div>
    </BookmarkProvider>
  );
}
