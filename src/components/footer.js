import React from 'react'
import Link from '@material-ui/core/Link'

import { NornStockScreenerUrl, NornStockScreenerMobileUrl, zmcx16ProjectUrl, zmcx16BlogUrl } from '../common/common'
import { NornFinanceAPIServerGithub } from '../common/optionsDef'

import footerStyle from './footer.module.scss'
import commonStyle from './common.module.scss'

const Footer = () => {

  return (
    <div className={footerStyle.container}>
      <div className={footerStyle.linkTitle + ' ' + commonStyle.comicFont}>Relate Links:</div>
      <Link className={footerStyle.link} href={NornStockScreenerUrl} target="_blank" rel="noreferrer noopener">
        <span className={commonStyle.comicFont}>Norn-StockScreener Github</span>
      </Link>
      <Link className={footerStyle.link} href={NornFinanceAPIServerGithub} target="_blank" rel="noreferrer noopener">
        <span className={commonStyle.comicFont}>Norn-Finance API Server Github</span>
      </Link>
      <Link className={footerStyle.link} href={NornStockScreenerMobileUrl} target="_blank" rel="noreferrer noopener">
        <span className={commonStyle.comicFont}>Norn-StockScreener Android APP</span>
      </Link>
      <Link className={footerStyle.link} href={zmcx16ProjectUrl} target="_blank" rel="noreferrer noopener">
        <span className={commonStyle.comicFont}>zmcx16's Side Projects</span>
      </Link>
      <Link className={footerStyle.link} href={zmcx16BlogUrl} target="_blank" rel="noreferrer noopener">
        <span className={commonStyle.comicFont}>zmcx16's Blog</span>
      </Link>
      <div className={footerStyle.copyright + ' ' + commonStyle.comicFont}>©zmcx16 All rights reserved.</div>
    </div>
  )
}

export default Footer
