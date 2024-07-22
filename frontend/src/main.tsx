import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout.tsx'
import SignUp from './Pages/SignUpPage.tsx'
import SignIn from './Pages/SignInPage.tsx'
import Render from './Components/Render.tsx'
import ErrorPage from './Pages/ErrorPage.tsx'
import ErrorBoundary from './Components/ErrorBoundary.tsx'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store.ts'
import { Provider } from 'react-redux'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <SignIn />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <Suspense fallback={<Render />}>
          <RouterProvider router={router} />
          <Toaster />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
)
