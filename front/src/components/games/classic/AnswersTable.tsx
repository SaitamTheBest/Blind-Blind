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

            const wrapper = tableWrapperRef.current;
            if (!wrapper) return;

            const firstCell = wrapper.querySelector("td");
            if (!firstCell) return;

            const cellWidth = (firstCell as HTMLElement).offsetWidth;

            // simulate scroll step by step (e.g. 7 cells)
            const scrollSteps = 7;
            const scrollDelay = 500; // ms entre chaque scroll

            // Reset scroll position to the start
            wrapper.scrollLeft = 0;


            for (let i = 1; i <= scrollSteps; i++) {
                setTimeout(() => {
                    wrapper.scrollBy({
                        left: cellWidth,
                        behavior: "smooth"
                    });
                }, i * scrollDelay);
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
