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
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact } from "@prisma/client";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { saveActivityLogsNotification, upsertContact } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/providers/modal-provider";
import { ContactUserFormSchema } from "@/lib/types";
import { useEffect } from "react";

interface ContactUserFormProps {
  subAccountId: string;
  defaultData?: Contact;
}

const ContactUserForm = ({
  subAccountId,
  defaultData,
}: ContactUserFormProps) => {
  const { setClose, data } = useModal();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(ContactUserFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
      email: defaultData?.email || "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data.contact) {
      form.reset(data.contact);
    }
  }, [data, form.reset]);

  const onSubmit = async (values: z.infer<typeof ContactUserFormSchema>) => {
    if (!subAccountId) return;
    try {
      const response = await upsertContact({
        email: values.email,
        subAccountId,
        name: values.name,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Atualizou um contato | ${response?.name}`,
        subAccountId,
      });

      toast({
        title: "Sucesso",
        description:  "O contato foi salvo com sucesso",
      });

      router.refresh();
     
    } catch (error) {
      console.error(error);
      toast({
         title: "Falhou",
         description: "Não foi possível salvar o contato",
       });
    }
    setClose();
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Detalhes do Contato</CardTitle>
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
                  <FormLabel>Nome do contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do contato</FormLabel>
                  <FormControl>
                    <Input placeholder="E-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Salvar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactUserForm;
