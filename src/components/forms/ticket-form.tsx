"use client";
import {
  getSubAccountTeamMembers,
  saveActivityLogsNotification,
  searchContacts,
  upsertTicket,
} from "@/lib/queries";
import { TicketFormSchema, TicketWithTags } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Tag, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast, useToast } from "../ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckIcon, ChevronsUpDownIcon, User2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import Loading from "../global/loading";
import TagCreator from "../global/tag-creator";

interface TicketFormProps {
  laneId: string;
  subAccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
}

const TicketForm = ({
  getNewTicket,
  laneId,
  subAccountId,
}: TicketFormProps) => {
  const { data: defaultData, setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [assignedTo, setAssignedTo] = useState(
    defaultData?.ticket?.Assigned?.id || ""
  );
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name || "",
      description: defaultData.ticket?.description || "",
      value: String(defaultData.ticket?.value || 0),
    },
  });
  const isLoading = form.formState.isSubmitting;
  useEffect(() => {
    console.log(subAccountId);
    if (subAccountId) {
      const fetchData = async () => {
        const response = await getSubAccountTeamMembers(subAccountId);
        console.log("Team memebers", response);
        if (response) setAllTeamMembers(response);
      };
      fetchData();
    }
  }, [subAccountId]);

  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || "",
        description: defaultData.ticket?.description || "",
        value: String(defaultData.ticket?.value || 0),
      });
      if (defaultData.ticket.customerId)
        setContact(defaultData.ticket.customerId);

      const fetchData = async () => {
        const response = await searchContacts(
          //@ts-ignore
          defaultData.ticket?.Customer?.name
        );
        setContactList(response);
      };
      fetchData();
    }
  }, [defaultData]);

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;
    try {
      const response = await upsertTicket(
        {
          ...values,
          laneId,
          id: defaultData.ticket?.id,
          assignedUserId: assignedTo,
          ...(contact ? { customerId: contact } : {}),
        },
        tags
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Atualizou um ingresso | ${response?.name}`,
        subAccountId,
      });

      toast({
        title: "Sucesso",
        description: "Detalhes salvos",
      });
      if (response) getNewTicket(response);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Opps!",
        description: "Não foi possível salvar os detalhes da pipeline",
      });
    }
    setClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detalhes do Ingresso</CardTitle>
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
                  <FormLabel>Nome do Ingresso</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Ingresso</FormLabel>
                  <FormControl>
                    <Input placeholder="Valor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3>Adicionar tags</h3>
            <TagCreator
              subAccountId={subAccountId}
              getSelectedTags={setTags}
              defaultTags={defaultData.ticket?.Tags || []}
            />
            <FormLabel>Atribuído a uma equipe de membros</FormLabel>
            <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage alt="contact" />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        Não atribuído
                      </span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers.map((teamMember) => (
                  <SelectItem key={teamMember.id} value={teamMember.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage alt="contact" src={teamMember.avatarUrl} />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        {teamMember.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormLabel>Cliente</FormLabel>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {contact
                    ? contactList.find((c) => c.id === contact)?.name
                    : "Selecione um cliente..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Procure..."
                    className="h-9"
                    value={search}
                    onChangeCapture={async (value) => {
                      //@ts-ignore
                      setSearch(value.target.value);
                      if (saveTimerRef.current)
                        clearTimeout(saveTimerRef.current);
                      saveTimerRef.current = setTimeout(async () => {
                        const response = await searchContacts(
                          //@ts-ignore
                          value.target.value
                        );
                        setContactList(response);
                        setSearch("");
                      }, 1000);
                    }}
                  />
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {contactList.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.id}
                          onSelect={(currentValue) => {
                            setContact(
                              currentValue === contact ? "" : currentValue
                            );
                          }}
                        >
                          {c.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              contact === c.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Salvar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;