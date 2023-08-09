import { dateFormat, deriveFileSlug, derivePublishUrl } from "@/utils";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  Skeleton,
  Spinner,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineArchive } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import { ReviewTranscript } from "../../../types";
import TablePopover from "../TablePopover";
import styles from "./tableItems.module.scss";
import type { TableDataElement, TableStructure } from "./types";

// eslint-disable-next-line no-unused-vars
const defaultUndefined = <TData, TCb extends (data: TData) => any>(
  cb: TCb,
  data: TData
) => {
  try {
    return cb(data);
  } catch {
    return "N/A";
  }
};

export const DateText = <T extends object>({
  tableItem,
  row,
}: TableDataElement<T>) => {
  const dateString = dateFormat(tableItem.modifier(row)) ?? "N/A";
  return <Td>{dateString}</Td>;
};

export const LongText = <T extends object>({
  tableItem,
  row,
}: TableDataElement<T>) => {
  const text = defaultUndefined(tableItem.modifier, row);
  return (
    <Td>
      <Text>{text}</Text>
    </Td>
  );
};

export const ShortText = <T extends object>({
  tableItem,
  row,
}: TableDataElement<T>) => {
  const text = defaultUndefined(tableItem.modifier, row);
  return <Td>{typeof text === "string" ? <Text>{text}</Text> : text}</Td>;
};

export const Tags = <T extends object>({
  tableItem,
  row,
}: TableDataElement<T>) => {
  const stringArray = tableItem.modifier(row) as string;
  let _parsed = stringArray as string | string[];
  if (stringArray[0] === "[") {
    _parsed = stringArray
      .substring(1, stringArray.length - 1)
      .replaceAll("'", "")
      .split(", ");
  }

  const _zeroItem = typeof _parsed === "string" ? "N/A" : _parsed[0];
  const others = _parsed.slice(1);
  return (
    <Td>
      <Flex alignItems="center" justifyContent="space-between" gap={2}>
        <Text textTransform="capitalize">{_zeroItem}</Text>
        {Array.isArray(others) && others.length > 0 ? (
          <TablePopover
            trigger={
              <button className={styles.more_button}>+{others.length}</button>
            }
            title={tableItem.name}
          >
            <Flex flexDir="column">
              {others.map((item, idx) => (
                <Text textTransform="capitalize" fontSize="12px" key={idx}>
                  {item}
                </Text>
              ))}
            </Flex>
          </TablePopover>
        ) : null}
      </Flex>
    </Td>
  );
};

export const TableAction = <T extends object>({
  tableItem,
  row,
  actionState,
  showControls,
}: TableDataElement<T> & { showControls: boolean }) => {
  const { data: userSession } = useSession();

  const handleClick = () => {
    if (!tableItem.action) return;
    tableItem.action(row);
  };

  const isLoading = "id" in row && row.id === actionState?.rowId;
  const isAdmin = userSession?.user?.permissions === "admin";
  const showCheckBox = isAdmin && showControls;

  return (
    <Td>
      <Flex justifyContent="space-between" alignItems="center">
        {/* render a custom component if passed */}
        {tableItem.component ? (
          tableItem.component(row)
        ) : (
          <Button
            title={tableItem.isDisabledText}
            isDisabled={tableItem.isDisabled}
            isLoading={isLoading}
            colorScheme="orange"
            size="sm"
            onClick={handleClick}
          >
            {tableItem.actionName}
          </Button>
        )}
        {/* checkbox */}
        {showCheckBox && <Checkbox value={String("id" in row && row.id)} />}
      </Flex>
    </Td>
  );
};

export const TableHeader = <T extends object>({
  tableStructure,
}: {
  tableStructure: TableStructure<T>[];
}) => {
  return (
    <Tr>
      {tableStructure.map((tableItem, idx) => {
        return (
          <Th key={idx} width={tableItem.type === "text-long" ? "25%" : "auto"}>
            <Text
              textTransform="capitalize"
              fontWeight="bold"
              fontSize="14px"
              color="gray.700"
            >
              {tableItem.name}
            </Text>
          </Th>
        );
      })}
    </Tr>
  );
};

