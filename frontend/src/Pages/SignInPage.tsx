import React, { useState } from 'react';
import SignInForm from '../Components/SignIn';

interface SignUpFormState {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState<SignUpFormState>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlesubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };
    return (
        <div>
            <SignInForm formData={formData} handleChange={handleChange} handleSubmit={handlesubmit} />
        </div>
    );
};

export default SignIn;