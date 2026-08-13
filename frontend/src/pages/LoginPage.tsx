import { BarChart3, Lock, Mail } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { setAccessToken, setStoredUser, type LoginResponse } from '../lib/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await api.post<LoginResponse>('/api/auth/login', {
        email: email.trim(),
        password,
      })

      setAccessToken(response.data.access_token)
      setStoredUser(response.data.user)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } }
        const detail = axiosError.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Invalid email or password')
      } else {
        setError('Unable to reach the server. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-maruti-blue via-[#002b7a] to-maruti-blue-dark lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute bottom-1/3 left-1/4 h-48 w-48 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative z-10">
          <div className="leading-tight text-white">
            <div className="text-sm font-semibold tracking-[0.2em] text-white/70">MARUTI</div>
            <div className="text-2xl font-bold tracking-wide">SUZUKI</div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Analytics
            <br />
            Dashboard
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100/80">
            Role-scoped insights across tickets, approvals, and operational metrics — secured
            with Row-Level Security.
          </p>
        </div>

        <p className="relative z-10 text-xs text-blue-200/50">
          © Maruti Suzuki India Limited
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f4f6f9] px-6 py-12">
        <div className="mb-8 text-center lg:hidden">
          <div className="leading-tight text-maruti-blue">
            <div className="text-xs font-semibold tracking-[0.2em] text-maruti-blue/70">MARUTI</div>
            <div className="text-lg font-bold">SUZUKI</div>
          </div>
        </div>

        <div className="w-full max-w-[420px] rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1.5 text-sm text-gray-500">Sign in to your Analytics Dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Email address</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maruti-blue focus:bg-white focus:ring-2 focus:ring-maruti-blue/20"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-maruti-blue focus:bg-white focus:ring-2 focus:ring-maruti-blue/20"
                />
              </div>
            </label>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-maruti-blue py-2.5 text-sm font-semibold text-white shadow-md shadow-maruti-blue/25 transition hover:bg-maruti-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs font-medium text-gray-500">Demo credentials</p>
            <p className="mt-1 text-xs text-gray-600">
              <span className="font-mono text-maruti-blue">executive@maruti.com</span>
              {' · '}
              <span className="font-mono text-maruti-blue">analyst@maruti.com</span>
            </p>
            <p className="mt-0.5 font-mono text-xs text-gray-500">Password: secret123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
