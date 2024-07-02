interface SubAccountPageIdProps {
  params: {
    subAccountId: string;
  };
}

const SubAccountPageId = ({ params }: SubAccountPageIdProps) => {
  console.log(params);
  return <div>SubaccountPageId {params.subAccountId}</div>;
};

export default SubAccountPageId;
