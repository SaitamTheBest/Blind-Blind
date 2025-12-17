import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/games/classic/AnswersTable.css';
import TableTitle from "../TableTitle";
import TableBody from "../TableBody";

type AnswersTableProps = {
    messagesClassic: any[];
    randomTrackClassic: any;
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messagesClassic, randomTrackClassic }) => {
    const [storedMessagesClassic, setStoredMessagesClassic] = useState<any[]>([]);
    const [storedRandomTrackClassic, setStoredRandomTrackClassic] = useState<any>(null);

    const tableWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedMessagesClassic = localStorage.getItem("messagesClassic");
        const savedRandomTrackClassic = localStorage.getItem("randomTrackClassic");

        if (savedMessagesClassic) {
            setStoredMessagesClassic(JSON.parse(savedMessagesClassic));
        }

        if (savedRandomTrackClassic) {
            setStoredRandomTrackClassic(JSON.parse(savedRandomTrackClassic));
        }
    }, []);

    useEffect(() => {
        if (messagesClassic.length > 0) {
            localStorage.setItem("messagesClassic", JSON.stringify(messagesClassic));
            setStoredMessagesClassic(messagesClassic);

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

        if (randomTrackClassic) {
            localStorage.setItem("randomTrackClassic", JSON.stringify(randomTrackClassic));
            setStoredRandomTrackClassic(randomTrackClassic);
        }
    }, [messagesClassic, randomTrackClassic]);

    if (storedMessagesClassic.length === 0) {
        return <p className="no-guess-message">Aucune proposition pour le moment.</p>;
    }

    return (
        <div className="table-wrapper" ref={tableWrapperRef}>
            <table>
                <TableTitle titles={['Artistes', 'Album', 'Nationalité', 'Genres', 'Followers', 'Popularité', 'Année', 'Titre']} />
                <TableBody guess={storedMessagesClassic} randomItem={storedRandomTrackClassic} />
            </table>
        </div>
    );
};

export default AnswersTable;
