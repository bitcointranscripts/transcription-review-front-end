import { Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { IconType } from "react-icons";
import { IconType } from "react-icons";

const MenuNav = ({
  currentRoute,
  routeName,
  routeLink,
  handleClose,
  icon,
  routeLink,
  handleClose,
  icon,
}: {
  routeName: string;
  routeLink: string;
  routeLink: string;
  currentRoute: string;
  handleClose?: () => void;
  icon?: IconType;
  handleClose?: () => void;
  icon?: IconType;
}) => {
  const isCurrentRoute = currentRoute === routeLink;
  const isCurrentRoute = currentRoute === routeLink;
  return (
    <Link onClick={handleClose} href={`/${routeLink}`}>
    <Link onClick={handleClose} href={`/${routeLink}`}>
      <Flex
        role="group"
        justifyContent="space-between"
        alignItems="center"
        rounded="lg"
      >
        {icon && (
          <Icon
            _groupHover={isCurrentRoute ? {} : { color: "gray.600" }}
            color={isCurrentRoute ? "gray.800" : "gray.400"}
            as={icon}
          />
        )}
        <Text
          alignSelf="flex-end"
          _groupHover={isCurrentRoute ? {} : { textDecoration: "underline" }}
          _groupActive={isCurrentRoute ? {} : { color: "gray.900" }}
          color={isCurrentRoute ? "orange.400" : "gray.600"}
          fontWeight={500}
          textTransform="capitalize"
        >
          {routeName}
        </Text>
      </Flex>
    </Link>
  );
};

export default MenuNav;
