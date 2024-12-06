import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormDisponibilidad from './components/forms/FormDisponibilidad.jsx';
import FormCitas from './components/forms/FormCitas.jsx';
import FormCumplimiento from './components/forms/FormCumplimiento.jsx';
import Navbar from './layouts/Navbar';
import { Toaster } from 'react-hot-toast';
import Footer from './layouts/Footer.jsx';
import Home from './pages/Home.jsx';

const App = () => {

    const [disponibilidad, setDisponibilidad] = useState([]);
    const [cita, setCita] = useState([]);

    // === AGREGAR NUEVA DISPONIBILIDAD ===
    const agregarDisponibilidad = (nuevaDisponibilidad) => {
        setDisponibilidad(prev => [...prev, nuevaDisponibilidad]);
    }

    // === AGREGAR CITAS ===
    const agregarCita = nuevaCita => {
        setCita(prevCita => [...prevCita, nuevaCita]);
    }


    return (
        <Router>
            <div className="app-container flex flex-col min-h-screen"> {/* Contenedor principal */}
                <Navbar />
                <main className="flex-grow px-48 pt-8">
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="disponibilidad" element={
                            <FormDisponibilidad
                                disponibilidad={disponibilidad}
                                agregarDisponibilidad={agregarDisponibilidad}
                            />}
                        />
                        <Route path="citas" element={
                            <FormCitas
                                cita={cita}
                                agregarCita={agregarCita}
                                disponibilidad={disponibilidad}
                            />}
                        />
                        <Route path="cumplimiento" element={<FormCumplimiento />} />
                    </Routes>
                    <Toaster position="top-center" reverseOrder={false} />
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App;
