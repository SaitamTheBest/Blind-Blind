import { useState } from "react";
import {
  TextInput,
  Combobox,
  useCombobox,
  Group,
  Image,
  Text,
  Button,
  Stack,
} from "@mantine/core";

type GuessInputProps = {
  onGuessSubmit: (track: any) => void;
  tracks: any[];
  disabled: boolean;
};

export default function GuessInput({
  onGuessSubmit,
  tracks,
  disabled,
}: GuessInputProps) {
  const [guess, setGuess] = useState("");

  const combobox = useCombobox();

  const filteredTracks =
    guess.trim().length > 0
      ? tracks.filter((track) => {
          const artists = Array.isArray(track.artists)
            ? track.artists.join(" ")
            : "";

          return (
            track.name?.toLowerCase().includes(guess.toLowerCase()) ||
            artists.toLowerCase().includes(guess.toLowerCase())
          );
        })
      : [];

  const handleSelect = (track: any) => {
    if (!track) return;

    onGuessSubmit(track);
    setGuess("");
    combobox.closeDropdown();
  };

  return (
    <Stack>
      <Combobox
        store={combobox}
        onOptionSubmit={(id) => {
          const selected = tracks.find((t) => t.id === id);
          handleSelect(selected);
        }}
      >
        <Combobox.Target>
          <TextInput
            value={guess}
            disabled={disabled}
            placeholder="Mettez le titre d'une chanson ici..."
            onChange={(event) => {
              setGuess(event.currentTarget.value);
              combobox.openDropdown();
            }}
          />
        </Combobox.Target>

        {filteredTracks.length > 0 && (
          <Combobox.Dropdown>
            <Combobox.Options>
              {filteredTracks.slice(0, 10).map((track) => (
                <Combobox.Option
                  key={track.id}
                  value={track.id}
                >
                  <Group>
                    <Image
                      src={track.image || track.album?.image_album}
                      w={40}
                      h={40}
                      radius="sm"
                    />

                    <div>
                      <Text fw={500}>{track.name}</Text>

                      <Text size="sm" c="dimmed">
                        {Array.isArray(track.artists)
                          ? track.artists.join(", ")
                          : track.artists}
                      </Text>
                    </div>
                  </Group>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        )}
      </Combobox>

      <Button
        disabled={disabled || filteredTracks.length === 0}
        onClick={() => handleSelect(filteredTracks[0])}
      >
        Valider
      </Button>
    </Stack>
  );
}