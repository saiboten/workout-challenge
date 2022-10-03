import { Box } from "@chakra-ui/react";
import Image from "next/image";

interface Props {
  imageSrc: string;
}

export const ProfileImage = ({ imageSrc }: Props) => {
  return (
    <Box
      border="1px solid black"
      height="50px"
      width="50px"
      display="inline-block"
      borderRadius="50%"
      bgColor="floralwhite"
    ></Box>
    // <Image
    //   src={"https://via.placeholder.com/300"}
    //   alt="Profile picture"
    //   width="132px"
    //   height="132px"
    //   style={{ borderRadius: "50%", cursor: "pointer" }}
    // />
  );
};
