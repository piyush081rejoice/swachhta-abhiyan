import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, CheckCircle2, PenTool } from 'lucide-react';

export default function SignaturePad({ onSave, initialValue = null }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(initialValue));
  const [history, setHistory] = useState([]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    const ratio = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = Math.max(280, rect.width - 4);
    const height = Math.min(220, Math.max(160, window.innerWidth < 640 ? 150 : 180));

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);

    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#020617';

    if (initialValue) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = initialValue;
    }
  };

  const getTrimmedSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let minX = width, minY = height, maxX = 0, maxY = 0;
      let found = false;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 15) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            found = true;
          }
        }
      }

      if (!found) return null;

      // Add small 8px padding around strokes
      const pad = 12;
      minX = Math.max(0, minX - pad);
      minY = Math.max(0, minY - pad);
      maxX = Math.min(width, maxX + pad);
      maxY = Math.min(height, maxY + pad);

      const trimW = maxX - minX;
      const trimH = maxY - minY;

      const trimmed = document.createElement('canvas');
      trimmed.width = trimW;
      trimmed.height = trimH;
      const tCtx = trimmed.getContext('2d');

      tCtx.drawImage(
        canvas,
        minX, minY, trimW, trimH,
        0, 0, trimW, trimH
      );

      return trimmed.toDataURL('image/png');
    } catch {
      return canvas.toDataURL('image/png');
    }
  };

  useEffect(() => {
    initCanvas();
    const ro = new ResizeObserver(() => {
      // Don't wipe existing drawing on small resizes unless empty
      if (!hasSignature) {
        initCanvas();
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-10), canvas.toDataURL()]);
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    saveState();
    if (canvasRef.current && onSave) {
      const trimmed = getTrimmedSignature();
      onSave(trimmed || canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
    setHasSignature(false);
    setHistory([]);
    if (onSave) onSave(null);
  };

  const undoLast = () => {
    if (history.length <= 1) {
      clearCanvas();
      return;
    }
    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previousState = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      if (onSave) {
        const trimmed = getTrimmedSignature();
        onSave(trimmed || canvas.toDataURL('image/png'));
      }
    };
    img.src = previousState;
  };

  return (
    <div className="signature-pad-wrapper">
      <div className="signature-header">
        <div className="signature-title">
          <PenTool size={16} className="text-emerald-600" />
          <span>નાગરિકની ડિજિટલ સહી (Citizen's Digital Signature)</span>
          {hasSignature && (
            <span className="signature-badge">
              <CheckCircle2 size={13} /> સહી થયેલ છે
            </span>
          )}
        </div>
        <div className="signature-actions">
          <button
            type="button"
            onClick={undoLast}
            disabled={history.length <= 1}
            className="sig-btn"
            title="છેલ્લો સ્ટ્રોક પાછો ખેંચો"
          >
            <RotateCcw size={14} /> પાછું (Undo)
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="sig-btn text-rose-600"
            title="સહી સાફ કરો"
          >
            <Trash2 size={14} /> સાફ કરો (Clear)
          </button>
        </div>
      </div>

      <div className="canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="signature-placeholder">
            <span className="placeholder-text">✍️ અહીં માઉસ અથવા આંગળી વડે સહી કરો (Sign here)</span>
            <span className="placeholder-line"></span>
          </div>
        )}
      </div>
      <p className="signature-help">
        * આ સહી સંકલ્પ પત્રના PDF દસ્તાવેજમાં "નાગરિકની સહી" ની જગ્યાએ આપમેળે છપાશે.
      </p>
    </div>
  );
}
