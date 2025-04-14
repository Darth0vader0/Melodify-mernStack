"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Music } from "lucide-react"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            rememberMe,
        }),
    })
    const data = await result.json()
    if(data.success){
        console.log(data.user)
        window.location.href = "/home"
    }else{
        alert(data.message)
    }

 
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 p-6">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold">Melodify</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg bg-neutral-900 p-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Log in to Melodify</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email or username
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 text-white focus:border-green-500 focus:outline-none"
                placeholder="Email or username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 text-white focus:border-green-500 focus:outline-none"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-green-500 focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-neutral-400">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-green-500 py-3 font-bold text-black transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-neutral-400 underline hover:text-white">
              Forgot your password?
            </a>
          </div>

          <div className="mt-8 border-t border-neutral-800 pt-6 text-center">
            <p className="text-neutral-400">Don't have an account?</p>
            <Link
              to="/signup"
              className="mt-2 inline-block w-full rounded-full border border-neutral-700 py-3 font-bold transition hover:border-white"
            >
              Sign up for Melodify
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 p-6 text-center text-sm text-neutral-400">
        <p>© 2025 Melodify</p>
      </footer>
    </div>
  )
}

export default LoginPage
