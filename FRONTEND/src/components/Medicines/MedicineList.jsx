import { useState, useEffect } from 'react';
import { medicinesApi } from '../../services/api';

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                setLoading(true);
                const response = await medicinesApi.getAllMedicines();
                setMedicines(response.data);
            } catch (err) {
                console.error('Error fetching medicines:', err);
                setError(err.message || 'Failed to fetch medicines');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, []);

    if (loading) return <div>Loading medicines...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="medicine-list">
            {medicines.map(medicine => (
                <div key={medicine._id} className="medicine-item">
                    <h3>{medicine.name}</h3>
                    <p>Price: ${medicine.price}</p>
                    {/* Add more medicine details */}
                </div>
            ))}
        </div>
    );
};

export default MedicineList; 