"use client";
import { CompleteDriver } from "@/lib/db/schema/drivers";
import { trpc } from "@/lib/trpc/client";
import DriverModal from "./DriverModal";


export default function DriverList({ drivers }: { drivers: CompleteDriver[] }) {
  const { data: d } = trpc.drivers.getDrivers.useQuery(undefined, {
    initialData: { drivers },
    refetchOnMount: false,
  });

  if (d.drivers.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {d.drivers.map((driver) => (
        <Driver driver={driver} key={driver.id} />
      ))}
    </ul>
  );
}

const Driver = ({ driver }: { driver: CompleteDriver }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{driver.name}</div>
      </div>
      <DriverModal driver={driver} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No drivers
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new driver.
      </p>
      <div className="mt-6">
        <DriverModal emptyState={true} />
      </div>
    </div>
  );
};

