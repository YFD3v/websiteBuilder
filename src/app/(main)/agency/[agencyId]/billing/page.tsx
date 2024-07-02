import React from "react";
import { stripe } from "@/lib/stripe";
import { addOnProducts, pricingCards } from "@/lib/constants";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import PricingCard from "./_components/pricing-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";
interface BillingPageProps {
  params: { agencyId: string };
}

const BillingPage = async ({ params }: BillingPageProps) => {
  //CHALLENGE CREATE THE ADD ON PRODUCTS
  const addOns = await stripe.products.list({
    ids: addOnProducts.map((product) => product.id),
    expand: ["data.default_price"],
  });

  const agencySubscription = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    select: {
      customerId: true,
      Subscription: true,
    },
  });

  const prices = await stripe.prices.list({
    product: process.env.NEXT_PLURA_PRODUCT_ID,
    active: true,
  });

  const currentPlanDetails = pricingCards.find(
    (c) => c.priceId === agencySubscription?.Subscription?.priceId
  );

  const charges = await stripe.charges.list({
    limit: 50,
    customer: agencySubscription?.customerId,
  });

  const allCharges = [
    ...charges.data.map((charge) => ({
      description: charge.description,
      id: charge.id,
      date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(
        charge.created * 1000
      ).toLocaleDateString()}`,
      status: "Paid",
      amount: `$${charge.amount / 100}`,
    })),
  ];
  console.log(agencySubscription);
  return (
    <>
      <h1 className="text-4xl p-4">Cobrança</h1>
      <Separator className="mb-6" />
      <h2 className="text-2xl p-4">Plano Atual</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          planExists={agencySubscription?.Subscription?.active === true}
          prices={prices.data}
          customerId={agencySubscription?.customerId || ""}
          amt={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.price || "R$0"
              : "R$0"
          }
          buttonCta={
            agencySubscription?.Subscription?.active === true
              ? "Mudar plano"
              : "Iniciar"
          }
          highlightDescription="Quer modificar seu plano? Você pode fazer isso aqui. Se você tem
          mais perguntas entre em contato com support@plura-app.com"
          highlightTitle="Opções do plano"
          description={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.description || "Vamos começar"
              : "Vamos começar! Escolha um plano que funcione melhor para você."
          }
          duration="/mês"
          features={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.features || []
              : currentPlanDetails?.features ||
                pricingCards.find((pricing) => pricing.title === "Iniciante")
                  ?.features ||
                []
          }
          title={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.title || "Iniciante"
              : "Iniciante"
          }
        />
        {addOns.data.map((addOn) => (
          <PricingCard
            planExists={agencySubscription?.Subscription?.active === true}
            prices={prices.data}
            customerId={agencySubscription?.customerId || ""}
            key={addOn.id}
            amt={
              //@ts-ignore
              addOn.default_price?.unit_amount
                ? //@ts-ignore
                  `R$${addOn.default_price.unit_amount / 100}`
                : "R$0"
            }
            buttonCta="Inscreva-se"
            description="Linha de suporte dedicada e canal de equipes para suporte"
            duration="/mês"
            features={[]}
            title={"Suporte Prioritário 24/7"}
            highlightTitle="Obtenha suporte agora!"
            highlightDescription="Obtenha suporte prioritário e pule o longo prazo com o clique de um botão."
          />
        ))}
      </div>
      <h2 className="text-2xl p-4">Histórico de Pagamento</h2>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Descrição</TableHead>
            <TableHead className="w-[200px]">Id da fatura</TableHead>
            <TableHead className="w-[300px]">Data</TableHead>
            <TableHead className="w-[200px]">Pago</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allCharges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>
                {charge.description === "Subscription creation"
                  ? "Criação da Inscrição"
                  : charge.description}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {charge.id}
              </TableCell>
              <TableCell>{charge.date}</TableCell>
              <TableCell>
                <p
                  className={clsx("", {
                    "text-emerald-500": charge.status.toLowerCase() === "paid",
                    "text-orange-600":
                      charge.status.toLowerCase() === "pending",
                    "text-red-600": charge.status.toLowerCase() === "failed",
                  })}
                >
                  {charge.status.toLowerCase() === "paid" && "PAGO"}
                  {charge.status.toLowerCase() === "pending" && "PENDENTE"}
                  {charge.status.toLowerCase() === "failed" && "FALHOU"}
                </p>
              </TableCell>
              <TableCell className="text-right">{charge.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default BillingPage;
