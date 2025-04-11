import { FunctionComponent } from "preact/src/index.d.ts";
import { Book } from "../types.ts";

// Definimos las props que recibirá el componente
type Props = {
    book: Book;
};

// Componente que muestra la card de un libro

const BookCard: FunctionComponent<Props> = ({ book }: Props) => {
    // Extraer el ID del libro eliminando el prefijo "/works/" si existe
    const id = book.key?.replace("/works/", "") || book.id || "";
    
    // Obtener el nombre del autor o mostrar "Autor desconocido" si no está disponible
    const authorName = book.author_name ? book.author_name[0] : "Autor desconocido";
    
    // Definir la URL de la imagen de portada
    // Si no hay cover_i, se usa una imagen placeholder
    let coverUrl = "/placeholder-book.png";
    
    if (book.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
    }

    return (
        <div class="book-card">
            <a href={`/book/${id}`} class="book-link">
                <div class="book-cover">
                    <img src={coverUrl} alt={`Portada de ${book.title}`} class="book-image"/>
                </div>
                <div class="book-info">
                    <h3 class="book-title">{book.title}</h3>
                    <p class="book-author">{authorName}</p>
                </div>
            </a>
        </div>
    );
};

export default BookCard;