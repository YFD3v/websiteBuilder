Esse projeto utiliza clerk - //https://clerk.com/docs/quickstarts/nextjs
//TODO: Voltar o vídeo e rever a parte do stripe.
/*

   O que está acontecendo é que a subscription é criada normalmente ou seja o route do create-subscription está funcionando normalmente. Porém o webhook aparenta não está sendo chamado, já que os consoles.log não aparecem. A subscription ela é criada no painel do stripe, o registro de pagamento aparece na tela do site, porém, a agency retorna uma subscription null o que indica que o upsert do stripe-actions não está funcionando levando para o webhook que é onde essa action é chamada. Portanto, acredito que o problema seja que o webhook (ele que faz a conexão do stripe com back-end, certo?) por algum motivo não steja funcionando.
   Portanto, acredito que o problema esteja localizado no webhook ou em alguma parte do front-end.

*/

https://dashboard.stripe.com/test/customers/cus_QH8PD9QETAd6OB
https://dashboard.stripe.com/test/webhooks
Tente ver o prisma studio

Importante 'ouvir' o webhook
stripe listen --forward-to localhost:3000/api/stripe/webhook