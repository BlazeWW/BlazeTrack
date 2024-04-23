"use client";
import { CompleteTrackingType } from "@/lib/db/schema/trackingTypes";
import { trpc } from "@/lib/trpc/client";
import TrackingTypeModal from "./TrackingTypeModal";


export default function TrackingTypeList({ trackingTypes }: { trackingTypes: CompleteTrackingType[] }) {
  const { data: t } = trpc.trackingTypes.getTrackingTypes.useQuery(undefined, {
    initialData: { trackingTypes },
    refetchOnMount: false,
  });

  if (t.trackingTypes.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {t.trackingTypes.map((trackingType) => (
        <TrackingType trackingType={trackingType} key={trackingType.id} />
      ))}
    </ul>
  );
}

const TrackingType = ({ trackingType }: { trackingType: CompleteTrackingType }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{trackingType.name}</div>
      </div>
      <TrackingTypeModal trackingType={trackingType} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No tracking types
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new tracking type.
      </p>
      <div className="mt-6">
        <TrackingTypeModal emptyState={true} />
      </div>
    </div>
  );
};

