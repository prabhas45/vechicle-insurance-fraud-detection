import { useState } from 'react'
import './App.css'

const formSections = [
  {
    title: 'VEHICLE INFORMATION',
    fields: [
      { name: 'Make', label: 'Make', type: 'select', options: ['Honda', 'Toyota', 'Ford', 'BMW', 'Mercedes', 'Nissan', 'Chevrolet', 'Tesla', 'Volvo', 'Hyundai'] },
      { name: 'VehicleCategory', label: 'Vehicle Category', type: 'select', options: ['Sedan', 'SUV', 'Sports Car', 'Truck', 'Utility', 'Van'] },
      { name: 'VehiclePrice', label: 'Vehicle Price', type: 'select', options: ['20000_to_29000', '30000_to_39000', '40000_to_49000', '50000_to_59000', '60000_to_69000'] },
      { name: 'AgeOfVehicle', label: 'Age of Vehicle', type: 'select', options: ['new', '1_year', '2_years', '3_years', '4_years', '5_years', '6_years'] },
      { name: 'NumberOfCars', label: 'Number of Cars', type: 'select', options: ['1_vehicle', '2_vehicles', '3_to_4', '5_plus'] },
    ],
  },
  {
    title: 'POLICY INFORMATION',
    fields: [
      { name: 'PolicyType', label: 'Policy Type', type: 'select', options: ['Sedan - Collision', 'Sedan - Liability', 'SUV - Collision', 'SUV - All Perils', 'Truck - Collision', 'Utility - Liability'] },
      { name: 'BasePolicy', label: 'Base Policy', type: 'select', options: ['Collision', 'All Perils', 'Liability', 'Comprehensive'] },
      { name: 'Deductible', label: 'Deductible', type: 'number', min: 0, max: 2000 },
      { name: 'DriverRating', label: 'Driver Rating', type: 'number', min: 1, max: 5 },
      { name: 'Days_Policy_Accident', label: 'Days: Policy-Accident', type: 'select', options: ['none', '1_day', '2_days', '3_days', '7_days', '14_days'] },
      { name: 'Days_Policy_Claim', label: 'Days: Policy-Claim', type: 'select', options: ['none', '1_day', '2_days', '3_days', '7_days', '14_days'] },
      { name: 'PastNumberOfClaims', label: 'Past Number of Claims', type: 'select', options: ['none', '1', '2', '3', '4_plus'] },
      { name: 'AddressChange_Claim', label: 'Address Change-Claim', type: 'select', options: ['1_year', '2_years', '3_years', 'no_change'] },
    ],
  },
  {
    title: 'POLICYHOLDER INFORMATION',
    fields: [
      { name: 'Age', label: 'Age', type: 'number', min: 18, max: 80 },
      { name: 'AgeOfPolicyHolder', label: 'Age of Policy Holder', type: 'select', options: ['16_to_17', '18_to_24', '25_to_29', '30_to_35', '36_to_40', '41_to_50', '51_to_65'] },
      { name: 'Sex', label: 'Sex', type: 'select', options: ['Male', 'Female'] },
      { name: 'MaritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widow'] },
    ],
  },
  {
    title: 'CLAIM INFORMATION',
    fields: [
      { name: 'Month', label: 'Month', type: 'select', options: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      { name: 'WeekOfMonth', label: 'Week of Month', type: 'number', min: 1, max: 5 },
      { name: 'DayOfWeek', label: 'Day of Week', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      { name: 'AccidentArea', label: 'Accident Area', type: 'select', options: ['Urban', 'Rural', 'Suburban'] },
      { name: 'DayOfWeekClaimed', label: 'Day of Week Claimed', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      { name: 'MonthClaimed', label: 'Month Claimed', type: 'select', options: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      { name: 'WeekOfMonthClaimed', label: 'Week of Month Claimed', type: 'number', min: 1, max: 5 },
      { name: 'Fault', label: 'Fault', type: 'select', options: ['Policy Holder', 'Third Party', 'Not At Fault', 'Other'] },
    ],
  },
  {
    title: 'EVIDENCE & SUPPORTING INFORMATION',
    fields: [
      { name: 'PoliceReportFiled', label: 'Police Report Filed', type: 'select', options: ['Yes', 'No'] },
      { name: 'WitnessPresent', label: 'Witness Present', type: 'select', options: ['Yes', 'No'] },
      { name: 'AgentType', label: 'Agent Type', type: 'select', options: ['External', 'Internal'] },
      { name: 'NumberOfSuppliments', label: 'Number of Supplements', type: 'number', min: 0, max: 10 },
    ],
  },
]

const defaultForm = {
  Make: 'Honda',
  VehicleCategory: 'Sedan',
  VehiclePrice: '20000_to_29000',
  AgeOfVehicle: '3_years',
  NumberOfCars: '1_vehicle',
  PolicyType: 'Sedan - Collision',
  BasePolicy: 'Collision',
  Deductible: 400,
  DriverRating: 3,
  Days_Policy_Accident: 'none',
  Days_Policy_Claim: 'none',
  PastNumberOfClaims: 'none',
  AddressChange_Claim: '1_year',
  Age: 30,
  AgeOfPolicyHolder: '30_to_35',
  Sex: 'Male',
  MaritalStatus: 'Single',
  Month: 'Dec',
  WeekOfMonth: 3,
  DayOfWeek: 'Monday',
  AccidentArea: 'Urban',
  DayOfWeekClaimed: 'Monday',
  MonthClaimed: 'Dec',
  WeekOfMonthClaimed: 3,
  Fault: 'Policy Holder',
  PoliceReportFiled: 'No',
  WitnessPresent: 'No',
  AgentType: 'External',
  NumberOfSuppliments: 0,
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [validationErrors, setValidationErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFieldChange = (fieldName, value) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }))
    setValidationErrors((prev) => ({ ...prev, [fieldName]: undefined }))
  }

  const validateForm = () => {
    const errors = {}

    formSections.forEach(({ fields }) => {
      fields.forEach(({ name, type }) => {
        const value = form[name]
        const isEmpty =
          type === 'number'
            ? value === '' || value === null || value === undefined || Number.isNaN(Number(value)) || Number(value) <= 0
            : !value || value === ''

        if (isEmpty) {
          errors[name] = 'Required'
        }
      })
    })

    return errors
  }

  const getMockAnalysis = (input) => {
    const indicators = []

    if (input.PoliceReportFiled === 'No') indicators.push('No Police Report')
    if (input.WitnessPresent === 'No') indicators.push('No Witness Present')
    if (input.AgentType === 'External') indicators.push('External Agent')
    if (input.Days_Policy_Accident === 'none') indicators.push('Policy Accident Gap')
    if (input.Days_Policy_Claim === 'none') indicators.push('Claim Delay Pattern')
    if (input.PastNumberOfClaims !== 'none') indicators.push('Multiple Prior Claims')
    if (input.AccidentArea === 'Urban') indicators.push('Urban Risk Cluster')

    const riskScore =
      18 +
      indicators.length * 11 +
      (input.Deductible >= 500 ? 8 : 0) +
      (input.Age < 25 ? 5 : 0) +
      (input.DriverRating <= 2 ? 7 : 0) +
      (input.Make === 'Honda' ? 1 : 0)

    const fraudProbability = Math.min(Math.max(riskScore, 12), 92)
    const prediction = fraudProbability >= 50 ? 'FRAUD' : 'NOT FRAUD'

    return {
      prediction,
      probability: Number(fraudProbability.toFixed(2)),
      indicators: [...new Set(indicators)].slice(0, 6),
    }
  }

  const handleAnalyze = () => {
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setResult(null)
      return
    }

    setIsLoading(true)
    setResult(null)

    window.setTimeout(() => {
      const analysis = getMockAnalysis(form)
      setResult(analysis)
      setIsLoading(false)
    }, 1100)
  }

  const renderField = (field) => {
    const hasError = Boolean(validationErrors[field.name])
    const commonProps = {
      className: `field-control${hasError ? ' error' : ''}`,
      value: form[field.name],
      onChange: (event) => handleFieldChange(field.name, field.type === 'number' ? Number(event.target.value) : event.target.value),
      'aria-invalid': hasError,
    }

    return (
      <label key={field.name} className="field">
        <span className="field-label">{field.label}</span>
        {field.type === 'number' ? (
          <input
            {...commonProps}
            type="number"
            min={field.min}
            max={field.max}
            placeholder="0"
          />
        ) : (
          <select {...commonProps}>
            <option value="">Select option</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </label>
    )
  }

  const isFraud = result?.prediction === 'FRAUD'
  const resultTone = isFraud ? 'fraud' : 'safe'

  return (
    <div className="app-shell">
      <header className="topbar glass-panel">
        <div className="brand-wrap">
          <div className="brand-mark">
            <span className="brand-shield">🛡️</span>
          </div>
          <div className="brand-text">FraudGuard AI</div>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#dashboard">Dashboard</a>
          <a href="#analysis">Claim Analysis</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <div className="status-pill">
          <span className="status-dot"></span>
          ML MODEL ACTIVE
        </div>
      </header>

      <main>
        <section className="hero-panel glass-panel" id="dashboard">
          <div className="hero-copy">
            <div className="eyebrow">AI-powered risk intelligence</div>
            <h1>
              Vehicle Insurance
              <span>Fraud Detection</span>
            </h1>
            <p>
              AI-powered claim analysis combining machine learning with intelligent
              rule-based risk detection.
            </p>

            <div className="stats-row">
              <div className="mini-stat">
                <strong>15,420</strong>
                <span>Claims Analyzed</span>
              </div>
              <div className="mini-stat">
                <strong>5.99%</strong>
                <span>Historical Fraud Rate</span>
              </div>
            </div>

            <button type="button" className="primary-btn glow-btn">
              Analyze New Claim
            </button>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>
            <div className="metric-card metric-card-top">
              <span>Risk Model</span>
              <strong>94.3%</strong>
              <small>Precision score</small>
            </div>
            <div className="metric-card metric-card-bottom">
              <span>Claims reviewed</span>
              <strong>1,284</strong>
              <small>Current queue</small>
            </div>
          </div>
        </section>

        <section className="analysis-section glass-panel" id="analysis">
          <div className="section-header">
            <div>
              <h2>Analyze Insurance Claim</h2>
              <p>
                Enter claim information to generate an ML prediction and identify
                suspicious risk indicators.
              </p>
            </div>
          </div>

          <div className="form-layout">
            {formSections.map((section) => (
              <div key={section.title} className="form-section">
                <div className="section-tag">{section.title}</div>
                <div className="field-grid">
                  {section.fields.map((field) => renderField(field))}
                </div>
              </div>
            ))}
          </div>

          <div className="action-row">
            <button
              type="button"
              className={`primary-btn analyze-btn ${isLoading ? 'loading' : ''}`}
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                '⚡ ANALYZE CLAIM'
              )}
            </button>
          </div>
        </section>

        {result && (
          <section className={`result-panel glass-panel ${resultTone}`}>
            <div className="result-header">
              <div>
                <span className="result-kicker">Analysis Result</span>
                <h3>Prediction Result</h3>
              </div>
              <div className={`prediction-badge ${resultTone}`}>
                {result.prediction}
              </div>
            </div>

            <div className="result-grid">
              <div className="probability-card">
                <div
                  className="probability-ring"
                  style={{
                    '--progress': result.probability,
                    '--ring-color': isFraud ? '#fb923c' : '#34d399',
                  }}
                >
                  <div className="ring-center">
                    <span>{result.probability}%</span>
                  </div>
                </div>
                <div className="probability-meta">
                  <span>Fraud Probability</span>
                  <strong>{result.probability}%</strong>
                </div>
              </div>

              <div className="risk-summary">
                <div className="analysis-box">
                  <span className="box-label">Rule Engine Analysis</span>
                  <div className="risk-chip-list">
                    {result.indicators.map((indicator) => (
                      <span key={indicator} className="risk-chip">
                        ⚠️ {indicator}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="indicator-count">
                  Risk Indicators Detected: <strong>{result.indicators.length}</strong>
                </div>
              </div>
            </div>

            <div className="disclaimer-box">
              <h4>⚠️ Decision Support Notice</h4>
              <p>
                This system provides statistical decision support based on historical
                claim patterns. A fraud prediction is not proof of fraud and requires
                human investigation.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div>Vehicle Insurance Fraud Detection Using Machine Learning</div>
        <div className="footer-tech">React • Spring Boot • Python • Scikit-learn</div>
      </footer>
    </div>
  )
}

export default App
