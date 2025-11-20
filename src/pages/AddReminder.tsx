import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccessibility } from '../components/AccessibilitySettings'
import { ArrowLeft, Image as ImageIcon, Calendar, Repeat, Pill, Clock, Sparkles, CheckCircle, BellRing } from 'lucide-react'

const AddReminder: React.FC = () => {
  const navigate = useNavigate()
  const { speak } = useAccessibility()

  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [frequency, setFrequency] = useState('')
  const [dosage, setDosage] = useState('')
  const [time, setTime] = useState('')
  const [meal, setMeal] = useState<'before' | 'after'>('after')

  const formatDate = (value: string) => {
    if (!value) return 'Choose date'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Choose date'
    return date.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric', weekday: 'short' })
  }

  const journeySteps = [
    { title: 'Medication', desc: 'Name & photo', icon: Pill },
    { title: 'Schedule', desc: 'Dates & frequency', icon: Calendar },
    { title: 'Dosage', desc: 'Timing & meals', icon: Clock }
  ]

  const summaryItems = useMemo(() => [
    { label: 'Medication', value: name || 'Not set yet' },
    { label: 'Starts', value: startDate ? formatDate(startDate) : 'Choose a date' },
    { label: 'Frequency', value: frequency || 'Tap to select' },
    { label: 'Dosage', value: dosage || 'Enter units/pills' },
    { label: 'Time', value: time || 'Pick a reminder time' },
    { label: 'Meals', value: meal === 'before' ? 'Before meals' : 'After meals' }
  ], [name, startDate, frequency, dosage, time, meal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    speak('Reminder created')
    navigate('/health')
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    if (!f) return
    if (f.size > 1024 * 1024) {
      speak('Image size must be below 1MB')
      alert('Image size must be below 1MB')
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-white/70 dark:border-slate-700 px-4 py-2 shadow-md hover:shadow-lg transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Back</span>
          </button>
          <span className="text-sm font-semibold text-teal-700 flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Smart reminder builder</span>
          </span>
        </div>

        <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-3xl p-6 md:p-8 text-white shadow-2xl mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/70">Step-by-step guidance</p>
              <h1 className="text-3xl font-extrabold mt-2">Add a caring medication reminder</h1>
              <p className="text-white/90 mt-2 max-w-xl">
                Combine medication details, schedules, and dosage instructions into a single friendly alert that keeps loved ones safe and on time.
              </p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm w-full md:w-72">
              <p className="text-xs uppercase tracking-wide text-white/70">Next dose preview</p>
              <p className="text-lg font-semibold mt-1">
                {time ? `Today at ${time}` : 'Set a reminder time'}
              </p>
              <p className="text-sm text-white/80">{startDate ? formatDate(startDate) : 'Pick a start date to begin the plan.'}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            {journeySteps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-xs text-white/80">{step.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <section className="bg-white/90 dark:bg-slate-900/80 rounded-3xl border border-white/60 dark:border-slate-800 shadow-xl p-6">
              <header className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-teal-600 font-semibold">Medication profile</p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Identify the medication</h2>
                </div>
                <CheckCircle className="w-7 h-7 text-teal-500" />
              </header>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Medication name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Morning blood pressure pill"
                    className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-base focus:outline-none focus:ring-4 focus:ring-teal-200"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Photo or label</p>
                  <label
                    htmlFor="medication-photo"
                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/40 dark:hover:bg-teal-900/20 transition"
                  >
                    {preview ? (
                      <img src={preview} alt="Medication preview" className="w-full max-h-48 object-contain rounded-2xl" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
                        <p className="text-base font-semibold text-teal-700">Tap to take a photo or upload</p>
                        <p className="text-xs text-slate-500">Supports JPG, JPEG, PNG under 1MB</p>
                      </>
                    )}
                    <input
                      id="medication-photo"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={onFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-white/90 dark:bg-slate-900/80 rounded-3xl border border-white/60 dark:border-slate-800 shadow-xl p-6">
              <header className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-indigo-600 font-semibold">Medication schedule</p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Plan the timing</h2>
                </div>
                <BellRing className="w-7 h-7 text-indigo-500" />
              </header>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center text-slate-600 dark:text-slate-300 mb-3">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Start date</span>
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3"
                  />
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center text-slate-600 dark:text-slate-300 mb-3">
                    <Repeat className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Frequency</span>
                  </div>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3"
                  >
                    <option value="">Select frequency</option>
                    <option value="once">Once per day</option>
                    <option value="twice">Twice per day</option>
                    <option value="thrice">Three times per day</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white/90 dark:bg-slate-900/80 rounded-3xl border border-white/60 dark:border-slate-800 shadow-xl p-6">
              <header className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-rose-600 font-semibold">Dosage & reminders</p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fine-tune the reminder</h2>
                </div>
              </header>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center text-slate-600 dark:text-slate-300 mb-3">
                    <Pill className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Dosage</span>
                  </div>
                  <input
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 tablet"
                    className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3"
                  />
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center text-slate-600 dark:text-slate-300 mb-3">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Reminder time</span>
                  </div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3"
                  />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Meal timing</p>
                <div className="flex flex-wrap gap-3">
                  {(['before', 'after'] as const).map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setMeal(option)}
                      className={`px-5 py-3 rounded-2xl border text-sm font-semibold transition ${
                        meal === option
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {option === 'before' ? 'Before meals' : 'After meals'}
                    </button>
                  ))}
                  <button type="button" className="px-5 py-3 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                    + Add another instruction
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white/95 dark:bg-slate-900/80 rounded-3xl border border-white/60 dark:border-slate-800 shadow-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Ready to save?</p>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">We will remind you at the right moment.</h3>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 h-12 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white rounded-2xl font-semibold shadow-lg"
                >
                  Create reminder
                </button>
              </div>
            </section>
          </form>

          <aside className="bg-white/80 dark:bg-slate-900/70 rounded-3xl border border-white/50 dark:border-slate-800 shadow-2xl p-6 h-fit">
            <p className="text-sm font-semibold text-teal-600 mb-1">Live preview</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Reminder summary</h3>
            <div className="space-y-3">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/70 px-3 py-3">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-300">{item.label}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                We will send a gentle alert {frequency ? `(${frequency})` : ''} and log your intake history so family members can stay informed.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default AddReminder