import React from 'react';

const AppLayout = ({ children }) => {
    return (
        <div className="app-container">
            <header>
                <h1>Header</h1>
            </header>
            <main className="content">{children}</main>
            <footer className="footer">Este es el footer</footer>
        </div>
    );
};

export default AppLayout;
