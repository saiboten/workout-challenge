import { Box, Flex, Heading } from "@chakra-ui/react";
import { ProfileImage } from "./lib/ProfileImage";
import { Spacer } from "./lib/Spacer";

interface Props {
  totalScores: {
    name: string | null;
    totalScore: number;
  }[];
}

export const TotalScore = ({ totalScores }: Props) => {
  return (
    <>
      <Heading size="md">Stillingen</Heading>
      <Spacer />
      <Box textAlign="left">
        {totalScores.map((el) => {
          return (
            <Flex alignItems="center" key={el.name ?? "-"}>
              <Box mr="3">
                <ProfileImage imageSrc="123" />
              </Box>
              <Box>
                {el.name}: <strong>{el.totalScore}</strong> poeng
              </Box>
            </Flex>
          );
        })}
      </Box>
    </>
  );
};
