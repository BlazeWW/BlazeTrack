import TrackingTypeList from "@/components/trackingTypes/TrackingTypeList";
import NewTrackingTypeModal from "@/components/trackingTypes/TrackingTypeModal";
import { api } from "@/lib/trpc/api";

export default async function TrackingTypes() {
  const { trackingTypes } = await api.trackingTypes.getTrackingTypes.query();  

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Tracking Types</h1>
        <NewTrackingTypeModal />
      </div>
      <TrackingTypeList trackingTypes={trackingTypes} />
    </main>
  );
}
