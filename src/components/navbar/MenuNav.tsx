import { Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { HiOutlineBookOpen } from "react-icons/hi";

const MenuNav = ({
  currentRoute,
  routeName,
}: {
  routeName: string;
  currentRoute: string;
}) => {
  const isCurrentRoute = currentRoute === routeName;
  return (
    <Link href={`/${routeName}`}>
      <Flex
        role="group"
        justifyContent="space-between"
        alignItems="center"
        // bgColor="blackAlpha.200"
        py={1}
        px={2}
        bgColor={isCurrentRoute ? "orange.200" : "white"}
        rounded="lg"
        _hover={isCurrentRoute ? {} : { bgColor: "gray.200" }}
        _active={isCurrentRoute ? {} : { bgColor: "gray.300" }}
      >
        <Icon
          _groupHover={isCurrentRoute ? {} : { color: "gray.600" }}
          color={isCurrentRoute ? "gray.800" : "gray.400"}
          as={HiOutlineBookOpen}
        />
        <Text
          _groupHover={isCurrentRoute ? {} : { color: "gray.600" }}
          color={isCurrentRoute ? "gray.800" : "gray.400"}
          fontWeight={"semibold"}
          textTransform="capitalize"
        >
          {routeName}
        </Text>
      </Flex>
    </Link>
  );
};

export default MenuNav;
