import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Acesso não autorizado!</h1>
      <p>
        Por favor entre em contato com o suporte ou o dono da agência para
        ganhar acesso.
      </p>
      <Link href="/" className="mt-4 bg-primary p-2">
        Voltar para o início
      </Link>
    </div>
  );
};

export default Unauthorized;
