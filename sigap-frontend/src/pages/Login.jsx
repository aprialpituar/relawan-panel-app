// Lokasi: src/pages/Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // 2. Panggil fungsi login dari context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email: email,
        password: password,
      });

      // 3. Panggil fungsi login dari context dengan token yang didapat
      login(response.data.token);

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Login gagal. Periksa koneksi Anda.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mx-auto mb-4 w-12 h-12">
            <img src="/img/sigap-logo.png" alt="SIGAP Logo" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Login ke Panel Relawan</h2>
          <p className="mt-2 text-sm text-gray-600">Masukkan kredensial Anda untuk melanjutkan</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Alamat Email</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                placeholder="anda@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-login" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password-login"
                type="password"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {error && <div className="text-center text-sm text-red-600">{error}</div>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;