import React, { useState } from 'react';
import SignUpForm from '../Components/SignUp';
import toast from 'react-hot-toast';

interface SignUpFormState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImg: File | null;
  profileImgPreview: string | null;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormState>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    profileImg: null,
    profileImgPreview: null,
  });
  console.log(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profileImg' && files && files[0]) {
      setFormData({
        ...formData,
        profileImg: files[0],
        profileImgPreview: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('password', formData.password);
    if (formData.profileImg) {
      submitData.append('profileImg', formData.profileImg);
    }
    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        body: submitData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Signed up successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error signing up');
    }
  };

  return <SignUpForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />;
};

export default SignUp;
