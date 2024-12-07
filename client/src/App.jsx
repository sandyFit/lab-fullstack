import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FormDisponibilidad from './components/forms/FormDisponibilidad.jsx';
import FormCitas from './components/forms/FormCitas.jsx';
import FormCumplimiento from './components/forms/FormCumplimiento.jsx';
import Navbar from './layouts/Navbar';
import { Toaster } from 'react-hot-toast';
import Footer from './layouts/Footer.jsx';
import Home from './pages/Home.jsx';
import FormUsuarios from './components/forms/FormUsuarios.jsx';

const App = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const [disponibilidad, setDisponibilidad] = useState([]);
    const [cita, setCita] = useState([]);
    const [cumplimiento, setCumplimiento] = useState([]);

    const agregarDisponibilidad = (nuevaDisponibilidad) => {
        setDisponibilidad(prev => [...prev, nuevaDisponibilidad]);
    };

    const agregarCita = nuevaCita => {
        setCita(prevCita => [...prevCita, nuevaCita]);
    };

    const agregarCumplimiento = nuevoCumplimiento => {
        setCumplimiento(prevCumplimiento => [...prevCumplimiento, nuevoCumplimiento]);
    };

    return (
        <Router>
            <div className="app-container flex flex-col min-h-screen">
                <ContentWithNavbar>
                    <Routes>
                        <Route index element={<Home openModal={openModal} />} />
                        <Route path="usuarios" element={<FormUsuarios />} />
                        <Route
                            path="disponibilidad"
                            element={
                                <FormDisponibilidad
                                    disponibilidad={disponibilidad}
                                    agregarDisponibilidad={agregarDisponibilidad}
                                />
                            }
                        />
                        <Route
                            path="citas"
                            element={
                                <FormCitas
                                    cita={cita}
                                    agregarCita={agregarCita}
                                    disponibilidad={disponibilidad}
                                />
                            }
                        />
                        <Route
                            path="cumplimiento"
                            element={
                                <FormCumplimiento
                                    cumplimiento={cumplimiento}
                                    agregarCumplimiento={agregarCumplimiento}
                                />
                            }
                        />
                    </Routes>
                </ContentWithNavbar>
                <Footer />
                <Toaster position="top-center" reverseOrder={false} />

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg relative w-[90%] md:w-[50%]">
                            <button
                                className="absolute top-4 right-4 text-red-500 font-bold text-lg"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                            <FormUsuarios closeModal={closeModal} />
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
};

const ContentWithNavbar = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/'; // Define si estás en el Home

    return (
        <>
            {!isHomePage && <Navbar />}
            <main className={`flex-grow px-48 pt-8 ${isHomePage ? 'p-0' : ''}`}>
                {children}
            </main>
        </>
    );
};

export default App;
