import { GetMediaFiles } from "@/lib/types";
import MediaUploadButton from "./upload-button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import MediaCard from "./media-card";
import { FolderSearch } from "lucide-react";

interface MediaComponnentProps {
  data: GetMediaFiles;
  subAccountId: string;
}

const MediaComponnent = ({ data, subAccountId }: MediaComponnentProps) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex justify-between items-cente">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton subAccountId={subAccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Pesquise o nome do arquivo" />
        <CommandList className="pb-40 max-h-full">
          <CommandEmpty>Não existem arquivos</CommandEmpty>
          <CommandGroup>
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media.map((file) => (
                <CommandItem
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                  key={file.id}
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Vazio! Sem arquivos para mostrar.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponnent;
