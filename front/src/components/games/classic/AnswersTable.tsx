import React from 'react';
import '../../../styles/games/classic/AnswersTable.css';

type AnswersTableProps = {
    messages: string[];
};

// Exemple des données correctes (à remplacer par le JSON plus tard)
const correctData = {
    titre: "That's What I Like",
    artiste: 'Bruno Mars',
    album: '24K Magic',
    genre: 'R&B',
    popularite: 92,
    annee: 2017,
};

// Fonction pour déterminer la classe CSS de la cellule numérique
const getNumericCellClass = (proposition: number, correcte: number) => {
    if (proposition === correcte) {
        return 'correct';
    }
    return proposition > correcte ? 'td-arrow-up' : 'td-arrow-down';
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messages }) => {
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
                    <td className={message === correctData.titre ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={message === correctData.artiste ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={message === correctData.album ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={message === correctData.genre ? 'correct' : 'incorrect'}>{message}</td>
                    <td className={getNumericCellClass(parseInt(message), correctData.popularite)}>
                        {message}
                    </td>
                    <td className={getNumericCellClass(parseInt(message), correctData.annee)}>
                        {message}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AnswersTable;

