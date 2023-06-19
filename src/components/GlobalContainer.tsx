import { Container, ContainerProps } from "@chakra-ui/react";
import React from "react";
import type { AbstractedChakraComponentProps } from "../../types";

const GlobalContainer: React.FC<AbstractedChakraComponentProps<ContainerProps>> = ({ children, ...chakraProps }) => {
  return (
    <Container maxW="container.xl" {...chakraProps}>
      {children}
    </Container>
  );
};

export default GlobalContainer;
