import React, { useState, useRef, useEffect } from 'react';
import { Smile, Upload } from 'lucide-react';

const MemeGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = [
    "🔥", "👑", "⭐", "💪", "🎮", "🎯", "🎪", "🚀", 
    "💣", "⚔️", "🛡️", "🎭", "🏆", "✨", "💯", "🔫"
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleEmojiClick = (emoji) => {
    if (activeInput === 'top') {
      setTopText(topText + emoji);
    } else if (activeInput === 'bottom') {
      setBottomText(bottomText + emoji);
    }
  };

  const drawMeme = (ctx, image) => {
    // Dibuja la imagen
    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // Configura el estilo del texto
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px Arial';

    // Dibuja el texto superior
    if (topText) {
      ctx.strokeText(topText, ctx.canvas.width / 2, 40);
      ctx.fillText(topText, ctx.canvas.width / 2, 40);
    }

    // Dibuja el texto inferior
    if (bottomText) {
      ctx.strokeText(bottomText, ctx.canvas.width / 2, ctx.canvas.height - 20);
      ctx.fillText(bottomText, ctx.canvas.width / 2, ctx.canvas.height - 20);
    }

    // Dibuja el logo
    const logo = new Image();
    logo.src = 'https://trucosff.com/wp-content/uploads/2024/05/cropped-TRUCOSFF-200x40.png';
    logo.onload = () => {
      ctx.globalAlpha = 0.7;
      ctx.drawImage(logo, ctx.canvas.width - 100, ctx.canvas.height - 30, 90, 20);
      ctx.globalAlpha = 1.0;
    };
  };

  const handleDownload = () => {
    if (!imageUrl) {
      alert('Por favor, sube una imagen primero');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imageUrl;
    
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      drawMeme(ctx, image);
      
      try {
        const link = document.createElement('a');
        link.download = `trucosff-meme-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Error al descargar:', err);
        alert('Hubo un error al descargar. Por favor, intenta de nuevo.');
      }
    };
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Generador de Memes Free Fire
      </h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {imageUrl ? 'Haz clic para cambiar la imagen' : 'Haz clic para subir tu imagen'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Texto Superior:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              onFocus={() => setActiveInput('top')}
              placeholder="Escribe el texto superior..."
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setActiveInput('top');
              }}
              className="p-2 border rounded-md hover:bg-gray-50"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Texto Inferior:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              onFocus={() => setActiveInput('bottom')}
              placeholder="Escribe el texto inferior..."
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setActiveInput('bottom');
              }}
              className="p-2 border rounded-md hover:bg-gray-50"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showEmojiPicker && (
          <div className="p-2 bg-white border rounded-lg shadow-lg">
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-xl hover:bg-gray-100 p-1 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Imagen del meme"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-0 right-0 text-center">
                  <h2 className="text-2xl font-bold text-white uppercase break-words px-4 shadow-text">
                    {topText || ""}
                  </h2>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <h2 className="text-2xl font-bold text-white uppercase break-words px-4 shadow-text">
                    {bottomText || ""}
                  </h2>
                </div>
                <div className="absolute bottom-1 right-1 opacity-70">
                  <img
                    src="https://trucosff.com/wp-content/uploads/2024/05/cropped-TRUCOSFF-200x40.png"
                    alt="TrucosFF"
                    className="h-6 object-contain"
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Sube una imagen para crear tu meme</p>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <button
          onClick={handleDownload}
          disabled={!imageUrl}
          className={`w-full font-bold py-2 px-4 rounded ${
            imageUrl 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Descargar Meme
        </button>
      </div>

      <style jsx global>{`
        .shadow-text {
          text-shadow: 2px 2px 0 #000,
                      -2px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px 2px 0 #000;
        }
      `}</style>
    </div>
  );
};

export default MemeGenerator;
