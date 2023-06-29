/* eslint-disable react/no-unescaped-entities */
import QueueTable from "@/components/tables/QueueTable";
import GlobalContainer from "../GlobalContainer";

export default function HomePage() {
  return (
    <GlobalContainer>
      <QueueTable />
    </GlobalContainer>
  );
}
