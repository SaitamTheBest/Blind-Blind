import React, { useEffect, useRef, useState } from 'react';
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

    const tableWrapperRef = useRef<HTMLDivElement>(null);

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

            // Scroll automatique vers la droite
            if (tableWrapperRef.current) {
                tableWrapperRef.current.scrollLeft = tableWrapperRef.current.scrollWidth;
            }
        }

        if (randomTrack) {
            localStorage.setItem("randomTrack", JSON.stringify(randomTrack));
            setStoredRandomTrack(randomTrack);
        }
    }, [messages, randomTrack]);

    if (storedMessages.length === 0) {
        return <p className="no-guess-message">Aucune proposition pour le moment.</p>;
    }

    return (
        <div className="table-wrapper" ref={tableWrapperRef}>
            <table>
                <TableTitle titles={['Artistes', 'Album', 'Nationalité', 'Genres', 'Followers', 'Popularité', 'Année', 'Titre']} />
                <TableBody guess={storedMessages} randomItem={storedRandomTrack} />
            </table>
        </div>
    );
};

export default AnswersTable;
