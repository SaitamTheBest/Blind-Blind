import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/games/classic/AnswersTable.css';
import TableTitle from "../TableTitle";
import TableBody from "./TableBody";

type AnswersTableProps = {
    messagesArtist: any[];
    randomArtist: any;
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messagesArtist, randomArtist }) => {
    const [storedMessagesArtist, setStoredMessagesArtist] = useState<any[]>([]);
    const [storedRandomArtist, setStoredRandomArtist] = useState<any>(null);

    const tableWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedMessagesArtist = localStorage.getItem("messagesArtist");
        const savedRandomArtist = localStorage.getItem("randomArtist");

        if (savedMessagesArtist) {
            setStoredMessagesArtist(JSON.parse(savedMessagesArtist));
        }

        if (savedRandomArtist) {
            setStoredRandomArtist(JSON.parse(savedRandomArtist));
        }
    }, []);

    useEffect(() => {
        if (messagesArtist.length > 0) {
            localStorage.setItem("messagesArtist", JSON.stringify(messagesArtist));
            setStoredMessagesArtist(messagesArtist);

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

        if (randomArtist) {
            localStorage.setItem("randomArtist", JSON.stringify(randomArtist));
            setStoredRandomArtist(randomArtist);
        }
    }, [messagesArtist, randomArtist]);

    if (storedMessagesArtist.length === 0) {
        return <p className="no-guess-message">Aucune proposition pour le moment.</p>;
    }

    return (
        <div className="table-wrapper" ref={tableWrapperRef}>
            <table>
                <TableTitle titles={['Nom de l\'artiste']} />
                <TableBody guess={storedMessagesArtist} randomItem={storedRandomArtist} />
            </table>
        </div>
    );
};

export default AnswersTable;
