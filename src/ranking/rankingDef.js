import { NavZhEnUrl } from '../common/utils'
import { interbrand_BestGlobalBrands2022 } from './data/interbrand_BestGlobalBrands2022'
import { interbrand_BestGlobalBrands2021 } from './data/interbrand_BestGlobalBrands2021'
import { Clarivate_GlobalInnovators2022 } from './data/Clarivate_GlobalInnovators2022'
import { Gartner_SupplyChain2022 } from './data/Gartner_SupplyChain2022'

export const RankingDef = [
    {
        name: 'interbrand_BestGlobalBrands2022',
        display_name: 'Interbrand - Best Global Brands (2022)',
        description: `Interbrand has been the world’s leading brand consultancy, for over 40 years – having pioneered iconic work and forged many of the brand building tools that are now commonplace.`,
        link: 'https://interbrand.com/best-global-brands/',
        data: interbrand_BestGlobalBrands2022
    },    
    {
        name: 'Clarivate_GlobalInnovators2022',
        display_name: 'Clarivate - Top 100 Global Innovators (2022)',
        description: `Clarivate is a global leader in providing trusted insights and analytics to accelerate the pace of innovation. The vision is to improve the way the world creates, protects and advances innovation.`,
        link: NavZhEnUrl('https://clarivate.com/zh-hant/top-100-innovators/the-top-100/?clv-award-year=2022', 'https://clarivate.com/top-100-innovators/the-top-100/?clv-award-year=2022'),
        data: Clarivate_GlobalInnovators2022
    },
    {
        name: 'Gartner_SupplyChain2022',
        display_name: 'Gartner - Supply Chain Top 25 (2022)',
        description: `Gartner provides actionable insights, guidance, and tools that enable faster, smarter decisions and stronger performance on an organization’s mission-critical priorities.`,
        link: 'https://www.gartner.com/en/supply-chain/research/supply-chain-top-25',
        data: Gartner_SupplyChain2022
    },
    {
        name: 'ESG_Sustainalytics',
        display_name: 'Sustainalytics - Company ESG Risk Ratings',
        description: `ESG Risk Ratings available for sustainability risk management. Identify, understand and manage your environmental, social and governance risks.`,
        link: 'https://www.sustainalytics.com/esg-ratings',
        data: "/norn-data/ranking/esg.json"
    },
    {
      name: 'Interbrand_BestGlobalBrands2021',
      display_name: 'Interbrand - Best Global Brands (2021)',
      description: `Interbrand has been the world’s leading brand consultancy, for over 40 years – having pioneered iconic work and forged many of the brand building tools that are now commonplace.`,
      link: 'https://interbrand.com/best-global-brands/',
      data: interbrand_BestGlobalBrands2021
    }
  ]
