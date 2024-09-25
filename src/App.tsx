import {
  Box, Button, Center, Grid, Input, Text, useToast, VStack
} from "@chakra-ui/react";
import { useState } from "react";

type DominoCardType = [number, number];

interface DominoCardProps {
  card: DominoCardType;
}

const DominoCard: React.FC<DominoCardProps> = ({ card }) => {
  return (
    <Box
      border="2px solid"
      borderRadius="lg"
      p={4}
      bg="gray.100"
      textAlign="center"
      width="100px"
      height="150px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize="xl">{card[0]}</Text>
      <Box borderTop="2px dashed" my={2} width="80%" />
      <Text fontSize="xl">{card[1]}</Text>
    </Box>
  );
};

const App: React.FC = () => {
  const defaultDominoes: DominoCardType[] = [
    [6, 1], [4, 3], [5, 1], [3, 4], [1, 1], [3, 4], [1, 2]
  ];
  const [dominoes, setDominoes] = useState<DominoCardType[]>(defaultDominoes);
  const [inputValue, setInputValue] = useState<string>('');
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addDomino = () => {
    const pairs = inputValue.split(',').map(pair => pair.trim().split(' ').map(Number));
    const newDominoes = pairs.filter(pair => pair.length === 2 && !isNaN(pair[0]) && !isNaN(pair[1])) as DominoCardType[];

    if (newDominoes.length > 0) {
      setDominoes([...dominoes, ...newDominoes]);
      setInputValue('');
      toast({
        title: "Domino Added",
        description: "New domino cards have been added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Input Error",
        description: "Please enter valid domino pairs (e.g., '1 2, 3 4').",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const countDoubles = () => {
    return dominoes.filter(card => card[0] === card[1]).length;
  };

  const sortDominoes = (order: 'asc' | 'desc') => {
    const sorted = [...dominoes].sort((a, b) => {
      const totalA = a[0] + a[1];
      const totalB = b[0] + b[1];
      return order === 'asc' ? totalA - totalB : totalB - totalA;
    });
    setDominoes(sorted);
  };

  const removeDuplicates = () => {
    const uniqueDominoes = Array.from(new Map(dominoes.map(card => [JSON.stringify(card), card])).values());
    setDominoes(uniqueDominoes);
  };

  const flipCards = () => {
    const flippedDominoes = dominoes.map(card => [card[1], card[0]] as DominoCardType);
    setDominoes(flippedDominoes);
  };

  const removeByTotal = (total: number) => {
    const filteredDominoes = dominoes.filter(card => card[0] + card[1] !== total);
    setDominoes(filteredDominoes);
  };

  const resetData = () => {
    setDominoes(defaultDominoes);
  };

  return (
    <Center flexDirection="column" padding={5}>
      <Text fontSize="3xl" fontWeight="bold" mb={4}>Purwadhika Domino Selection Test</Text>
      <Input
        placeholder="Enter Domino (Example: 1 2, 3 4, 5 6) to Add new Domino"
        value={inputValue}
        onChange={handleInputChange}
        size='lg'
        mb={4}
      />
      <Button
        colorScheme="teal"
        onClick={addDomino}
      >
        Add Domino
      </Button>

      <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={4}>
        {dominoes.map((card, index) => (
          <DominoCard key={index} card={card} />
        ))}
      </Grid>
      <Text fontSize="lg" mt={4}>Double Numbers Count: {countDoubles()}</Text>

      <VStack spacing={4} mt={4}>
        <Button colorScheme="blue" onClick={() => sortDominoes('asc')}>Sort Ascending</Button>
        <Button colorScheme="blue" onClick={() => sortDominoes('desc')}>Sort Descending</Button>
        <Button colorScheme="yellow" onClick={removeDuplicates}>Remove Duplicates</Button>
        <Button colorScheme="purple" onClick={flipCards}>Flip Cards</Button>
        <Input 
          placeholder="Enter Total to Remove"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const total = parseInt((e.target as HTMLInputElement).value);
              removeByTotal(total);
              (e.target as HTMLInputElement).value = '';
            }
          }}
          size='lg'
        />
        <Button colorScheme="red" onClick={resetData}>Reset Data</Button>
      </VStack>
    </Center>
  );
};

export default App;
