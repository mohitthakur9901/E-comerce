import React, { useState } from 'react';
import SignUpForm from '../Components/SignUp';

interface SignUpFormState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImg: File | null;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormState>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    profileImg: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profileImg' && files) {
      setFormData({ ...formData, profileImg: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      'Form submitted:', formData.username, formData.email, formData.firstName, formData.lastName, formData.password, formData.profileImg
    );


  };

  return <SignUpForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />;
};

export default SignUp;
