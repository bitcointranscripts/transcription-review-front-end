import {
  Flex,
  Td,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";
import { AdminReview } from "@/services/api/admin/useReviews";
import { GroupedLinks, OtherFields, ResetButton } from "./TableItems";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useResetReview } from "@/services/api/reviews/useResetReviews";
import { dateFormatGeneral } from "@/utils";
import { getReviewStatus } from "@/utils/review";
import { format } from "date-fns";
import { useHasPermission } from "@/hooks/useHasPermissions";
import { useRouter } from "next/router";

const tableStructure = [
  {
    name: "id",
    type: "text-short",
    modifier: (data) => data.id,
  },
  {
    name: "transcript name",
    type: "default",
    modifier: (data) => data.transcript.content.title,
    component: (data) => (
      <Td>
        <Tooltip
          label={`Transcript Id: ${data.transcriptId}`}
          cursor={"pointer"}
        >
          <Text cursor={"pointer"}>{data.transcript.content.title}</Text>
        </Tooltip>
      </Td>
    ),
  },
  {
    name: "username",
    type: "text-short",
    modifier: (data) => data.user.githubUsername,
  },
  {
    name: "status",
    type: "text-short",
    modifier: (data) => getReviewStatus(data),
  },
  {
    name: "Claim Date",
    type: "default",
    modifier: (data) => data.createdAt,
    component: (data) => (
      <Td>
        <Tooltip
          label={`${format(
            new Date(data.createdAt),
            "MMM d, yyyy, 	h:mm aa OO "
          )}`}
          cursor={"pointer"}
        >
          <Text cursor={"pointer"}>{`${dateFormatGeneral(
            data.createdAt,
            true
          )}`}</Text>
        </Tooltip>
      </Td>
    ),
  },
  {
    name: "Others",
    type: "default",
    modifier: (data) => data,
    component: (data) => <OtherFields data={data} />,
  },
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
  totalPages: number | undefined;
  refetch: () => void;
};

const AdminReviewsTable = ({
  isLoading,
  isError,
  hasFilters,
  reviews,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toast = useToast();
  const router = useRouter();
  const { data: userSession } = useSession();

  const queryClient = useQueryClient();
  const resetReview = useResetReview();

  const canResetReviews = useHasPermission("resetReviews");
  const { status } = router.query;

  const handleReset = async () => {
    const ids = selectedIds.map(Number);

    if (userSession?.user?.id) {
      try {
        await Promise.all(
          ids.map((reviewId) =>
            resetReview.mutateAsync({
              reviewId,
            })
          )
        );
        setSelectedIds([]);
        queryClient.invalidateQueries(["all_reviews"]);
        toast({
          status: "success",
          title: "Reset Reviews Successfully",
        });
      } catch (err) {
        const error = err as Error;
        toast({
          status: "error",
          title: "Error while resetting reviews",
          description: error?.message,
        });
      }
    } else {
      await signOut({ redirect: false });
      signIn("github");
    }
  };

  return (
    <>
      <BaseTable
        data={reviews}
        emptyView={<EmptyView hasFilters={hasFilters} />}
        isLoading={isLoading}
        isError={isError}
        tableStructure={tableStructure}
        enableCheckboxes={canResetReviews && status == "active"}
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
        getRowId={(row) => `${row.id}`}
        actionItems={
          <>
            {selectedIds.length > 0 && (
              <ResetButton
                isLoading={resetReview.isLoading}
                handleRequest={handleReset}
              />
            )}
          </>
        }
      />
    </>
  );
};

export default AdminReviewsTable;
