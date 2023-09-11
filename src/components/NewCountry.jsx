import React, { Component } from 'react';

const NewCountry = (props) => {
  const {onAdd} = props;
  handleClick = () => {
    const name = prompt('Enter country name');
    if (name && name.trim().length > 0) {
      onAdd(name);
    }
  }
    return (
      <div className='newCountryButton'>
        <button onClick={ handleClick }>New Country</button>
      </div>
    );
}


export default NewCountry;
