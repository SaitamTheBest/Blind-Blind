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
        {guess.map((message, rowIndex) => {
            const isNewRow = rowIndex === 0; // Toujours la première ligne du tableau (nouvelle réponse ajoutée)

            return (
                <tr key={`${message.name}-${rowIndex}`} className={isNewRow ? 'new-row' : ''}>
                    {[
                        { value: message.artists.join(', '), className: message.isCorrect.artists },
                        { value: message.album, className: message.isCorrect.album },
                        { value: message.genres.join(', '), className: message.isCorrect.genres },
                        {
                            value: message.popularity,
                            className: `${message.isCorrect.popularity} ${getArrowClass(message.popularity, randomItem.popularity)}`
                        },
                        {
                            value: message.release_date.split('-')[0],
                            className: `${message.isCorrect.release_date} ${getArrowClass(parseInt(message.release_date.split('-')[0]), parseInt(randomItem.release_date.split('-')[0]))}`
                        },
                        { value: message.name, className: message.isCorrect.name }
                    ].map((cell, colIndex) => (
                        <td
                            key={`${message.name}-${colIndex}`} // Forcer React à re-render chaque cellule
                            className={cell.className}
                            style={isNewRow ? { animationDelay: `${colIndex * 0.4}s` } : { opacity: 1, transform: "translateX(0)" }}
                        >
                            {cell.value}
                        </td>
                    ))}
                </tr>
            );
        })}
        </tbody>
    );
};

export default TableBody;
