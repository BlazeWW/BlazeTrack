"use client";

import { TrackingType, NewTrackingTypeParams, insertTrackingTypeParams } from "@/lib/db/schema/trackingTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TrackingTypeForm = ({
  trackingType,
  closeModal,
}: {
  trackingType?: TrackingType;
  closeModal?: () => void;
}) => {
  
  const editing = !!trackingType?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertTrackingTypeParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertTrackingTypeParams),
    defaultValues: trackingType ?? {
      name: ""
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
        if (data?.error) {
      toast.error(data.error)
      return;
    }

    await utils.trackingTypes.getTrackingTypes.invalidate();
    router.refresh();
    if (closeModal) closeModal();
        toast.success(`Tracking Type ${action}d!`);
  };

  const { mutate: createTrackingType, isLoading: isCreating } =
    trpc.trackingTypes.createTrackingType.useMutation({
      onSuccess: (res) => onSuccess("create"),
      onError: (err) => onError("create", { error: err.message }),
    });

  const { mutate: updateTrackingType, isLoading: isUpdating } =
    trpc.trackingTypes.updateTrackingType.useMutation({
      onSuccess: (res) => onSuccess("update"),
      onError: (err) => onError("update", { error: err.message }),
    });

  const { mutate: deleteTrackingType, isLoading: isDeleting } =
    trpc.trackingTypes.deleteTrackingType.useMutation({
      onSuccess: (res) => onSuccess("delete"),
      onError: (err) => onError("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewTrackingTypeParams) => {
    if (editing) {
      updateTrackingType({ ...values, id: trackingType.id });
    } else {
      createTrackingType(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<FormItem>
              <FormLabel>Name</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteTrackingType({ id: trackingType.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default TrackingTypeForm;
