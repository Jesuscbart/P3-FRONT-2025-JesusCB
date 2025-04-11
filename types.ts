export type Book = {
    key?: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    description?: string;
    publish_date?: string;
    n_pages?: number;
    image?: string;
    author?: string;
    id?: string;
    covers?: number[];
};

// Tipo para representar una obra en la API
export type Work = {
    key: string;
    title: string;
    covers?: number[];
};

export type Author = {
    id: string;
    name: string;
    bio?: string | {value: string};
    birth_date?: string;
    works?: Work[];
    books?: Book[];
};

export type SearchResult = {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    docs: Book[];
    num_found: number;
};

// Datos devueltos por el handler de la página de autor
export type AuthorData = {
    author: Author | null;
    books: Book[];
};

// Definimos el tipo de datos que manejará nuestra página de búsqueda
export type SearchData = {
    query: string;  // El término de búsqueda
    books: Book[];  // Lista de libros encontrados
};