export const LoadingSkeleton = ({ rowsLength }: { rowsLength: number }) => {
  const getSkeleton = useMemo(() => {
    const skeletonArr = [];
    for (let index = 0; index < 3; index++) {
      skeletonArr.push(
        <Tr key={index}>
          {Array.from({ length: rowsLength }).map((_, _idx) => (
            <Td key={_idx}>
              <Skeleton w="100%" h={4} />
            </Td>
          ))}
        </Tr>
      );
    }
    return skeletonArr;
  }, [rowsLength]);

  return <>{getSkeleton}</>;
};

export const DataEmpty = ({
  message = "No Data",
}: {
  message?: React.ReactNode;
}) => {
  return (
    <Tr position="relative" h={14}>
      <Td position="absolute" w="full" color="red.400" textAlign="center">
        {message}
      </Td>
    </Tr>
  );
};

export const RowData = <T extends object>({
  row,
  tableItem,
  actionState,
  showControls,
}: TableDataElement<T> & { showControls: boolean }) => {
  switch (tableItem.type) {
    case "date":
      return <DateText key={tableItem.name} tableItem={tableItem} row={row} />;

    case "text-long":
      return <LongText key={tableItem.name} tableItem={tableItem} row={row} />;

    case "text-short":
      return <ShortText key={tableItem.name} tableItem={tableItem} row={row} />;

    case "tags":
      return <Tags key={tableItem.name} tableItem={tableItem} row={row} />;

    case "action":
      return (
        <TableAction
          showControls={showControls}
          key={tableItem.name}
          tableItem={tableItem}
          row={row}
          actionState={actionState}
        />
      );

    default:
      return (
        <>
          {tableItem.component ? (
            tableItem.component(row)
          ) : (
            <Td key={`table-data`}>N/A</Td>
          )}
        </>
      );
  }
};

export const RefetchButton = ({
  refetch,
}: {
  refetch: () => Promise<unknown>;
}) => (
  <IconButton
    aria-label="refresh table"
    minW="auto"
    h="auto"
    p="2px"
    colorScheme="red"
    variant="ghost"
    icon={<TbReload />}
    onClick={refetch}
  />
);

export const ArchiveButton = ({
  isArchiving,
  handleArchive,
}: {
  isArchiving?: boolean;
  handleArchive?: () => void;
}) => (
  <Button
    size="sm"
    gap={2}
    aria-label="archive table"
    colorScheme="orange"
    onClick={handleArchive}
  >
    Archive
    {isArchiving ? (
      <Spinner color="white" size="sm" thickness="2px" />
    ) : (
      <MdOutlineArchive />
    )}
  </Button>
);

export const ReviewStatus = ({ data }: { data: ReviewTranscript }) => {
  const isMerged = data.review!.mergedAt;
  const isSubmitted = data.review!.submittedAt;

  return (
    <>
      <Box cursor="default" minW={12}>
        <Text
          fontSize="12px"
          fontWeight={700}
          color={isMerged ? "green.300" : "red.300"}
        >
          {isMerged ? "LIVE" : isSubmitted ? "CLOSED" : "EXPIRED"}
        </Text>
      </Box>
      {/* <GroupedLinks data={data} /> */}
    </>
  );
};

export const GroupedLinks = ({ data }: { data: ReviewTranscript }) => {
  const { pr_url } = data.review!;
  let publishUrl = "";
  const isPublished = data.review?.mergedAt;

  if (isPublished) {
    let fileSlug = deriveFileSlug(data.content.title);
    publishUrl = derivePublishUrl(fileSlug, data.content.loc);
  }

  return (
    <Flex alignItems="center" gap={2}>
      {pr_url ? (
        <Link target="_blank" href={pr_url as any}>
          <Icon
            _hover={{
              cursor: "pointer",
              color: "orange.300",
            }}
            w="20px"
            h="20px"
            color="gray.500"
            as={FaGithub}
            display="block"
          />
        </Link>
      ) : null}
      {isPublished && (
        <Link target="_blank" href={publishUrl as any}>
          <Image
            alt="btctranscript"
            height="20"
            width="20"
            src="/btctranscripts.png"
          />
        </Link>
      )}
    </Flex>
  );
};
