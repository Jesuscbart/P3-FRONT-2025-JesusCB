import { FunctionComponent } from "preact/src/index.d.ts";
import { Author, Book } from "../types.ts";
import BooksGrid from "./BooksGrid.tsx";

// Definimos las props que recibirá el componente
type Props = {
    author: Author;
    books: Book[];
};

// Componente que muestra la información del autor y sus libros
const AuthorInfo: FunctionComponent<Props> = ({ author, books }: Props) => {
    return (
        <div>
            <div>
                <h1>{author.name}</h1>
                {author.birth_date && ( // Si el autor tiene una fecha de nacimiento, se muestra, si no, no se muestra
                    <p>Nacimiento: {author.birth_date}</p>
                )}
            </div>
            
            <div>
                <h2>Biografía</h2>
                <p>{author.bio}</p>
            </div>
            
            <div>
                <h2>Libros del autor</h2>
                {books.length > 0 ? ( // Si el autor tiene libros, se muestra el grid de libros, si no, se muestra un mensaje
                    <BooksGrid books={books} />
                ) : (
                    <p>No se encontraron libros de este autor.</p>
                )}
            </div>
        </div>
    );
};

export default AuthorInfo;
