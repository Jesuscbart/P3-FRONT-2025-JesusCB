import { FunctionComponent } from "preact/src/index.d.ts";
import { Book } from "../types.ts";

// Definimos las props que recibirá el componente
type Props = {
    book: Book;
};

// Componente que muestra la información detallada de un libro
const BookInfo: FunctionComponent<Props> = ({ book }: Props) => {
    // Extraer el ID del autor si existe, quitando el prefijo '/authors/'
    const authorId = book.author ? book.author.replace('/authors/', '') : '';
    
    // Obtener el ID de la portada
    const coverId = book.cover_i;
    
    // Definir la URL de la imagen de portada
    // Si hay un cover_id, se usa la API de Open Library, si no, se usa un placeholder
    const coverUrl = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` 
        : "/placeholder-book.png";

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
                            Autor: {authorId ? (
                                <a href={`/author/${authorId}`} class="author-link">
                                    {book.author_name?.[0] || "Ver autor"}
                                </a>
                            ) : (
                                book.author_name?.[0] || "Desconocido"
                            )}
                        </p>
                    )}
                    
                    <div>
                        <h2>Descripción</h2>
                        <p>{book.description || "Sin descripción disponible."}</p>
                    </div>
                    
                    <div class="book-detail-meta">
                        <div class="book-meta-item">
                            <p class="book-meta-label">Fecha de publicación</p>
                            <p>{book.publish_date || book.first_publish_year || "No disponible"}</p>
                        </div>
                        
                        <div class="book-meta-item">
                            <p class="book-meta-label">Número de páginas</p>
                            <p>{book.n_pages || "No disponible"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookInfo;
