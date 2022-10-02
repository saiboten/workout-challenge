import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
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
        <UnorderedList>
          {totalScores.map((el) => {
            return (
              <ListItem key={el.name ?? "-"}>
                {el.name} - {el.totalScore}
              </ListItem>
            );
          })}
        </UnorderedList>
      </Box>
    </>
  );
};
