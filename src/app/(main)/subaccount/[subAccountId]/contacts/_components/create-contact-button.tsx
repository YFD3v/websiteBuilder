"use client";

import ContactUserForm from "@/components/forms/contact-user-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";

interface CreateContactButtonProps {
  subAccountId: string;
}

const CreateContactButton = ({ subAccountId }: CreateContactButtonProps) => {
  const { setOpen } = useModal();

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal title="Criar Contato" subheading="">
        <ContactUserForm subAccountId={subAccountId} />
      </CustomModal>
    );
  };

  return <Button onClick={handleCreateContact}>Criar Contato</Button>;
};

export default CreateContactButton;
