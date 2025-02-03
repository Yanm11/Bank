import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {axiosi} from '../config/Axios';

const ChangeInfo = () => {
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axiosi.put('/account/info', formData);
            setSuccess('Information updated successfully!');
            setTimeout(() => navigate('/profile'), 2000); // Redirect to profile page
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update information');
        }
    };

    return (
        <div>
            <h1>Change Info</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ChangeInfo;
