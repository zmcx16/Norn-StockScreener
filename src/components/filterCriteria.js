import React, { useState, useEffect, useRef, useCallback, createRef } from "react"

import filterCriteriaStyle from "./filterCriteria.module.scss"

/*
// data sample
{
  "name": "P/B",
  "name_display": "P/B",
  "args_items": ["< 0", "0 - 0.5", "0.5 - 1.0", "1.0 - 1.5", "1.5 - 2.0", "2.0 - 3.0", "> 3.0"],
  "default_index": 2
}
*/

const FCArg = () => {
  return (
    <>
      111
    </>
  )
}

const FilterCriteria = ({ filterCriteriaRef, dataTemplate }) => {

  const [argNodes, setArgNodes] = useState([])
  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    var argNodesTemp = []

    for (let i = 0; i < dataTemplate.args_items.length; i++) {
      /*
      scoresRef.current[i] = createRef()
      scoresRef.current[i].current = isMobile ? parseInt(questions[i].initScore / 2) : questions[i].initScore

      questionNodeTemp.push(<AtQuestion
        key={i}
        langFont={langFont}
        config={{
          size: isMobile ? 6 : 11,
          minScore: isMobile ? parseInt(questions[i].minScore / 2) : questions[i].minScore,
          questionID: questions[i].questionID,
          headerStartID: questions[i].headerStartID,
          headerEndID: questions[i].headerEndID
        }} axisBadgeImage={axisBadgeImage} scoreRef={scoresRef.current[i]}
      />)
      */

      argNodesTemp.push(<FCArg key={i}/>);
    }

    setArgNodes(argNodesTemp)

    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={filterCriteriaStyle.argNodes}>
        {argNodes}
      </div>
    </>
  )
}


export default FilterCriteria
