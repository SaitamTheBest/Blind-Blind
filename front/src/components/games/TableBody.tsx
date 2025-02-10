import React from 'react';
import '../../styles/games/classic/AnswersTable.css';

type TableBodyProps = {
    guess: any[];
    randomItem: any;
};

const TableBody: React.FC<TableBodyProps> = ({ guess, randomItem }) => {
    if (guess.length === 0) {
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
        <tbody>
            {guess.map((message, index) => (
                <tr key={index}>
                    <td className={message.isCorrect.name ? 'correct' : 'incorrect'}>{message.name}</td>
                    <td className={message.isCorrect.artists ? 'correct' : 'incorrect'}>{message.artists}</td>
                    <td className={message.isCorrect.album ? 'correct' : 'incorrect'}>{message.album}</td>
                    <td className={`${message.isCorrect.popularity ? 'correct' : 'incorrect'} ${getArrowClass(message.popularity, randomItem.popularity)}`}>
                        {message.popularity}
                    </td>
                    <td className={`${message.isCorrect.release_date ? 'correct' : 'incorrect'} ${getArrowClass(parseInt(message.release_date.split('-')[0]), parseInt(randomItem.release_date.split('-')[0]))}`}>
                        {message.release_date.split('-')[0]}
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default TableBody;
