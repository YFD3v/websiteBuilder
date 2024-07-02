import {
  getLanesWithTicketAndTags,
  getPipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
} from "@/lib/queries";
import Pipelines from "../page";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { LaneDetail } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PipelineInfobar from "../_components/pipeline-infobar";
import PipelineSettings from "../_components/pipeline-settings";
import PipelineView from "../_components/pipeline-view";

interface PipelinePageProps {
  params: {
    subAccountId: string;
    pipelineId: string;
  };
}

const PipelinePage = async ({ params }: PipelinePageProps) => {
  const pipelineDetails = await getPipelineDetails(params.pipelineId);

  if (!pipelineDetails)
    return redirect(`/subaccount/${params.subAccountId}/pipelines`);

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subAccountId },
  });

  const lanes = (await getLanesWithTicketAndTags(
    params.pipelineId
  )) as LaneDetail[];

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfobar
          pipelineId={params.pipelineId}
          subAccountId={params.subAccountId}
          pipelines={pipelines}
        />
        <div>
          <TabsTrigger value="view">Visualização da Pipeline </TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes}
          pipelineDetails={pipelineDetails}
          pipelineId={params.pipelineId}
          subAccountId={params.subAccountId}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={params.pipelineId}
          pipelines={pipelines}
          subAccountId={params.subAccountId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PipelinePage;
