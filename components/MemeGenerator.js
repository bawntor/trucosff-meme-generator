import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Smile, Upload } from 'lucide-react';

const MemeGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
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

  const handleDownload = () => {
    if (!imageUrl) {
      alert('Por favor, sube una imagen primero');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Cargar la imagen principal
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Dibujar la imagen principal
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Configurar el estilo del texto
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.font = 'bold 40px Arial';

      // Dibujar textos
      if (topText) {
        ctx.strokeText(topText, canvas.width / 2, 50);
        ctx.fillText(topText, canvas.width / 2, 50);
      }
      if (bottomText) {
        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 30);
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 30);
      }

      // Cargar y dibujar el logo
      const logo = new Image();
      logo.crossOrigin = "Anonymous";
      logo.onload = () => {
        // Calcular dimensiones del logo (20% del ancho de la imagen)
        const logoWidth = canvas.width * 0.2;
        const logoHeight = (logoWidth * logo.height) / logo.width;
        
        // Dibujar logo con transparencia
        ctx.globalAlpha = 0.7;
        ctx.drawImage(logo, 
          canvas.width - logoWidth - 10, // 10px del borde derecho
          canvas.height - logoHeight - 10, // 10px del borde inferior
          logoWidth, 
          logoHeight
        );
        ctx.globalAlpha = 1.0;

        // Descargar la imagen
        const link = document.createElement('a');
        link.download = `trucosff-meme-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      logo.src = 'https://trucosff.com/wp-content/uploads/2024/05/cropped-TRUCOSFF-200x40.png';
    };
    image.src = imageUrl;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Generador de Memes Free Fire</CardTitle>
      </CardHeader>
      <CardContent>
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
            <label className="text-sm font-medium">Texto Superior:</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                onFocus={() => setActiveInput('top')}
                placeholder="Escribe el texto superior..."
                className="w-full"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setActiveInput('top');
                }}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Texto Inferior:</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                onFocus={() => setActiveInput('bottom')}
                placeholder="Escribe el texto inferior..."
                className="w-full"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setActiveInput('bottom');
                }}
              >
                <Smile className="h-4 w-4" />
              </Button>
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
            <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
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

          <Button 
            onClick={handleDownload}
            disabled={!imageUrl}
            className="w-full"
          >
            Descargar Meme
          </Button>
        </div>
      </CardContent>

      <style jsx global>{`
        .shadow-text {
          text-shadow: 2px 2px 0 #000,
                      -2px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px 2px 0 #000;
        }
      `}</style>
    </Card>
  );
};

export default MemeGenerator;
