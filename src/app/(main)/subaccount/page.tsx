import Unauthorized from "@/components/unauthorized/page";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";

interface SubAccountMainPageProps {
  searchParams: {
    state: string;
    code: string;
  };
}

const SubAccountMainPage = async ({
  searchParams,
}: SubAccountMainPageProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) return <Unauthorized />;

  const user = await getAuthUserDetails();
  if (!user) return;

  const getFirstSubAccountWithAcces = user.Permissions.find(
    (permission) => permission.access === true
  );

  if (searchParams.state) {
    const statePath = searchParams.state.split("___")[0];
    const stateSubAccountID = searchParams.state.split("___")[1];
    if (!stateSubAccountID) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubAccountID}/${statePath}?code=${searchParams.code}`
    );
  }

  if (getFirstSubAccountWithAcces) {
    return redirect(`/subaccount/${getFirstSubAccountWithAcces.subAccountId}`);
  }
  return <Unauthorized />;
};

export default SubAccountMainPage;
