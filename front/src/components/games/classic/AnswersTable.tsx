import React, { useEffect, useState } from 'react';
import '../../../styles/games/classic/AnswersTable.css';
import TableTitle from "../TableTitle";
import TableBody from "../TableBody";

type AnswersTableProps = {
    messages: any[];
    randomTrack: any;
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messages, randomTrack }) => {
    const [storedMessages, setStoredMessages] = useState<any[]>([]);
    const [storedRandomTrack, setStoredRandomTrack] = useState<any>(null);

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        const savedRandomTrack = localStorage.getItem("randomTrack");

        if (savedMessages) {
            setStoredMessages(JSON.parse(savedMessages));
        }

        if (savedRandomTrack) {
            setStoredRandomTrack(JSON.parse(savedRandomTrack));
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("messages", JSON.stringify(messages));
            setStoredMessages(messages);
        }

        if (randomTrack) {
            localStorage.setItem("randomTrack", JSON.stringify(randomTrack));
            setStoredRandomTrack(randomTrack);
        }
    }, [messages, randomTrack]);

    if (storedMessages.length === 0) {
        return null;
    }

    return (
        <div>
            <table>
                <TableTitle titles={['Artistes', 'Album', 'Genres', 'Followers', 'Popularité', 'Année', 'Titre']} />
                <TableBody guess={storedMessages} randomItem={storedRandomTrack} />
            </table>
        </div>
    );
};

export default AnswersTable;
