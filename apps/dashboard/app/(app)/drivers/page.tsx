import DriverList from "@/components/drivers/DriverList";
import NewDriverModal from "@/components/drivers/DriverModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Drivers() {
  await checkAuth();
  const { drivers } = await api.drivers.getDrivers.query();  

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Drivers</h1>
        <NewDriverModal />
      </div>
      <DriverList drivers={drivers} />
    </main>
  );
}
