import { Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { IconType } from "react-icons";

const MenuNav = ({
  currentRoute,
  routeName,
  routeLink,
  handleClose,
  icon,
}: {
  routeName: string;
  routeLink: string;
  currentRoute: string;
  handleClose?: () => void;
  icon?: IconType;
}) => {
  // to remove leading /
  const indexOfRoute = currentRoute.indexOf("/") + 1;
  // to remove  params so route can be exact
  const isCurrentRoute =
    currentRoute.substring(indexOfRoute) === routeLink.split("?")[0];
  return (
    <Link onClick={handleClose} href={`/${routeLink}`}>
      <Flex
        role="group"
        justifyContent="space-between"
        alignItems="center"
        bgColor={isCurrentRoute ? "gray.600" : ""}
        _hover={isCurrentRoute ? {} : { bgColor: "gray.100" }}
        rounded="lg"
        py={1}
        px={2}
      >
        {icon && (
          <Icon
            _groupHover={isCurrentRoute ? {} : { color: "gray.600" }}
            color={isCurrentRoute ? "orange.200" : "gray.600"}
            as={icon}
          />
        )}
        <Text
          textAlign="right"
          flex="1 1 auto"
          _groupActive={isCurrentRoute ? {} : { color: "gray.900" }}
          color={isCurrentRoute ? "orange.200" : "gray.600"}
          fontWeight={isCurrentRoute ? 600 : 500}
          textTransform="capitalize"
        >
          {routeName}
        </Text>
      </Flex>
    </Link>
  );
};

export default MenuNav;
