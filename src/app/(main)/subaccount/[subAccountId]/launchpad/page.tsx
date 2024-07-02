import BlurPage from '@/components/global/blur-page'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/lib/db'
// import { stripe } from '@/lib/stripe'
// import { getStripeOAuthLink } from '@/lib/utils'
import { CheckCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface LaunchPadPageProps {
  searchParams: {
    state: string;
    code: string;
  };
  params: {
    subAccountId: string;
  };
}

const LaunchPadPage = async ({ params, searchParams }: LaunchPadPageProps) => {
  const subAccountDetails = await db.subAccount.findUnique({
    where: {
      id: params.subAccountId,
    },
  });

  if(!subAccountDetails) return;

  const allDetailsExist =
    subAccountDetails.address &&
    subAccountDetails.subAccountLogo &&
    subAccountDetails.city &&
    subAccountDetails.companyEmail &&
    subAccountDetails.companyPhone &&
    subAccountDetails.country &&
    subAccountDetails.name &&
    subAccountDetails.state

    //WIP: Wire up stripe

  return <BlurPage>     <div className="flex flex-col justify-center items-center">
  <div className="w-full h-full max-w-[800px]">
    <Card className="border-none ">
      <CardHeader>
        <CardTitle>Vamos começar!</CardTitle>
        <CardDescription>
          Siga os passos abaixos para configurar sua conta corretamente!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg ">
          <div className="flex items-center gap-4">
            <Image
              src="/appstore.png"
              alt="App logo"
              height={80}
              width={80}
              className="rounded-md object-contain"
            />
            <p>Salve o site como um atalho no seu dispositivo móvel</p>
          </div>
          <Button>Iniciar</Button>
        </div>
        <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Image
              src="/stripelogo.png"
              alt="App logo"
              height={80}
              width={80}
              className="rounded-md object-contain "
            />
            <p>
            Conecte sua conta stripe para aceitar pagamentos. Listra é
              usado para executar pagamentos.
            </p>
          </div>
          {/* {subAccountDetails.connectAccountId ||
          connectedStripeAccount ? (
            <CheckCircleIcon
              size={50}
              className=" text-primary p-2 flex-shrink-0"
            />
          ) : (
            <Link
              className="bg-primary py-2 px-4 rounded-md text-white"
              href={stripeOAuthLink}
            >
              Iniciar
            </Link>
          )} */}
        </div>
        <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Image
              src={subAccountDetails.subAccountLogo}
              alt="App logo"
              height={80}
              width={80}
              className="rounded-md object-contain p-4"
            />
            <p>Preencha todos os detalhes do seu negócio</p>
          </div>
          {allDetailsExist ? (
            <CheckCircleIcon
              size={50}
              className=" text-primary p-2 flex-shrink-0"
            />
          ) : (
            <Link
              className="bg-primary py-2 px-4 rounded-md text-white"
              href={`/subaccount/${subAccountDetails.id}/settings`}
            >
              Iniciar
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
</div></BlurPage>;
};

export default LaunchPadPage;
