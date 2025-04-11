import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { BookData } from "../../types.ts";
import axios from "axios";

export const handler: Handlers<BookData> = {
    async GET(_req: Request, ctx: FreshContext) {
        // Obtener el ID del libro de los parámetros de la URL
        const id = ctx.params.id;
        
        try {
            // OBTENER DATOS DEL LIBRO
            // Hacemos la petición a la API de Open Library
            const url = `https://openlibrary.org/works/${id}.json`;
            const response = await axios.get(url);
            const bookData = response.data;
            
            // PROCESAR LA DESCRIPCIÓN
            // La descripción puede venir en diferentes formatos
            let description = "Sin descripción";
            if (typeof bookData.description === "string") {
                // Si es texto simple
                description = bookData.description;
            } else if (bookData.description?.value) {
                // Si es un objeto con propiedad 'value'
                description = bookData.description.value;
            }
            
            // OBTENER DATOS DEL AUTOR
            let authorName = "Autor desconocido";   //Declaramos el nombre del autor
            let authorId = "";                      //Declaramos el ID del autor
            
            if (bookData.authors && bookData.authors.length > 0) {
                // Extraemos la clave del autor del primer autor listado
                const authorKey = bookData.authors[0].author.key;
                authorId = authorKey.replace("/authors/", "");
                
                try {
                    // Obtenemos el nombre del autor haciendo otra petición
                    const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
                    authorName = authorResponse.data.name;
                } catch (error) {
                    console.error("Error al obtener el autor:", error);
                    // Si falla, mantenemos el nombre como "Autor desconocido"
                }
            }
            
            // OBTENER LA PORTADA
            let coverId = null;
            try {
                // Buscamos la portada en las ediciones del libro
                const coverResponse = await axios.get(`https://openlibrary.org/works/${id}/editions.json`);
                if (coverResponse.data.entries && coverResponse.data.entries.length > 0) {
                    // Tomamos la primera portada de la primera edición
                    coverId = coverResponse.data.entries[0].covers ? coverResponse.data.entries[0].covers[0] : null;
                }
            } catch (error) {
                console.error("Error al obtener la portada:", error);
                // Si falla, coverId sigue siendo null
            }

            // CREAR OBJETO LIBRO
            // Construimos el objeto con todos los datos procesados
            const book = {
                id,
                title: bookData.title,
                description,
                publish_date: bookData.first_publish_date || "No disponible",
                n_pages: bookData.number_of_pages || "No disponible",
                author: authorId,
                author_name: [authorName],
                cover_i: coverId
            };
            
            // Devolvemos los datos para renderizar la página
            return ctx.render(book);
        } catch (error) {
            // En caso de error, mostramos un mensaje
            console.error("Error al obtener detalles del libro:", error);
            return ctx.renderNotFound({ message: "Error al cargar el libro" });
        }
    },
};

export default function BookPage({ data: book }: PageProps<BookData>) {
    // Si no hay libro, mostramos un mensaje de error
    if (!book) {
        return (
            <div>
                <h1>Libro no encontrado</h1>
                <p>El libro que buscas no existe o no se pudo cargar.</p>
                <a href="/">Volver al inicio</a>
            </div>
        );
    }

    // PREPARAR DATOS DE VISUALIZACIÓN
    
    // Crear URL de la imagen de portada
    const coverUrl = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` // Si hay una portada, usamos la URL de la imagen
        : "/placeholder-book.png";                                    // Si no hay portada, usamos un placeholder
    
    // Obtener el nombre del autor
    const authorName = book.author_name ? book.author_name[0] : "Autor desconocido";

    // RENDERIZAR PÁGINA DE DETALLES
    return (
        <div class="book-detail">
            <div class="book-detail-layout">
                <div class="book-detail-cover">
                    <img src={coverUrl} alt={`Portada de ${book.title}`} />
                </div>
                <div class="book-detail-info">
                    <h1>{book.title}</h1>
                    
                    {book.author && (
                        <p class="book-author">
                            Autor: <a href={`/author/${book.author}`} class="author-link">
                                {authorName}
                            </a>
                        </p>
                    )}
                    
                    <div>
                        <h2>Descripción</h2>
                        <p>{book.description}</p>
                    </div>
                    
                    <div class="book-detail-meta">
                        <div class="book-meta-item">
                            <p class="book-meta-label">Fecha de publicación</p>
                            <p>{book.publish_date}</p>
                        </div>
                        
                        <div class="book-meta-item">
                            <p class="book-meta-label">Número de páginas</p>
                            <p>{book.n_pages}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
