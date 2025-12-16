import React, { useEffect, useRef } from "react";

type Props = {
    imageUrl: string;
    attempts: number;
    maxAttempts?: number;
};

const ArtistPixelImage: React.FC<Props> = ({
    imageUrl,
    attempts,
    maxAttempts = 10
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!imageUrl) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const size = 300;
            canvas.width = size;
            canvas.height = size;

            // 🔢 Niveau de pixelisation
            const pixelFactor = Math.max(
                1,
                Math.floor((maxAttempts - attempts) * 4)
            );

            // Canvas temporaire (pixelisation)
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = size / pixelFactor;
            tempCanvas.height = size / pixelFactor;

            const tempCtx = tempCanvas.getContext("2d");
            if (!tempCtx) return;

            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(
                tempCanvas,
                0,
                0,
                tempCanvas.width,
                tempCanvas.height,
                0,
                0,
                size,
                size
            );
        };
    }, [imageUrl, attempts, maxAttempts]);

    return (
        <div style={{ margin: "20px 0", textAlign: "center" }}>
            <canvas
                ref={canvasRef}
                style={{
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                }}
            />
        </div>
    );
};

export default ArtistPixelImage;
