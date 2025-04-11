import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Work, AuthorData } from "../../types.ts";
import AuthorInfo from "../../components/AuthorInfo.tsx";
import axios from "axios";

export const handler: Handlers<AuthorData> = {
    async GET(_req: Request, ctx: FreshContext) {
        // Obtener el ID del autor de los parámetros de la URL
        const id = ctx.params.id;
        
        try {
            // OBTENER DATOS DEL AUTOR
            // Hacemos la petición a la API de Open Library para obtener los datos del autor
            const authorResponse = await axios.get(`https://openlibrary.org/authors/${id}.json`);

            const authorData = authorResponse.data;
            
            // Procesamos la biografía del autor, que puede venir en diferentes formatos
            let bio = "Sin biografía disponible";
            if (typeof authorData.bio === "string") {
                // Si la biografía es un texto simple
                bio = authorData.bio;
            } else if (authorData.bio?.value) {
                // Si la biografía es un objeto con una propiedad 'value'
                bio = authorData.bio.value;
            }
            
            // Creamos el objeto autor con los datos obtenidos
            const author = {
                ...authorData,  // Copiamos los datos del autor
                id,
                bio
            };
            
            // OBTENER LOS LIBROS DEL AUTOR
            // Hacemos la petición para obtener las obras del autor
            const worksResponse = await axios.get(`https://openlibrary.org/authors/${id}/works.json`);
            const works = worksResponse.data.entries || [];
            
            // PROCESAR LAS OBRAS
            // Limitamos a las primeras 6 obras y obtenemos sus portadas
            const booksPromises = works.slice(0, 6).map(async (work: Work) => {
                // Extraemos el ID del libro de la clave (quitando el prefijo "/works/")
                const bookId = work.key.replace("/works/", "");
                
                // Variable para guardar el ID de la portada
                let coverId = null;
                
                // Intentamos obtener la portada
                if (work.covers && work.covers.length > 0) {
                    // Si la obra ya tiene portadas, usamos la primera
                    coverId = work.covers[0];
                } else {
                    // Si no tiene portadas, buscamos en las ediciones
                    try {
                        const coverResponse = await axios.get(`https://openlibrary.org/works/${bookId}/editions.json`);
                        if (coverResponse.data.entries && coverResponse.data.entries.length > 0) {
                            coverId = coverResponse.data.entries[0].covers ? coverResponse.data.entries[0].covers[0] : null;
                        }
                    } catch (error) {
                        console.error("Error al obtener la portada:", error);
                    }
                }
                
                // Creamos y devolvemos el objeto libro con los datos procesados
                return {
                    key: work.key,
                    title: work.title,
                    id: bookId,
                    cover_i: coverId,
                    author_name: [author.name]
                };
            });
            
            // Esperamos a que todas las promesas se resuelvan
            const books = await Promise.all(booksPromises);
            
            // DEVOLVER LOS DATOS PARA RENDERIZAR LA PÁGINA
            return ctx.render({ author, books });
        } catch (error) {
            // En caso de error, mostrar un mensaje y renderizar una página 404
            console.error("Error al obtener detalles del autor:", error);
            return ctx.renderNotFound({ message: "Error al cargar el autor" });
        }
    },
};

export default function AuthorPage({ data }: PageProps<AuthorData>) {
    // Extraemos las propiedades author y books del objeto data
    const { author, books } = data;
    
    // Si no hay autor, mostramos un mensaje de error
    if (!author) {
        return (
            <div>
                <h1>Autor no encontrado</h1>
                <p>El autor que buscas no existe o no se pudo cargar.</p>
                <a href="/">Volver al inicio</a>
            </div>
        );
    }

    // Renderizamos el componente AuthorInfo con los datos del autor y sus libros
    return <AuthorInfo author={author} books={books} />;
}
