import React from 'react';
import '../../../styles/games/classic/AnswersTable.css';

type TableBodyProps = {
    guess: any[];        // liste des guesses
    randomItem: any;     // artiste à deviner
};

const TableBody: React.FC<TableBodyProps> = ({ guess, randomItem }) => {
    if (guess.length === 0) return null;

    return (
        <tbody>
            {guess.map((message, rowIndex) => {
                const isNewRow = rowIndex === 0;

                return (
                    <tr key={`${message.name}-${rowIndex}`} className={isNewRow ? 'new-row' : ''}>
                        <td
                            key={message.name}
                            className={message.isCorrect.name} // "correct" ou "incorrect"
                            style={isNewRow ? { animationDelay: `0s` } : { opacity: 1 }}
                        >
                            {message.name}
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
};

export default TableBody;
