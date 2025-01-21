import React, { useState, useEffect } from "react";
import GuessInput from "./GuessInput";
import '../../../styles/games/classic/classic.css';


const ClassicMode: React.FC = () => {
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Devinez la chanson !</h1>
                <div>
                    <p>Indices trouvés :</p>
                    <div style={{ marginBottom: "20px" }}>
                        <p>Genre : None</p>
                        <p>Artiste : None</p>
                        <p>Album : None</p>
                        <p>Année : None</p>
                        <p>Popularité : None</p>
                    </div>
                    <GuessInput />
                    <h3>Propositions :</h3>
                </div>
        </div>
    );
};

export default ClassicMode;
