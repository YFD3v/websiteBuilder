'use client'

import { useModal } from "@/providers/modal-provider";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../forms/upload-media";

interface MediaUploadButtonProps{
   subAccountId: string
}

const MediaUploadButton = ({subAccountId}: MediaUploadButtonProps) => {
   const {isOpen, setOpen, setClose} = useModal()
   return ( <Button onClick={() => {
      setOpen(<CustomModal title="Carregar Media" subheading="Carrege um arquivo apra seu Media Bucket">
         <UploadMediaForm subAccountId={subAccountId} />
      </CustomModal>)
   }}>Carregar</Button> );
}
 
export default MediaUploadButton;