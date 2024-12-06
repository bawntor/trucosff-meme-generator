import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Smile, Upload } from 'lucide-react';

const MemeGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const memeRef = useRef(null);
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

  const handleDownload = async () => {
    if (!imageUrl) {
      alert('Por favor, sube una imagen primero');
      return;
    }
    
    try {
      const dataUrl = await toPng(memeRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `trucosff-meme-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al descargar el meme:', err);
      alert('Hubo un error al descargar el meme. Por favor, intenta de nuevo.');
    }
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
