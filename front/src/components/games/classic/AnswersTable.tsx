import React from 'react';
import '../../../styles/games/classic/AnswersTable.css';

type AnswersTableProps = {
    messages: any[];
    randomTrack: any;
};

const AnswersTable: React.FC<AnswersTableProps> = ({ messages, randomTrack }) => {
    if (messages.length === 0) {
        return null;
    }

    const getArrowClass = (value: number, reference: number): string => {
        if (value > reference) {
            return 'td-arrow-up';
        } else if (value < reference) {
            return 'td-arrow-down';
        } else {
            return '';
        }
    };

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Titre</th>
                    <th>Artiste</th>
                    <th>Album</th>
                    <th>Popularité</th>
                    <th>Année</th>
                </tr>
                </thead>
                <tbody>
                {messages.map((message, index) => (
                    <tr key={index}>
                        <td className={message.isCorrect.name ? 'correct' : 'incorrect'}>{message.name}</td>
                        <td className={message.isCorrect.artists ? 'correct' : 'incorrect'}>{message.artists}</td>
                        <td className={message.isCorrect.album ? 'correct' : 'incorrect'}>{message.album}</td>
                        <td className={`${message.isCorrect.popularity ? 'correct' : 'incorrect'} ${getArrowClass(message.popularity, randomTrack.popularity)}`}>
                            {message.popularity}
                        </td>
                        <td className={`${message.isCorrect.release_date ? 'correct' : 'incorrect'} ${getArrowClass(parseInt(message.release_date.split('-')[0]), parseInt(randomTrack.release_date.split('-')[0]))}`}>
                            {message.release_date.split('-')[0]}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnswersTable;