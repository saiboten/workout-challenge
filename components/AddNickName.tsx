import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { trpc } from "../src/utils/trpc";
import { Spacer } from "../components/lib/Spacer";

interface Props {
  nickname?: string | null;
}

export function AddNickName({ nickname: existingNick }: Props) {
  const { mutate, status } = trpc.useMutation(["settings.nickname"]);
  const [nickName, setNickName] = useState(existingNick ?? "");
  const [error, setError] = useState("");

  const toast = useToast();

  function submitNickname(e: any) {
    e.preventDefault();
    mutate({
      nickName: nickName,
    });
  }

  useEffect(() => {
    if (status === "success") {
      toast({
        title: "Brukernavn oppdatert.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else if (status === "error") {
      setError("Klarte ikke å oppdatere brukernavn. Prøv igjen senere.");
    }
  }, [status, toast]);

  return (
    <>
      <Heading size="md">Velg brukernavn</Heading>
      <Spacer />

      {!existingNick ? <Text>Du ikke valgt kallenavn enda.</Text> : null}
      <Spacer />
      <form onSubmit={submitNickname}>
        <FormControl>
          <FormLabel htmlFor="nickname">
            {existingNick ? "Endre" : "Opprett"} brukernavn
          </FormLabel>
          <Flex>
            <Input
              mr="2"
              maxWidth="22rem"
              id="nickname"
              onChange={(e) => setNickName(e.target.value)}
              value={nickName}
              type="text"
            ></Input>
            <Button
              disabled={nickName.length < 3 || status === "loading"}
              isLoading={status === "loading"}
              type="submit"
            >
              Endre
            </Button>
          </Flex>
        </FormControl>
      </form>
      <Spacer />
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Noe gikk galt</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}
