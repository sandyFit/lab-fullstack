import { centrosAtencion } from "../../utils/centros";

const CentroDropdown = ({ value, onChange }) => {

    return (
        <select value={value}
            onChange={onChange}
            className="w-full">
            <option value="">Seleccione un centro de atención</option>
            {centrosAtencion.map((centro, index) => (
                <option key={index} value={centro.nombre}>
                    {centro.nombre}
                </option>
            ))}
        </select>
    );
};

export default CentroDropdown;
