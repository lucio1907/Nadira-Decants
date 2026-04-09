"use client";

import { Upload, X, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";

interface ImagesSectionProps {
  imagenes: string[];
  isDragging: boolean;
  uploadingImage: boolean;
  draggedIndex: number | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onRemove: (index: number) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortStart: (index: number) => void;
  onSortOver: (e: React.DragEvent, index: number) => void;
  onSortEnd: () => void;
  onSortDrop: (e: React.DragEvent) => void;
}

export const ImagesSection = ({
  imagenes,
  isDragging,
  uploadingImage,
  draggedIndex,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
  onImageUpload,
  onSortStart,
  onSortOver,
  onSortEnd,
  onSortDrop
}: ImagesSectionProps) => {
  return (
    <section className="nd-card space-y-4">
      <h2 className="text-display-sm font-display text-xl mb-4 border-b border-[var(--border)] pb-2">Imágenes</h2>

      <div className="bg-[var(--surface-raised)] p-4 rounded border border-[var(--border)] mb-6 text-sm">
        <p className="font-medium text-[var(--accent)] mb-2">Recomendaciones para una mejor visualización:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-[var(--text-secondary)] list-disc pl-5">
          <li><strong>Relación de aspecto:</strong> Usar formato vertical <strong>3:4</strong> (ej: 1200x1600 px).</li>
          <li><strong>Fondo:</strong> Se recomienda fondo <strong>transparente (PNG)</strong> o blanco puro.</li>
          <li><strong>Encuadre:</strong> Mantener un margen libre alrededor del producto.</li>
          <li><strong>Formato:</strong> El sistema optimiza y convierte las fotos a WebP automáticamente.</li>
        </ul>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging 
            ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-[1.01]" 
            : "border-[var(--border)] bg-[var(--surface-raised)]"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm rounded-xl border-2 border-[var(--accent)] animate-in fade-in duration-200 pointer-events-none">
             <div className="bg-[var(--accent)] p-4 rounded-full text-white mb-3 shadow-lg shadow-[var(--accent)]/20 animate-bounce">
                <Upload size={32} />
             </div>
             <p className="text-display-xs font-medium text-[var(--accent)]">Soltar para subir</p>
             <p className="text-sm text-[var(--text-secondary)]">Las fotos se optimizarán automáticamente</p>
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            {imagenes.map((img, i) => (
              <div 
                key={img + i}
                draggable
                onDragStart={() => onSortStart(i)}
                onDragOver={(e) => onSortOver(e, i)}
                onDragEnd={onSortEnd}
                onDrop={onSortDrop}
                className={`relative w-32 h-44 border-2 rounded-xl overflow-hidden transition-all duration-300 cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-lg ${
                  draggedIndex === i ? "opacity-30 scale-95 grayscale" : "opacity-100"
                } ${
                  i === 0 ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/10" : "border-[var(--border)]"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
                
                <div className="absolute top-2 left-2 flex items-center justify-center w-6 h-6 bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold text-white z-10 shadow-sm">
                  {i + 1}
                </div>

                <div className="absolute top-2 right-2 p-1 bg-black/30 backdrop-blur-sm rounded border border-white/10 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} />
                </div>

                {i === 0 ? (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-[var(--accent)]/90 backdrop-blur-sm text-black text-[10px] py-1 text-center font-bold uppercase tracking-widest rotate-[-15deg] scale-110 shadow-xl border-y border-black/10 z-10">
                    PORTADA
                  </div>
                ) : (
                   <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-sm p-1 text-center text-[9px] text-white/90 font-medium uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                      Imagen {i + 1}
                   </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(i);
                  }}
                  className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  title="Eliminar imagen"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className={`mt-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-[var(--border-visible)] rounded-xl transition-colors ${
            imagenes.length > 0 ? "py-6 bg-transparent" : "py-12 bg-[var(--surface-raised)]"
          }`}>
             <div className={`rounded-full mb-3 flex items-center justify-center transition-all ${
               imagenes.length > 0 ? "bg-[var(--surface-raised)] p-4" : "bg-[var(--accent-subtle)] p-6"
             }`}>
                <Upload size={imagenes.length > 0 ? 24 : 40} className="text-[var(--accent)]" />
             </div>
             
             {imagenes.length === 0 ? (
               <>
                 <h3 className="text-lg font-display mb-1 text-[var(--text-display)]">Carga las fotos de tu producto</h3>
                 <p className="text-sm text-[var(--text-primary)] max-w-xs mx-auto mb-6">Arrastra tus archivos aquí o haz clic en el botón para buscarlos en tu equipo.</p>
               </>
             ) : (
               <p className="text-sm text-[var(--text-primary)] font-medium mb-4">¿Quieres añadir más fotos? Arrástralas aquí</p>
             )}

             <label className="nd-btn-primary !min-h-fit !py-3 !px-6 cursor-pointer hover:scale-105 transition-transform">
                {imagenes.length > 0 ? "Añadir más fotos" : "Seleccionar Archivos"}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={onImageUpload} 
                  disabled={uploadingImage} 
                />
             </label>
          </div>
        </div>
      </div>
    </section>
  );
};
