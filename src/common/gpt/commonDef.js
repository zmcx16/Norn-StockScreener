import { CompanyAnalysisGPTResponseExample } from './companyAnalysisdef'
import { OptionValuationAnalysisGPTResponseExample } from './optionValuationAnalysisdef'

export const GPTModelSelectDef = ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
export const AnalysisSelectDef = [
  {
    name: 'CompanyAnalysis',
    display_name: 'Company Analysis',
    description: `Using GPT models to analyze company data and provide insights on valuation, performance, growth, dividends, balance sheet, analyst sentiment, and more.`,
    defaultOutput: CompanyAnalysisGPTResponseExample
  }, 
  {
    name: 'OptionValuationAnalysis',
    display_name: 'Option Valuation Analysis',
    description: `Leverages GPT models to analyze option contracts, offering detailed insights into valuation, risk factors, market dynamics, and potential hazards.`,
    defaultOutput: OptionValuationAnalysisGPTResponseExample
  }
]
