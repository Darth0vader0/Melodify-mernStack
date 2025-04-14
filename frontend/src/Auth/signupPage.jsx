"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Music } from "lucide-react"
const backendUrl = import.meta.env.VITE_HOST_URL ;
const SignupPage = () => {
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(backendUrl)
    const result =await  fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            nickname,
            password,
            username:name
        }),
    })
    const data = await result.json()
    if(data.success){
        console.log(data.user)
        window.location.href = "/login"
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
          <h1 className="mb-8 text-center text-3xl font-bold">Sign up for free to start listening</h1>

         

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                What's your email?
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 text-white focus:border-green-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmEmail" className="mb-2 block text-sm font-medium">
                what should be your nickname?
              </label>
              <input
                type="text"
                id="confirmEmail"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 text-white focus:border-green-500 focus:outline-none"
                placeholder="Enter nickename"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Create a password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 text-white focus:border-green-500 focus:outline-none"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                make one username
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 text-white focus:border-green-500 focus:outline-none"
                placeholder="Enter a profile name"
                required
              />
              <p className="mt-1 text-xs text-neutral-400">This appears on your profile.</p>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-green-500 py-3 font-bold text-black transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 border-t border-neutral-800 pt-6 text-center">
            <p className="text-neutral-400">Already have an account?</p>
            <Link
              to="/login"
              className="mt-2 inline-block w-full rounded-full border border-neutral-700 py-3 font-bold transition hover:border-white"
            >
              Log in to Melodify
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

export default SignupPage
