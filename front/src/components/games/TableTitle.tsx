import React from 'react';
import '../../styles/games/classic/AnswersTable.css';

type TableTitleProps = {
    titles: string[];
};

const TableTitle: React.FC<TableTitleProps> = ({ titles }) => {
    return (
        <thead>
            <tr>
                {titles.map((title: string, index: number) => (
                    <th key={index}>
                        {title}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableTitle