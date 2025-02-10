import React from 'react';
import '../../../styles/games/classic/AnswersTable.css';
import TableTitle from "../TableTitle";
import TableBody from "../TableBody";

type AnswersTableProps = {
    messages: any[];
    randomTrack: any;
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messages, randomTrack }) => {
    if (messages.length === 0) {
        return null;
    }

    return (
        <div>
            <table>
                <TableTitle titles={['Titre','Artistes','Album','Genres','Popularité','Année']} />
                <TableBody guess={messages} randomItem={randomTrack} />
            </table>
        </div>
    );
};

export default AnswersTable;