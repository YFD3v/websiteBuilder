import BlurPage from "@/components/global/blur-page";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from "@/lib/db";
import { Contact, SubAccount, Ticket } from "@prisma/client";
import { format } from "date-fns";
import CreateContactButton from "./_components/create-contact-button";

interface SubAccountContactPageProps {
  params: {
    subAccountId: string;
  };
}

const SubAccountContactPage = async ({
  params,
}: SubAccountContactPageProps) => {
  type SubAccountWithContacts = SubAccount & {
    Contact: (Contact & { Ticket: Ticket[] })[];
  };

  const contacts = (await db.subAccount.findUnique({
    where: {
      id: params.subAccountId,
    },
    include: {
      Contact: {
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })) as SubAccountWithContacts;

  const allContacts = contacts.Contact;

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets || !tickets.length) return "R$0.00";
    const amt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "BRL",
    });

    const laneAmt = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket.value) || 0),
      0
    );
    return amt.format(laneAmt);
  };

  return (
    <BlurPage>
      <h1 className="text-4xl p-4">Contatos</h1>
      <CreateContactButton subAccountId={params.subAccountId} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead className="w-[300px]">E-mail</TableHead>
            <TableHead className="w-[200px]">Ativo</TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback className="bg-primary text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {formatTotal(contact.Ticket) === 'R$0.00' ? (
                  <Badge variant={'destructive'}>Inativo</Badge>
                ) : (
                  <Badge className="bg-emerald-700">Ativo</Badge>
                )}
              </TableCell>
              <TableCell>{format(contact.createdAt, 'MM/dd/yyyy')}</TableCell>
              <TableCell className="text-right">
                {formatTotal(contact.Ticket)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlurPage>
  );
};

export default SubAccountContactPage;
