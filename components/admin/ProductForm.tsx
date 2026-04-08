"use client";

import { Producto, Variante } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAlert } from "@/hooks/useAlert";
import { Trash2, Plus, Upload, X } from "lucide-react";

import imageCompression from "browser-image-compression";


type FormVariante = {
  ml: string | number;
  precio: string | number;
  stock: string | number;
  costo: string | number;
};

type FormProductData = Omit<Producto, "id" | "variantes"> & {
  variantes: FormVariante[];
};

const emptyForm: FormProductData = {
  slug: "",
  nombre: "",
  marca: "",
  descripcion: "",
  notas: { salida: [], corazon: [], fondo: [] },
  imagenes: [],
  variantes: [{ ml: 10, precio: 0, stock: 0, costo: 0 }],
  mlTotalesBotella: 100,
};

export function ProductForm({ initialData, isEdit = false }: { initialData?: Producto, isEdit?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();


  // Transform initial data if provided
  const getInitialState = (): FormProductData => {
    if (!initialData) return emptyForm;
    return {
      ...initialData,
      ml_totales_botella: initialData.mlTotalesBotella || 100,
      variantes: initialData.variantes.map(v => ({
        ml: v.ml,
        precio: v.precio,
        stock: v.stock,
        costo: v.costo || 0
      }))
    } as any;
  };

  const [formData, setFormData] = useState<FormProductData>(getInitialState());

  // Basic Fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;

    // Capitalizar primera letra si es nombre o descripción
    if ((name === "nombre" || name === "descripcion") && value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    // Capitalizar cada palabra en la marca (estilo Carolina Herrera)
    if (name === "marca" && value.length > 0) {
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    setFormData((prev: FormProductData) => ({
      ...prev,
      [name]: value,
      ...(name === "nombre" && !isEdit ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') } : {})
    }));
  };

  // Variantes
  const addVariante = () => {
    setFormData((prev: FormProductData) => ({
      ...prev,
      variantes: [...prev.variantes, { ml: 0, precio: 0, stock: 0, costo: 0 }]
    }));
  };
  const removeVariante = (index: number) => {
    setFormData((prev: FormProductData) => ({
      ...prev,
      variantes: prev.variantes.filter((_, i) => i !== index)
    }));
  };
  const updateVariante = (index: number, field: keyof FormVariante, value: string | number) => {
    const newVariantes = [...formData.variantes];
    newVariantes[index] = { ...newVariantes[index], [field]: value };
    setFormData((prev: FormProductData) => ({ ...prev, variantes: newVariantes }));
  };

  // Notas
  const handleNotaChange = (tipo: keyof Producto['notas'], index: number, value: string) => {
    const newNotas = [...formData.notas[tipo]];
    newNotas[index] = value;
    setFormData((prev: FormProductData) => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: newNotas }
    }));
  };
  const addNota = (tipo: keyof Producto['notas']) => {
    setFormData((prev: FormProductData) => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: [...prev.notas[tipo], ""] }
    }));
  };
  const removeNota = (tipo: keyof Producto['notas'], index: number) => {
    setFormData((prev: FormProductData) => ({
      ...prev,
      notas: { ...prev.notas, [tipo]: prev.notas[tipo].filter((_, i) => i !== index) }
    }));
  };

  // Images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);

    try {
      for (const file of Array.from(e.target.files)) {
        // Validar tamaño máximo inicial (ej. 10MB) para prevenir problemas de memoria en el navegador
        if (file.size > 10 * 1024 * 1024) {
          showAlert(`La imagen ${file.name} es demasiado grande para procesar (máx 10MB).`, { type: "warning" });
          continue;
        }


        let fileToUpload = file;

        // Comprimir y convertir a WebP
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: "image/webp" as string,
            initialQuality: 0.8,
          };

          const compressedFile = await imageCompression(file, options);

          // Asegurar que el nombre tenga extensión .webp
          const fileName = file.name.includes(".")
            ? file.name.substring(0, file.name.lastIndexOf("."))
            : file.name;

          fileToUpload = new File([compressedFile], `${fileName}.webp`, { type: "image/webp" });
        } catch (compressionError) {
          console.error("Error al comprimir:", compressionError);
          // Si falla la compresión, intentamos subir el original si no es excesivo (ej. 1MB)
          if (file.size > 1 * 1024 * 1024) {
            showAlert(`No se pudo optimizar la imagen ${file.name} y es demasiado pesada.`, { type: "warning" });
            continue;
          }

        }

        const data = new FormData();
        data.append("file", fileToUpload);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: data,
        });
        const json = await res.json();
        if (json.url) {
          setFormData((prev: FormProductData) => ({ ...prev, imagenes: [...prev.imagenes, json.url] }));
        } else if (json.error) {
          showAlert(`Error al subir ${file.name}: ${json.error}`, { type: "error" });
        }

      }
    } catch (err) {
      console.error(err);
      showAlert("Error al procesar o subir imagen", { type: "error" });
    } finally {

      setUploadingImage(false);
      // Reset input
      if (e.target) e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: FormProductData) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/productos/${initialData?.id}` : `/api/productos`;
      const method = isEdit ? "PUT" : "POST";

      // Validación: Al menos una variante
      if (formData.variantes.length === 0) {
        showAlert("Debes agregar al menos una variante.", { type: "warning" });
        setLoading(false);
        return;
      }

      // Validación: Precios mayores a 0
      const hasInvalidPrice = formData.variantes.some(v => Number(v.precio) <= 0);
      if (hasInvalidPrice) {
        showAlert("Todas las variantes deben tener un precio mayor a 0.", { type: "warning" });
        setLoading(false);
        return;
      }

      // Asegurar que los valores numéricos de las variantes sean números antes de enviar
      const sanitizedVariantes = formData.variantes.map((v) => ({
        ...v,
        ml: Number(v.ml) || 0,
        precio: Number(v.precio) || 0,
        stock: Number(v.stock) || 0,
        costo: Number(v.costo) || 0,
      }));

      const payload = {
        ...formData,
        variantes: sanitizedVariantes,
        mlTotalesBotella: Number(formData.mlTotalesBotella) || 0,
        id: initialData?.id
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // En Next.js, router.push a una página ya visitada puede usar el caché del cliente.
        // Llamamos a refresh() antes o después para asegurar que el servidor mande datos nuevos.
        router.push("/admin/productos");
        router.refresh(); 
      } else {
        const errorData = await res.json().catch(() => ({}));
        showAlert(`Error al guardar el producto: ${errorData.error || "Error desconocido"}`, { type: "error" });
      }
    } catch (err) {
      showAlert("Error de red al intentar guardar el producto", { type: "error" });
    } finally {

      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-12">
      {/* Información Básica */}
      <section className="nd-card space-y-6">
        <h2 className="text-display-sm font-display mb-4 border-b border-[var(--border)] pb-2 text-xl">Información Básica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-nd-label mb-2 block">Nombre del Producto</label>
            <input required name="nombre" value={formData.nombre} onChange={handleChange} className="nd-input" />
          </div>
          <div>
            <label className="text-nd-label mb-2 block">Marca</label>
            <input required name="marca" value={formData.marca} onChange={handleChange} className="nd-input" />
          </div>
          <div>
            <label className="text-nd-label mb-2 block">Slug (URL)</label>
            <input required name="slug" value={formData.slug} onChange={handleChange} className="nd-input" />
          </div>
          <div className="md:col-span-2">
            <label className="text-nd-label mb-2 block">Descripción</label>
            <textarea required name="descripcion" value={formData.descripcion} onChange={handleChange} className="nd-input" rows={4} />
          </div>
          <div>
            <label className="text-nd-label mb-2 block">Capacidad Botella Original (ml)</label>
            <input
              required
              type="text"
              inputMode="numeric"
              name="mlTotalesBotella"
              value={formData.mlTotalesBotella || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d*$/.test(val)) {
                  setFormData(prev => ({ ...prev, mlTotalesBotella: val === "" ? 0 : Number(val) }));
                }
              }}
              className="nd-input"
            />
          </div>
        </div>
      </section>

      {/* Variantes */}
      <section className="nd-card space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-4">
          <h2 className="text-display-sm font-display text-xl">Variantes (Tamaños)</h2>
          <button type="button" onClick={addVariante} className="nd-btn-ghost flex items-center gap-2 !p-2">
            <Plus size={16} /> Agregar
          </button>
        </div>

        <div className="space-y-4">
          {formData.variantes.map((v, i) => (
            <div key={i} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-[var(--surface-raised)] p-4 rounded border border-[var(--border)]">
              <div className="flex-1 min-w-[100px]">
                <label className="text-nd-label block mb-1">Volumen (ml)</label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={v.ml}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*$/.test(val)) {
                      updateVariante(i, "ml", val);
                    }
                  }}
                  className="nd-input !pt-2 !pb-2"
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-nd-label block mb-1">Precio ($)</label>
                <input
                  required
                  type="text"
                  inputMode="decimal"
                  value={v.precio}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                      updateVariante(i, "precio", val);
                    }
                  }}
                  className="nd-input !pt-2 !pb-2"
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-nd-label block mb-1">Stock</label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={v.stock}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*$/.test(val)) {
                      updateVariante(i, "stock", val);
                    }
                  }}
                  className="nd-input !pt-2 !pb-2"
                />
              </div>
              <div className="flex-1 min-w-[100px]">
                <label className="text-nd-label block mb-1">Costo ($)</label>
                <input
                  required
                  type="text"
                  inputMode="decimal"
                  value={v.costo}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                      updateVariante(i, "costo", val);
                    }
                  }}
                  className="nd-input !pt-2 !pb-2"
                />
              </div>
              <button type="button" onClick={() => removeVariante(i)} className="p-2 mb-2 text-[#D71921] hover:bg-[rgba(215,25,33,0.05)] rounded">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {formData.variantes.length === 0 && <p className="text-[var(--text-secondary)] text-sm">Debes agregar al menos una variante.</p>}
        </div>
      </section>

      {/* Notas Olfativas */}
      <section className="nd-card space-y-6">
        <h2 className="text-display-sm font-display text-xl mb-4 border-b border-[var(--border)] pb-2">Notas Olfativas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['salida', 'corazon', 'fondo'] as const).map(tipo => (
            <div key={tipo}>
              <h3 className="text-nd-label block mb-4 capitalize">{tipo}</h3>
              <div className="space-y-2">
                {formData.notas[tipo].map((nota, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={nota}
                      onChange={(e) => handleNotaChange(tipo, i, e.target.value)}
                      className="nd-input !py-1 flex-1"
                      placeholder={`Nota de ${tipo}`}
                    />
                    <button type="button" onClick={() => removeNota(tipo, i)} className="text-[var(--text-secondary)] hover:text-[#D71921]">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addNota(tipo)} className="text-[var(--accent)] text-sm font-body font-medium flex items-center mt-2">
                  <Plus size={14} className="mr-1" /> Agregar nota
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Imágenes */}
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

        <div className="flex flex-wrap gap-4 mb-4">
          {formData.imagenes.map((img, i) => (
            <div key={i} className="relative w-32 h-32 border border-[var(--border)] rounded overflow-hidden group">
              <Image
                src={img}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute z-10 top-1 right-1 bg-black/60 p-1 rounded hover:bg-[#D71921] transition-colors"
              >
                <X size={16} color="white" />
              </button>
            </div>
          ))}
          <label className="w-32 h-32 border border-dashed border-[var(--border-visible)] hover:border-[var(--accent)] rounded flex flex-col items-center justify-center cursor-pointer transition-colors">
            {uploadingImage ? (
              <span className="text-xs text-[var(--accent)] nd-loading-blink">Subiendo...</span>
            ) : (
              <>
                <Upload size={24} className="text-[var(--text-secondary)] mb-2" />
                <span className="text-xs text-[var(--text-secondary)]">Subir</span>
              </>
            )}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={() => router.back()} className="nd-btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="nd-btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
