import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {debounce} from 'lodash'

import {searchAddress} from '../../../lib/api-addresses'

import SearchInput from '../../search-input'
import renderAddok from '../../search-input/render-addok'

const SearchAddress = ({selectAddress}) => {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSelect = feature => {
    selectAddress(feature)
  }

  const handleSearch = useCallback(debounce(async input => {
    try {
      const results = await searchAddress(input)
      setResults(
        results.features.filter(f => f.properties.type !== 'locality').splice(0, 5) || []
      )
    } catch (err) {
      setError(err)
    }

    setLoading(false)
  }, 300), [])

  useEffect(() => {
    if (input) {
      setResults([])
      setLoading(true)
      setError(null)
      handleSearch(input)
    }
  }, [handleSearch, input])

  return (
    <div className='search-address-container'>
      <SearchInput
        value={input}
        results={results}
        loading={loading}
        placeholder='Recherchez une adresse'
        onSelect={handleSelect}
        onSearch={setInput}
        renderItem={renderAddok}
        getItemValue={i => i.header || i.properties.name} />

      {error &&
        <div className='error'>
          {error}
        </div>}

      <style jsx>{`
        .search-address-container {

          position: relative;
        }

        .error {
          margin: 1em 0;
        }
      `}</style>
    </div>
  )
}

SearchAddress.propTypes = {
  selectAddress: PropTypes.func
}

export default SearchAddress
