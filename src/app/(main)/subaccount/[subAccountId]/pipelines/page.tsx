import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface PipelineProps {
  params: {
    subAccountId: string;
  };
}

const Pipelines = async ({ params }: PipelineProps) => {
  const pipelineExists = await db.pipeline.findFirst({
    where: {
      subAccountId: params.subAccountId,
    },
  });

  if (pipelineExists)
    return redirect(
      `/subaccount/${params.subAccountId}/pipelines/${pipelineExists.id}`
    );

  try {
    const response = await db.pipeline.create({
      data: { name: "Primeira pipeline", subAccountId: params.subAccountId },
    });
    return redirect(
      `/subaccount/${params.subAccountId}/pipelines/${response.id}`
    );
  } catch (error) {
    console.error(error);
  }


};

export default Pipelines;
