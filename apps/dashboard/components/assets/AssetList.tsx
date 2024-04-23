"use client";
import { CompleteAsset } from "@/lib/db/schema/assets";
import { trpc } from "@/lib/trpc/client";
import AssetModal from "./AssetModal";


export default function AssetList({ assets }: { assets: CompleteAsset[] }) {
  const { data: a } = trpc.assets.getAssets.useQuery(undefined, {
    initialData: { assets },
    refetchOnMount: false,
  });

  if (a.assets.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {a.assets.map((asset) => (
        <Asset asset={asset} key={asset.id} />
      ))}
    </ul>
  );
}

const Asset = ({ asset }: { asset: CompleteAsset }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{asset.regNr}</div>
      </div>
      <AssetModal asset={asset} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No assets
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new asset.
      </p>
      <div className="mt-6">
        <AssetModal emptyState={true} />
      </div>
    </div>
  );
};

