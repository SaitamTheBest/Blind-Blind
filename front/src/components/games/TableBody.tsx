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
            return 'td-arrow-up incorrect';
        } else if (value < reference) {
            return 'td-arrow-down incorrect';
        } else {
            return 'correct';
        }
    };

    return (
        <tbody>
        {guess.map((message, rowIndex) => {
            const isNewRow = rowIndex === 0;

            return (
                <tr key={`${message.name}-${rowIndex}`} className={isNewRow ? 'new-row' : ''}>
                    {[
                        { value: message.artists.join(', '), className: message.isCorrect.artists },
                        { value: message.album, className: message.isCorrect.album },
                        { value: message.nationality.join(', '), className: message.isCorrect.nationality},
                        { value: message.genres.join(', '), className: message.isCorrect.genres },
                        {
                            value: message.followers.toLocaleString('fr-FR'),
                            className: `${message.isCorrect.followers} ${getArrowClass(message.followers, randomItem.followers)}`
                        },
                        {
                            value: message.popularity,
                            className: `${message.isCorrect.popularity} ${getArrowClass(message.popularity, randomItem.popularity)}`
                        },
                        {
                            value: message.release_year,
                            className: `${message.isCorrect.release_year} ${getArrowClass(parseInt(message.release_year), parseInt(randomItem.release_year))}`
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
