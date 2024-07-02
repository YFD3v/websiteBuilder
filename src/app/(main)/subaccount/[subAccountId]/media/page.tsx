import BlurPage from "@/components/global/blur-page";
import MediaComponnent from "@/components/media";
import { getMedia } from "@/lib/queries";

interface MediaPageProps {
  params: {
    subAccountId: string;
  };
}

const MediaPage = async ({ params }: MediaPageProps) => {
  const data = await getMedia(params.subAccountId);

  return (
    <BlurPage>
      <MediaComponnent data={data} subAccountId={params.subAccountId} />
    </BlurPage>
  );
};

export default MediaPage;
