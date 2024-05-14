import { CheckboxGroup, Flex, Text, useToast } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";
import { AdminReview } from "@/services/api/admin/useReviews";
import { GroupedLinks, ResetButton } from "./TableItems";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useResetReview } from "@/services/api/reviews/useResetReviews";

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
};

type AdminResetSelectProps = {
  children: (props: {
    handleReset: () => Promise<void>;
    hasAdminSelected: boolean;
    isArchiving: boolean;
  }) => React.ReactNode;
};
const AdminArchiveSelect = ({ children }: AdminResetSelectProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toast = useToast();
  const { data: userSession } = useSession();
  const queryClient = useQueryClient();
  const resetReview = useResetReview();
  const handleCheckboxToggle = (values: (string | number)[]) => {
    setSelectedIds(values.map(String));
  };
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

        queryClient.invalidateQueries(["reviews"]);
        setSelectedIds([]);
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
    <CheckboxGroup colorScheme="orange" onChange={handleCheckboxToggle}>
      {children({
        handleReset,
        hasAdminSelected: selectedIds.length > 0,
        isArchiving: true,
      })}
    </CheckboxGroup>
  );
};

const AdminReviewsTable = ({
  isLoading,
  isError,
  hasFilters,
  reviews,
  totalPages,
}: Props) => {
  return (
    <AdminArchiveSelect>
      {({ handleReset, hasAdminSelected, isArchiving }) => (
        <BaseTable
          data={reviews}
          emptyView={<EmptyView hasFilters={hasFilters} />}
          isLoading={isLoading}
          isError={isError}
          tableStructure={tableStructure}
          hasAdminSelected={hasAdminSelected}
          handleArchive={handleReset}
          showAdminControls
          ActionButton={ResetButton}
        />
      )}
    </AdminArchiveSelect>
  );
};

export default AdminReviewsTable;
