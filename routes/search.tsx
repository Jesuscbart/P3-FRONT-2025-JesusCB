import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import BooksGrid from "../components/BooksGrid.tsx";
import axios from "axios";
import { SearchData } from "../types.ts";

// Handler para procesar las peticiones GET a la página de búsqueda
export const handler: Handlers<SearchData> = {
    async GET(req: Request, ctx: FreshContext) {
        // Obtenemos el parámetro de búsqueda 'q' de la URL
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";
        
        try {
            // Solo realizamos la búsqueda si hay un término de búsqueda
            if (query) {
                // REALIZAR BÚSQUEDA EN LA API
                // Creamos la URL para la petición a la API de Open Library
                const searchUrl = new URL("https://openlibrary.org/search.json");
                searchUrl.searchParams.append("q", query);
                
                // Hacemos la petición usando axios y la URL completa
                const response = await axios.get(searchUrl.toString());
                
                // Extraemos los libros del resultado o usamos un array vacío si no hay resultados
                const books = response.data.docs || [];
                
                // Devolvemos los datos para renderizar la página con los resultados
                return ctx.render({ query, books });
            }
            
            // Si no hay término de búsqueda, devolvemos datos vacíos
            return ctx.render({ query: "", books: [] });
        } catch (error) {
            // En caso de error, lo registramos y devolvemos una lista vacía
            console.error("Error en la búsqueda:", error);
            return ctx.render({ query, books: [] });
        }
    },
};

// Componente principal de la página de búsqueda
export default function Search({ data }: PageProps<SearchData>) {
    // Extraemos la consulta y los libros de los datos recibidos
    const { query, books } = data;

    return (
        <div>
            <h1>Buscar libros</h1>
            
            <form class="search-form" method="get">
                <input 
                    type="text" 
                    name="q" 
                    class="search-input" 
                    placeholder="Escribe el título de un libro" 
                    value={query}
                />
                <button type="submit" class="search-button">Buscar</button>
            </form>
            
            {query && (
                <div>
                    <h2>
                        {books.length > 0 
                            ? `Resultados para "${query}"`
                            : `No se encontraron libros con el título "${query}"`
                        }
                    </h2>
                    
                    <BooksGrid books={books} />
                </div>
            )}
        </div>
    );
}