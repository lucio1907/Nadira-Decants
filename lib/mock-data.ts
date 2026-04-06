import { Producto } from "@/types";

export const mockProductos: Producto[] = [
  {
    id: "1",
    slug: "bleu-de-chanel",
    nombre: "Bleu de Chanel",
    marca: "Chanel",
    descripcion:
      "Una fragancia amaderada y aromática que encarna la libertad. Fresca, profunda y sensual, Bleu de Chanel es un himno a la masculinidad libre de convenciones.",
    notas: {
      salida: ["Menta", "Pomelo", "Limón"],
      corazon: ["Jengibre", "Nuez Moscada", "Jazmín"],
      fondo: ["Incienso", "Cedro", "Sándalo"],
    },
    imagenes: ["/productos/bleu-de-chanel.jpg"],
    variantes: [
      { ml: 2, precio: 2500, stock: 20 },
      { ml: 5, precio: 5000, stock: 15 },
      { ml: 10, precio: 9000, stock: 10 },
      { ml: 30, precio: 22000, stock: 5 },
    ],
  },
  {
    id: "2",
    slug: "sauvage-dior",
    nombre: "Sauvage",
    marca: "Dior",
    descripcion:
      "Inspirado en vastos cielos abiertos que se despliegan sobre un paisaje desértico al caer la noche. Salvaje y noble a la vez.",
    notas: {
      salida: ["Pimienta de Calabria", "Bergamota"],
      corazon: ["Pimienta de Sichuan", "Lavanda", "Geranio"],
      fondo: ["Ambroxan", "Cedro", "Labdanum"],
    },
    imagenes: ["/productos/sauvage-dior.jpg"],
    variantes: [
      { ml: 2, precio: 2800, stock: 18 },
      { ml: 5, precio: 5500, stock: 12 },
      { ml: 10, precio: 10000, stock: 8 },
      { ml: 30, precio: 25000, stock: 3 },
    ],
  },
  {
    id: "3",
    slug: "aventus-creed",
    nombre: "Aventus",
    marca: "Creed",
    descripcion:
      "Una celebración de la fuerza, la visión y el éxito. Inspirada en la vida dramática de un emperador histórico, Aventus evoca poder y sofisticación.",
    notas: {
      salida: ["Piña", "Grosella Negra", "Manzana", "Bergamota"],
      corazon: ["Abedul", "Pachulí", "Rosa", "Jazmín"],
      fondo: ["Musgo de Roble", "Almizcle", "Ámbar", "Vainilla"],
    },
    imagenes: ["/productos/aventus-creed.jpg"],
    variantes: [
      { ml: 2, precio: 5000, stock: 10 },
      { ml: 5, precio: 10000, stock: 8 },
      { ml: 10, precio: 18000, stock: 5 },
      { ml: 30, precio: 45000, stock: 2 },
    ],
  },
  {
    id: "4",
    slug: "la-nuit-de-lhomme",
    nombre: "La Nuit de L'Homme",
    marca: "Yves Saint Laurent",
    descripcion:
      "Un perfume de contrastes: frescura y tensión, luminosidad y oscuridad. La seducción hecha fragancia para la vida nocturna.",
    notas: {
      salida: ["Cardamomo", "Bergamota", "Lavanda"],
      corazon: ["Cedro", "Comino"],
      fondo: ["Vetiver", "Tonka"],
    },
    imagenes: ["/productos/la-nuit-de-lhomme.jpg"],
    variantes: [
      { ml: 2, precio: 2200, stock: 25 },
      { ml: 5, precio: 4500, stock: 18 },
      { ml: 10, precio: 8000, stock: 12 },
      { ml: 30, precio: 20000, stock: 6 },
    ],
  },
  {
    id: "5",
    slug: "oud-wood-tom-ford",
    nombre: "Oud Wood",
    marca: "Tom Ford",
    descripcion:
      "Raro y lujoso. Oud Wood captura la esencia del más precioso de los ingredientes orientales: la madera de oud, envuelta en tonos especiados y ahumados.",
    notas: {
      salida: ["Oud", "Palo de Rosa", "Cardamomo"],
      corazon: ["Pimienta de Sichuan", "Sándalo"],
      fondo: ["Tonka", "Vetiver", "Ámbar"],
    },
    imagenes: ["/productos/oud-wood.jpg"],
    variantes: [
      { ml: 2, precio: 5500, stock: 8 },
      { ml: 5, precio: 11000, stock: 6 },
      { ml: 10, precio: 20000, stock: 4 },
      { ml: 30, precio: 50000, stock: 2 },
    ],
  },
  {
    id: "6",
    slug: "light-blue-dolce-gabbana",
    nombre: "Light Blue",
    marca: "Dolce & Gabbana",
    descripcion:
      "La esencia del verano mediterráneo capturada en un frasco. Fresca, frutal y envolvente, Light Blue evoca la sensualidad de la costa italiana.",
    notas: {
      salida: ["Cedro de Sicilia", "Manzana", "Campanilla"],
      corazon: ["Bambú", "Jazmín", "Rosa Blanca"],
      fondo: ["Cedro", "Almizcle", "Ámbar"],
    },
    imagenes: ["/productos/light-blue.jpg"],
    variantes: [
      { ml: 2, precio: 2000, stock: 22 },
      { ml: 5, precio: 4000, stock: 16 },
      { ml: 10, precio: 7500, stock: 10 },
      { ml: 30, precio: 18000, stock: 5 },
    ],
  },
];
