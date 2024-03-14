import { Box, Text } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { OnlySelectField, SingleSelectField } from "./SelectField";
import TextField from "./TextField";
import styles from "./sidebarContentEdit.module.css";

export function TextEdit({
  editedData,
  heading,
  updateData,
}: {
  editedData: string;
  heading: string;
  updateData: (value: string) => void;
}) {
  return (
    <Box>
      <Text fontWeight={600} mb={2}>
        {heading}
      </Text>
      <TextField editedData={editedData} updateData={updateData} />
    </Box>
  );
}

export function ListEdit(
  props: (
    | (React.ComponentProps<typeof OnlySelectField> & {
        type: "onlySelect";
      })
    | (React.ComponentProps<typeof SingleSelectField> & {
        type: "singleSelect";
      })
  ) & {
    heading: string;
  }
) {
  return (
    <Box>
      <Text fontWeight={600} mb={2}>
        {props.heading}
      </Text>
      {props.type === "onlySelect" ? (
        <OnlySelectField {...props} />
      ) : (
        <SingleSelectField {...props} />
      )}
    </Box>
  );
}

export function DateEdit({
  editedData,
  heading,
  updateData,
}: {
  editedData: Date | null;
  heading: string;
  updateData: (value: Date) => void;
}) {
  return (
    <Box>
      <Text display="inline-block" fontWeight={600} mb={2}>
        {heading}
      </Text>
      <Text ml={3} display="inline-block" color="gray.400">
        YYYY-MM-DD format
      </Text>
      <DatePicker
        selected={editedData}
        onChange={updateData}
        dateFormat="yyyy-MM-dd"
        className={styles.customDatePicker}
      />
    </Box>
  );
}
