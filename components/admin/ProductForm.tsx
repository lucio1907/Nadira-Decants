"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Producto, Variante, NotasOlfativas } from "@/types";
import { useAlert } from "@/hooks/useAlert";
import imageCompression from "browser-image-compression";

import { BasicInfoSection } from "./product-form/BasicInfoSection";
import { VariantsSection } from "./product-form/VariantsSection";
import { NotesSection } from "./product-form/NotesSection";
import { ImagesSection } from "./product-form/ImagesSection";
import { upsertProductAction } from "@/app/admin/(dashboard)/productos/actions";

interface ProductFormProps {
  initialData?: Producto;
  isEdit?: boolean;
}

const emptyForm: Omit<Producto, "id"> = {
  slug: "",
  nombre: "",
  marca: "",
  descripcion: "",
  notas: { salida: [], corazon: [], fondo: [] },
  imagenes: [],
  variantes: [{ 
    ml: 10, 
    precio: 0, 
    stock: 0, 
    costo: 0,
  }],
  mlTotalesBotella: 100,
  genero: "Unisex",
};

export const ProductForm = ({ initialData, isEdit = false }: ProductFormProps) => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isPending, startTransition] = useTransition();
  const [uploadingImage, setUploadingImage] = useState(false);
  // Drag and drop state for images
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Producto>(() => {
    if (!initialData) return { ...emptyForm, id: "" } as Producto;
    return {
      ...initialData,
      mlTotalesBotella: initialData.mlTotalesBotella || 100,
      variantes: initialData.variantes.map(v => ({
        ...v,
        costo: v.costo || 0,
      }))
    };
  });

  // Basic Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Capitalization logic
    if ((name === "nombre" || name === "descripcion") && value.length > 0) {
      newValue = value.charAt(0).toUpperCase() + value.slice(1);
    }
    if (name === "marca" && value.length > 0) {
      newValue = value.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === "nombre" && !isEdit ? {
        slug: newValue.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      } : {})
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Variant Handlers
  const addVariante = () => {
    setFormData(prev => ({
      ...prev,
      variantes: [...prev.variantes, { ml: 0, precio: 0, stock: 0, costo: 0 }]
    }));
  };

  const removeVariante = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variantes: prev.variantes.filter((_, i) => i !== index)
    }));
  };

  const updateVariante = (index: number, field: keyof Variante, value: string | number) => {
    setFormData(prev => {
      const newVariantes = [...prev.variantes];
      newVariantes[index] = { ...newVariantes[index], [field]: value };
      return { ...prev, variantes: newVariantes };
    });
  };

  // Notes Handlers
  const handleNotaChange = (tipo: keyof NotasOlfativas, index: number, value: string) => {
    setFormData(prev => {
      const newNotas = [...prev.notas[tipo]];
      newNotas[index] = value;
      return { ...prev, notas: { ...prev.notas, [tipo]: newNotas } };
    });
  };

  const addNota = (tipo: keyof NotasOlfativas) => {
    setFormData(prev => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: [...prev.notas[tipo], ""] }
    }));
  };

  const removeNota = (tipo: keyof NotasOlfativas, index: number) => {
    setFormData(prev => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: prev.notas[tipo].filter((_, i) => i !== index) }
    }));
  };

  // Image Handlers
  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploadingImage(true);

    try {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          showAlert(`La imagen ${file.name} es demasiado grande (máx 10MB).`, { type: "warning" });
          continue;
        }

        let fileToUpload = file;
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: 0.8,
          };
          const compressedFile = await imageCompression(file, options);
          const fileName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          fileToUpload = new File([compressedFile], `${fileName}.webp`, { type: "image/webp" });
        } catch (err) {
          console.error("Compression failed, using original:", err);
        }

        const data = new FormData();
        data.append("file", fileToUpload);
        const res = await fetch("/api/admin/upload", { method: "POST", body: data });
        const json = await res.json();
        if (json.url) {
          setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, json.url] }));
        } else {
          showAlert(`Error al subir ${file.name}: ${json.error || "Error desconocido"}`, { type: "error" });
        }
      }
    } catch (err) {
      console.error(err);
      showAlert("Error al procesar o subir imagen", { type: "error" });
    } finally {
      setUploadingImage(false);
    }
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await handleFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null && e.dataTransfer.types.includes('Files')) setIsDragging(true);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (draggedIndex === null && e.dataTransfer.files.length > 0) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Sorting Handlers
  const onSortStart = (index: number) => setDraggedIndex(index);
  const onSortEnd = () => setDraggedIndex(null);
  const onSortDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedIndex(null);
  };

  const onSortOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setFormData(prev => {
      const newImages = [...prev.imagenes];
      const item = newImages.splice(draggedIndex, 1)[0];
      newImages.splice(index, 0, item);
      return { ...prev, imagenes: newImages };
    });
    setDraggedIndex(index);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.variantes.length === 0) {
      showAlert("Debes agregar al menos una variante.", { type: "warning" });
      return;
    }

    startTransition(async () => {
      const result = await upsertProductAction(formData);
      if (result.success) {
        showAlert(isEdit ? "Producto actualizado correctamente" : "Producto creado correctamente", { type: "success" });
        router.push("/admin/productos");
        router.refresh();
      } else {
        showAlert(result.error || "Error al guardar el producto", { type: "error" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-12">
      <BasicInfoSection
        formData={formData}
        isEdit={isEdit}
        onChange={handleChange}
        onNumberChange={handleNumberChange}
      />

      <VariantsSection
        variantes={formData.variantes}
        onAdd={addVariante}
        onRemove={removeVariante}
        onUpdate={updateVariante}
      />

      <NotesSection
        notas={formData.notas}
        onChange={handleNotaChange}
        onAdd={addNota}
        onRemove={removeNota}
      />

      <ImagesSection
        imagenes={formData.imagenes}
        isDragging={isDragging}
        uploadingImage={uploadingImage}
        draggedIndex={draggedIndex}
        onDragOver={onDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onRemove={removeImage}
        onImageUpload={onImageUpload}
        onSortStart={onSortStart}
        onSortOver={onSortOver}
        onSortEnd={onSortEnd}
        onSortDrop={onSortDrop}
      />

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="nd-btn-secondary"
          disabled={isPending}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="nd-btn-primary"
          disabled={isPending || uploadingImage}
        >
          {isPending ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
};
