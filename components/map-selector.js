import React, {useState, useCallback, useContext} from 'react'
import {ChevronDown, ChevronUp} from 'react-feather'

import colors from '../styles/colors'

import {AppContext} from '../pages'

const MapSelector = () => {
  const {mapReport, regionsReport, departementsReport, setMapReport} = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)

  const mapReports = {
    Régions: regionsReport,
    Départements: departementsReport
  }

  const handleMap = useCallback(report => {
    setMapReport(mapReports[report])
    setIsOpen(false)
  }, [mapReports, setMapReport])

  return (
    <div className='map-select'>
      <div className='custom-select-input' onClick={() => setIsOpen(!isOpen)}>
        <span>{mapReport === regionsReport ? 'Régions' : 'Départements'} </span> {isOpen ? <ChevronDown /> : <ChevronUp />}
      </div>
      {isOpen && (
        <>
          {Object.keys(mapReports).filter(key => mapReports[key] !== mapReport).map(report => (
            <div key={report} className='custom-option' onClick={() => handleMap(report)}>
              <span>{report}</span>
            </div>
          ))}
        </>
      )}

      <style jsx>{`
        .map-select {
          display: flex;
          flex-direction: column;
        }
        .map-select:hover {
          cursor: pointer;
        }
        .custom-select-input {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5em;
        }
        .custom-option {
          display: flex;
          align-items: center;
          padding: 0.5em;
        }
        .custom-option:hover {
          background-color: ${colors.lightGrey};
          color: #000;
        }
        span {
          margin-right: 0.4em;
        }
        `}</style>
    </div>
  )
}

export default MapSelector
