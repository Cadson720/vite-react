import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function Payment() {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [validFields, setValidFields] = useState({ cardNumber: false, expiryDate: false, cvv: false });

    // Validate
    const validateForm = () => {
        const newErrors = {};
        const newValidFields = { cardNumber: false, expiryDate: false, cvv: false };

        if (!/^\d{16}$/.test(cardNumber)) {
            newErrors.cardNumber = 'Credit card number must be 16 digits.';
        } else {
            newValidFields.cardNumber = true;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
        } else {
            newValidFields.expiryDate = true;
        }

        if (!/^\d{3}$/.test(cvv)) {
            newErrors.cvv = 'CVV must be 3 digits.';
        } else {
            newValidFields.cvv = true;
        }

        setErrors(newErrors);
        setValidFields(newValidFields);
        return Object.keys(newErrors).length === 0;
    };

    // Submit function
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            // API
            axios.post('http://localhost:3001/api/submit-order')
                .then(response => {
                    console.log(response.data.message);
                })
                .catch(error => {
                    console.error('Error creating order:', error);
                });

            alert('Payment submitted!');
        }
    };

    //Validate
    useEffect(() => {
        validateForm();
    }, [cardNumber, expiryDate, cvv]);

    return (
        <div className="payment-container">
            <h1 className="payment-title">Payment</h1>
            <p className="payment-description">Please enter your credit card information below.</p>
            <p className="payment-description">Your order has been created when you submitted order from the cart. Payment can be done on this page or at the counter.</p>
            <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                    <label htmlFor="cardNumber">Credit Card Number:</label>
                    <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234567890123456"
                        className="input-field"
                    />
                    {validFields.cardNumber && <span className="checkmark">&#10003;</span>}
                    {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}

                </div>
                <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
                    <input
                        type="text"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className="input-field"
                    />
                    {validFields.expiryDate && <span className="checkmark">&#10003;</span>}
                    {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="cvv">CVV:</label>
                    <input
                        type="password"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="input-field"
                    />
                    {validFields.cvv && <span className="checkmark">&#10003;</span>}
                    {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                </div>
                <button
                    type="submit"
                    className="submit-button"
                    disabled={!validFields.cardNumber || !validFields.expiryDate || !validFields.cvv}
                >
                    Submit Payment
                </button>
            </form>
        </div>
    );
}

export default Payment;
