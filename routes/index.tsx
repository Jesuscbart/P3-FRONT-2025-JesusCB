import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Book } from "../types.ts";
import { featuredBooks } from "../books_array.ts";
import BooksGrid from "../components/BooksGrid.tsx";
import axios from "axios";

// Handler que procesa la petición cuando un usuario visita la página principal
export const handler: Handlers<Book[]> = {
  async GET(_req: Request, ctx: FreshContext) {
    try {
      // Recorremos el array de títulos de libros destacados
      // y buscamos cada uno en la API de Open Library
      const booksPromises = featuredBooks.map(async (title) => {
        try {
          // Creamos la URL de búsqueda
          // La URL se construye automáticamente y maneja la codificación de caracteres especiales
          const searchUrl = new URL("https://openlibrary.org/search.json");
          
          // Añadimos el parámetro 'q' (query) con el título del libro
          // URLSearchParams se encarga automáticamente de codificar los caracteres especiales
          searchUrl.searchParams.append("q", title);
          
          // Hacemos la petición a la API usando la URL completa
          const response = await axios.get(searchUrl.toString());
          
          // Si encontramos resultados, devolvemos el primer libro
          if (response.data.docs && response.data.docs.length > 0) {
            return response.data.docs[0];
          }
          // Si no hay resultados, devolvemos null
          return null;
        } catch (error) {
          // Si hay error en la búsqueda de un libro específico, lo registramos
          console.error(`Error al buscar el libro "${title}":`, error);
          return null;
        }
      });
      
      // Esperamos a que todas las búsquedas terminen
      const results = await Promise.all(booksPromises);
      
      // Filtramos los valores null (libros no encontrados)
      const books = results.filter(book => book !== null) as Book[];
      
      // Enviamos los libros al componente para mostrarlos
      return ctx.render(books);
    } catch (error) {
      // Si hay un error general, mostramos una lista vacía
      console.error("Error en la página principal:", error);
      return ctx.render([]);
    }
  }
};

// Componente que renderiza la página principal con los libros destacados
export default function Home({ data: books }: PageProps<Book[]>) {
  return (
    <div>
      <h1>Libros destacados</h1>
      <BooksGrid books={books} />
    </div>
  );
}
