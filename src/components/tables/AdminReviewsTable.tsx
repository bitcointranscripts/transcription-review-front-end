import { Flex, Text } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";
import { AdminReview } from "@/services/api/admin/useReviews";
import { GroupedLinks } from "./TableItems";

const tableStructure = [
  {
    name: "id",
    type: "text-short",
    modifier: (data) => data.id,
  },
  {
    name: "transcript name",
    type: "text-long",
    modifier: (data) => data.transcript.content.title,
  },
  {
    name: "username",
    type: "text-short",
    modifier: (data) => data.user.githubUsername,
  },
  {
    name: "status",
    type: "text-short",
    modifier: (data) => data.transcript.status,
  },
  { name: "Claim Date", type: "date", modifier: (data) => data.createdAt },
  { name: "Updated At", type: "date", modifier: (data) => data.updatedAt },
  {
    name: "Link",
    type: "action",
    modifier: (data) => data,
    component: (data) => (
      <GroupedLinks
        data={{
          review: data,
          transcriptUrl: data.transcript?.transcriptUrl,
          content: data.transcript.content,
        }}
      />
    ),
  },
] satisfies TableStructure<AdminReview>[];

const EmptyView = ({ hasFilters }: { hasFilters: boolean }) => {
  return (
    <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
      <Text>
        {hasFilters
          ? "No reviews found for the set criteria"
          : "No reviews found"}
      </Text>
    </Flex>
  );
};

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  reviews: AdminReview[] | undefined;
};

const AdminReviewsTable = ({
  isLoading,
  isError,
  hasFilters,
  reviews,
}: Props) => {
  return (
    <>
      <BaseTable
        data={reviews}
        emptyView={<EmptyView hasFilters={hasFilters} />}
        isLoading={isLoading}
        isError={isError}
        tableStructure={tableStructure}
      />
    </>
  );
};

export default AdminReviewsTable;
