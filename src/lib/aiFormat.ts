export function formatHealthSummary(
  healthData: {
    heartRate: { value: number; status: string; trend: string }
    bloodPressure: { systolic: number; diastolic: number; status: string }
    steps: { value: number; goal: number; status: string; progress: number }
    sleep: { value: number; quality: number; status: string }
    medication: { taken: boolean; nextDose: string; timeLeft: string }
  },
  aedBattery: number,
  cholesterol: { total: number; ldl: number; hdl: number },
  lastUpdated: string | Date
) {
  const stepsGap = Math.max(0, healthData.steps.goal - healthData.steps.value)
  const ldlFlag = cholesterol.ldl >= 100 ? 'elevated' : 'ideal'
  const hdlFlag = cholesterol.hdl >= 50 ? 'ideal' : 'below target'
  const bpText = `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`
  const updated = typeof lastUpdated === 'string' ? lastUpdated : lastUpdated.toISOString()
  const lines: string[] = []
  lines.push('Please review the processed health summary below and recommend actions by priority:')
  lines.push('')
  lines.push('Summary:')
  lines.push(`• Heart rate: ${healthData.heartRate.value} bpm (${healthData.heartRate.status}) trend: ${healthData.heartRate.trend}`)
  lines.push(`• Blood pressure: ${bpText} (${healthData.bloodPressure.status})`)
  lines.push(`• Sleep: ${healthData.sleep.value} hours, quality ${healthData.sleep.quality}% (${healthData.sleep.status})`)
  lines.push(`• Steps: ${healthData.steps.value}/${healthData.steps.goal} (${healthData.steps.progress}%) gap ~${stepsGap} steps`)
  lines.push(`• Medication: ${healthData.medication.taken ? 'taken' : 'pending'}, next dose ${healthData.medication.nextDose}, remaining ${healthData.medication.timeLeft}`)
  lines.push(`• AED battery: ${aedBattery}%`)
  lines.push(`• Lipids: total ${cholesterol.total} mg/dL, LDL ${cholesterol.ldl} (${ldlFlag}), HDL ${cholesterol.hdl} (${hdlFlag})`)
  lines.push(`• Updated at: ${updated}`)
  lines.push('')
  lines.push('Please respond with:')
  lines.push('1) High/medium/low priority action list (≤2 sentences each)')
  lines.push('2) Quantifiable plan for today')
  lines.push('3) Risk alerts and when to contact a doctor')
  lines.push('4) A summary within 150 words')
  return lines.join('\n')
}