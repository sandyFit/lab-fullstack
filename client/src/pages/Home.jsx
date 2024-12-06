import React from 'react'

const Home = () => {
    return (
        <section className='w-full flex flex-col justify-center items-center mt-8'>
            <h1>Bienvenido al Gestor de Citas Médicas</h1>
            <p className='w-2/3 text-xl my-4 text-center'>
                Regístrate o accede al panel de control usando tu correo electrónico para
                gestionar tus citas médicas de forma rápida y sencilla.
            </p>
            <div className="flex mt-16 gap-8">
                <button className='px-6'
                    type="">
                    Crear Cuenta
                </button>
                <button className='px-12'
                    type="">
                    Acceder
                </button>
            </div>           
        </section>
    )
}

export default Home;

