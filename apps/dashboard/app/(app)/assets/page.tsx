import AssetList from "@/components/assets/AssetList";
import NewAssetModal from "@/components/assets/AssetModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Assets() {
  await checkAuth();
  const { assets } = await api.assets.getAssets.query();  

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Assets</h1>
        <NewAssetModal />
      </div>
      <AssetList assets={assets} />
    </main>
  );
}
