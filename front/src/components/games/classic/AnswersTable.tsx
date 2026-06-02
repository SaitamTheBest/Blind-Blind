import { ScrollArea, Table, Image } from "@mantine/core";

export default function AnswersTable({ messagesClassic }: any) {
  if (!messagesClassic?.length) {
    return <div>Aucune proposition pour le moment.</div>;
  }

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Artistes</Table.Th>
            <Table.Th>Album</Table.Th>
            <Table.Th>Image</Table.Th>
            <Table.Th>Nationalité</Table.Th>
            <Table.Th>Genres</Table.Th>
            <Table.Th>Followers</Table.Th>
            <Table.Th>Popularité</Table.Th>
            <Table.Th>Année</Table.Th>
            <Table.Th>Titre</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {messagesClassic.map((message: any, index: number) => {
            const v = message.verification;

            return (
              <Table.Tr key={index} className="table-row">
                <Table.Td>
                  {message.artists?.join(", ")}
                </Table.Td>

                <Table.Td className={
                  v?.Album?.status === "correct"
                    ? "cell-correct"
                    : ""
                }>
                  {message.album}
                </Table.Td>

                <Table.Td>
                  {message.albumImage && (
                    <Image
                      src={message.albumImage}
                      w={50}
                      h={50}
                      radius="sm"
                    />
                  )}
                </Table.Td>

                <Table.Td>
                  {message.nationality?.join(", ")}
                </Table.Td>

                <Table.Td>
                  {message.genres?.join(", ")}
                </Table.Td>

                <Table.Td>
                  {message.followers?.toLocaleString("fr-FR")}
                </Table.Td>

                <Table.Td>
                  {message.popularity}
                </Table.Td>

                <Table.Td>
                  {message.release_year}
                </Table.Td>

                <Table.Td>
                  {message.name}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}