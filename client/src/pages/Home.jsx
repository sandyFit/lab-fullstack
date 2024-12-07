import React from 'react';

const Home = ({ openModal }) => {
    return (
        <section className="w-full flex flex-col justify-center items-center mt-24">
            <h1 className="text-emerald-600">
                Bienvenido al Gestor de Citas Médicas
            </h1>
            <p className="w-[50%] text-xl my-4 text-center">
                Regístrese y acceda al panel de control para
                gestionar sus citas médicas de forma rápida y sencilla.
            </p>
            <div className="flex mt-16 gap-8">
                <button
                    onClick={openModal}
                    className="px-12"
                >
                    Registrarse
                </button>
            </div>
        </section>
    );
};

export default Home;

