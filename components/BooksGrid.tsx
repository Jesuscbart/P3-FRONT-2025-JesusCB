import { FunctionComponent } from "preact/src/index.d.ts";
import { Book } from "../types.ts";
import BookCard from "./BookCard.tsx";

// Definimos las props que recibirá el componente
type Props = {
    books: Book[];
}

// Componente que muestra un grid de libros
const BooksGrid: FunctionComponent<Props> = ({ books = [] }: Props) => {
    if (books.length === 0) {
        return <p class="no-books">No se encontraron libros</p>;
    }

    return (
        <div class="books-grid">
            {books.map((book) => (
                <BookCard key={book.key || book.title} book={book} />
            ))}
        </div>
    );
};

export default BooksGrid;