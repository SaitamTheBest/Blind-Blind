import React from 'react';
import '../../../styles/games/classic/AnswersTable.css';

type AnswersTableProps = {
    messages: string[];
    randomTrack: any;
};

// Fonction pour déterminer la classe CSS de la cellule numérique
const getNumericCellClass = (proposition: number, correcte: number) => {
    if (proposition === correcte) {
        return 'correct';
    }
    return proposition > correcte ? 'td-arrow-up' : 'td-arrow-down';
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messages, randomTrack }) => {
    if (messages.length === 0) {
        return null;
    }

    return (
        <table>
            <thead>
            <tr>
                <th>Titre</th>
                <th>Artiste</th>
                <th>Album</th>
                <th>Genre</th>
                <th>Popularité</th>
                <th>Année</th>
            </tr>
            </thead>
            <tbody>
            {messages.map((message, index) => (
                <tr key={index}>
                    <td className={message === randomTrack.name ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={message === randomTrack.artists ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={message === randomTrack.album ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={message === randomTrack.name ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={getNumericCellClass(parseInt(message), randomTrack.popularity)}>
                        {message}
                    </td>
                    <td className={getNumericCellClass(parseInt(message), randomTrack.release_date)}>
                        {message}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AnswersTable;

