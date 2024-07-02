"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Funnel, Lane, Pipeline } from "@prisma/client";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import Loading from "../global/loading";
import { LaneFormSchema } from "@/lib/types";
import {
  getPipelineDetails,
  saveActivityLogsNotification,
  upsertFunnel,
  upsertLane,
  upsertPipeline,
} from "@/lib/queries";
import { v4 } from "uuid";
import { toast } from "../ui/use-toast";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateLaneFormProps {
  defaultData?: Lane;
  pipelineId: string;
}

const CreateLaneForm: React.FC<CreateLaneFormProps> = ({
  defaultData,
  pipelineId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof LaneFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(LaneFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
    if (!pipelineId) return;
    try {
      const response = await upsertLane({
        ...values,
        id: defaultData?.id,
        pipelineId: pipelineId,
        order: defaultData?.order,
      });
      const d = await getPipelineDetails(pipelineId);
      if (!d) return;

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Atualizou a lane | ${response?.name}`,
        subAccountId: d.subAccountId,
      });

      toast({
        title: "Sucesso",
        description: "Detalhes da pipeline salvos",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Opps!",
        description: "Não foi possíível salvar os dados",
      });
    }
    setClose();
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Detalhes da Pista</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da pista</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Salvar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateLaneForm;
