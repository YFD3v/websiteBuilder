"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plan } from "@prisma/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

interface SubscriptionFormProps {
  selectedPriceId: string | Plan;
}

const SubscriptionForm = ({ selectedPriceId }: SubscriptionFormProps) => {
  const { toast } = useToast();
  const elements = useElements();
  const stripeHook = useStripe();
  const [priceError, setPriceError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPriceId) {
      setPriceError("Você precisa selecionar um plano para inscrever-se");
      return;
    }
    setPriceError("");
    if (!stripeHook || !elements) return;

    try {
      alert("confirmando");
      const { error } = await stripeHook.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
        },
      });

      if (error) {
        throw new Error();
      }
      alert("confirmado");
      toast({
        title: "Pagamento realizado com sucesso",
        description: "Seu pagamento foi processado com sucesso. ",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Pagamento Falhou",
        description:
          "Nós não podemos processar seu pagamento. Por favor tente com um cartão diferente.",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <small className="text-destructive">{priceError}</small>
      <PaymentElement />
      <Button disabled={!stripeHook} className="mt-4 w-full">
        Enviar
      </Button>
    </form>
  );
};

export default SubscriptionForm;
