import React from "react"
import PropTypes from "prop-types"

import layoutStyle from "./layout.module.scss"

const Layout = ({ children} ) => {
  
  return (
    <>
      <div className={layoutStyle.container}>
	      <main>{children}</main>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
