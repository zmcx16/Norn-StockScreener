import { ESGLink, ESGTooltip } from '../common/common'
import { NavZhEnUrl } from '../common/utils'
import { EPSGrowthTagsDict, EmployeesTagsDict } from '../common/tagsDef'
import { interbrand_BestGlobalBrands2024 } from './data/interbrand_BestGlobalBrands2024'
import { interbrand_BestGlobalBrands2023 } from './data/interbrand_BestGlobalBrands2023'
import { interbrand_BestGlobalBrands2022 } from './data/interbrand_BestGlobalBrands2022'
import { interbrand_BestGlobalBrands2021 } from './data/interbrand_BestGlobalBrands2021'
import { Clarivate_GlobalInnovators2025 } from './data/Clarivate_GlobalInnovators2025'
import { Clarivate_GlobalInnovators2024 } from './data/Clarivate_GlobalInnovators2024'
import { Clarivate_GlobalInnovators2023 } from './data/Clarivate_GlobalInnovators2023'
import { Clarivate_GlobalInnovators2022 } from './data/Clarivate_GlobalInnovators2022'
import { Gartner_SupplyChain2022 } from './data/Gartner_SupplyChain2022'

export const RankingDef = [
    {
        name: 'interbrand_BestGlobalBrands2024',
        display_name: 'Interbrand - Best Global Brands (2024)',
        description: `Interbrand has been the world’s leading brand consultancy, for over 40 years – having pioneered iconic work and forged many of the brand building tools that are now commonplace.`,
        link: 'https://interbrand.com/best-global-brands/',
        tags: {},
        data: interbrand_BestGlobalBrands2024,
        symbol_detail: ''
    }, 
    {
        name: 'Clarivate_GlobalInnovators2025',
        display_name: 'Clarivate - Top 100 Global Innovators (2025)',
        description: `Clarivate is a global leader in providing trusted insights and analytics to accelerate the pace of innovation. The vision is to improve the way the world creates, protects and advances innovation.`,
        link: NavZhEnUrl('https://clarivate.com/zh-hant/top-100-innovators/top-100-innovators/?clv-award-year=2025', 'https://clarivate.com/top-100-innovators/top-100-innovators/?clv-award-year=2025'),
        tags: {},
        data: Clarivate_GlobalInnovators2025,
        symbol_detail: ''
    },
    {
        name: 'Gartner_SupplyChain2022',
        display_name: 'Gartner - Supply Chain Top 25 (2022)',
        description: `Gartner provides actionable insights, guidance, and tools that enable faster, smarter decisions and stronger performance on an organization’s mission-critical priorities.`,
        link: 'https://www.gartner.com/en/supply-chain/research/supply-chain-top-25',
        tags: {},
        data: Gartner_SupplyChain2022,
        symbol_detail: ''
    },
    {
        name: 'ESG_Sustainalytics',
        display_name: 'Sustainalytics - Company ESG Risk Ratings',
        description: ESGTooltip,
        link: ESGLink,
        tags: {},
        data: "/norn-data/ranking/esg.json",
        symbol_detail: '/esg-stocks-summary/?symbol={symbol}&showChart=true'
    },
    {
        name: 'YahooFinance_Recommendation',
        display_name: 'Yahoo Finance - Recommendation Ratings',
        description: `Yahoo Finance Stock Analyst Ratings.`,
        link: 'https://finance.yahoo.com',
        tags: {},
        data: "/norn-data/ranking/recommendation.json",
        symbol_detail: ''
    },
    {
        name: 'EPS_Growth_Analysis',
        display_name: 'Yahoo Finance - Earnings Growth (Analysis)',
        description: `Yahoo Finance Earnings Growth`,
        link: 'https://finance.yahoo.com',
        tags: EPSGrowthTagsDict,
        data: "/norn-data/ranking/eps_analysis.json",
        symbol_detail: ''
    },
    {
        name: 'EPS_Growth_Financials',
        display_name: 'Yahoo Finance - Earnings Growth (Financials)',
        description: `Yahoo Finance Earnings Growth`,
        link: 'https://finance.yahoo.com',
        tags: EPSGrowthTagsDict,
        data: "/norn-data/ranking/eps_financials.json",
        symbol_detail: ''
    },
    {
        name: 'Employees_Growth',
        display_name: 'Macrotrends - Employees Growth',
        description: `Macrotrends - Employees Growth`,
        link: 'https://www.macrotrends.net/',
        tags: EmployeesTagsDict,
        data: "/norn-data/ranking/employees.json",
        symbol_detail: 'https://finviz.com/quote.ashx?t={symbol}'
    },
    {
        name: 'interbrand_BestGlobalBrands2023',
        display_name: 'Interbrand - Best Global Brands (2023)',
        description: `Interbrand has been the world’s leading brand consultancy, for over 40 years – having pioneered iconic work and forged many of the brand building tools that are now commonplace.`,
        link: 'https://interbrand.com/best-global-brands/',
        tags: {},
        data: interbrand_BestGlobalBrands2023,
        symbol_detail: ''
    }, 
    {
        name: 'interbrand_BestGlobalBrands2022',
        display_name: 'Interbrand - Best Global Brands (2022)',
        description: `Interbrand has been the world’s leading brand consultancy, for over 40 years – having pioneered iconic work and forged many of the brand building tools that are now commonplace.`,
        link: 'https://interbrand.com/best-global-brands/',
        tags: {},
        data: interbrand_BestGlobalBrands2022,
        symbol_detail: ''
    },
    {
        name: 'Interbrand_BestGlobalBrands2021',
        display_name: 'Interbrand - Best Global Brands (2021)',
        description: `Interbrand has been the world’s leading brand consultancy, for over 40 years – having pioneered iconic work and forged many of the brand building tools that are now commonplace.`,
        link: 'https://interbrand.com/best-global-brands/',
        tags: {},
        data: interbrand_BestGlobalBrands2021,
        symbol_detail: ''
    },
    {
        name: 'Clarivate_GlobalInnovators2024',
        display_name: 'Clarivate - Top 100 Global Innovators (2024)',
        description: `Clarivate is a global leader in providing trusted insights and analytics to accelerate the pace of innovation. The vision is to improve the way the world creates, protects and advances innovation.`,
        link: NavZhEnUrl('https://clarivate.com/zh-hant/top-100-innovators/top-100-innovators/?clv-award-year=2024', 'https://clarivate.com/top-100-innovators/top-100-innovators/?clv-award-year=2024'),
        tags: {},
        data: Clarivate_GlobalInnovators2024,
        symbol_detail: ''
    },
    {
        name: 'Clarivate_GlobalInnovators2023',
        display_name: 'Clarivate - Top 100 Global Innovators (2023)',
        description: `Clarivate is a global leader in providing trusted insights and analytics to accelerate the pace of innovation. The vision is to improve the way the world creates, protects and advances innovation.`,
        link: NavZhEnUrl('https://clarivate.com/zh-hant/top-100-innovators/top-100-innovators/?clv-award-year=2023', 'https://clarivate.com/top-100-innovators/top-100-innovators/?clv-award-year=2023'),
        tags: {},
        data: Clarivate_GlobalInnovators2023,
        symbol_detail: ''
    },
    {
        name: 'Clarivate_GlobalInnovators2022',
        display_name: 'Clarivate - Top 100 Global Innovators (2022)',
        description: `Clarivate is a global leader in providing trusted insights and analytics to accelerate the pace of innovation. The vision is to improve the way the world creates, protects and advances innovation.`,
        link: NavZhEnUrl('https://clarivate.com/zh-hant/top-100-innovators/top-100-innovators/?clv-award-year=2022', 'https://clarivate.com/top-100-innovators/top-100-innovators/?clv-award-year=2022'),
        tags: {},
        data: Clarivate_GlobalInnovators2022,
        symbol_detail: ''
    },
  ]
