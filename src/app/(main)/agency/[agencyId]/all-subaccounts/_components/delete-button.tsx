"use client";

import {
  deleteSubAccount,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  subAccountId: string;
}

const DeleteButton = ({ subAccountId }: DeleteButtonProps) => {
  const router = useRouter();
  return (
    <div
      onClick={async () => {
        const response = await getSubaccountDetails(subAccountId);
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Subconta excluida | ${response?.name}`,
          subAccountId,
        });
        await deleteSubAccount(subAccountId);
        router.refresh();
      }}
    >
      Excluir subconta
    </div>
  );
};

export default DeleteButton;
