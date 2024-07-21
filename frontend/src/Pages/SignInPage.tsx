import React, { useState } from 'react';
import SignInForm from '../Components/SignIn';
import toast from 'react-hot-toast';
interface SignUpFormState {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState<SignUpFormState>({
        email: '',
        password: '',
    });
    console.log(formData);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);

        }
    };
    return (
        <div>
            <SignInForm formData={formData} handleChange={handleChange} handleSubmit={handlesubmit} />
        </div>
    );
};

export default SignIn;