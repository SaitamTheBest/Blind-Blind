import React from 'react';
import '../../../styles/games/classic/AnswersTable.css';

type AnswersTableProps = {
    messages: string[];
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messages }) => {
    if (messages.length === 0) {
        return null; // Retourne null si aucune réponse
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
                    <td>{message}</td>
                    <td>{message}</td>
                    <td>{message}</td>
                    <td>{message}</td>
                    <td>{message}</td>
                    <td>{message}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AnswersTable;
