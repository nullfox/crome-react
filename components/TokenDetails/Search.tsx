import {
  Box,
  Button,
  Center,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import {
  FC,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BiSearch } from 'react-icons/bi';

interface SearchProps {
  onTextUpdate: (text: string) => Promise<{ label: string; value: string }[]>;
  onSearch: (text: string) => any;
  isLoading: boolean;
}

const Search: FC<SearchProps> = ({ onTextUpdate, onSearch, isLoading }) => {
  const router = useRouter();

  const initialFocusRef = useRef<FocusableElement | null>(null);

  const [text, setText] = useState<string>('');
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const debouncedTextUpdate = useMemo(
    () =>
      debounce(
        (searchText: string) => onTextUpdate(searchText).then(setItems),
        500,
        { leading: false, trailing: true },
      ),
    [onTextUpdate],
  );

  useEffect(() => {
    if (text.length > 2) {
      debouncedTextUpdate(text);
    }
  }, [text]);

  return (
    <Box pos="relative">
      <Popover initialFocusRef={initialFocusRef}>
        <PopoverTrigger>
          <InputGroup>
            <Input
              ref={initialFocusRef as MutableRefObject<HTMLInputElement>}
              variant="filled"
              placeholder="Token address / name"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="Search"
                icon={<BiSearch />}
                onClick={() => onSearch(text)}
              />
            </InputRightElement>
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            {!isLoading && items.length > 0 && (
              <List>
                {items.map((item) => (
                  <ListItem key={item.value}>
                    <Button
                      borderRadius={0}
                      w="full"
                      justifyContent="flex-start"
                      onClick={() => router.push(`/token/${item.value}`)}
                    >
                      {item.label}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}

            {!isLoading && items.length === 0 && <Center>No results!</Center>}

            {isLoading && (
              <Center>
                <Spinner />
              </Center>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default Search;
