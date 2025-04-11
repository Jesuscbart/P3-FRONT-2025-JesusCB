import { FunctionComponent } from "preact/src/index.d.ts";

const Header: FunctionComponent = () => {
    return (
        <header class="site-header">
            <div class="header-container">
                <h1 class="site-title">Biblioteca Jesús</h1>
                <nav class="site-nav">
                    <a href="/" class="nav-link">Inicio 🏠</a>
                    <a href="/search" className="nav-link">Buscar 🔎</a>
                </nav>
            </div>
        </header>
    );
};

export default Header; 