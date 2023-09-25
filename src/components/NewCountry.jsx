import React from 'react';
import {Button} from 'react-bootstrap';

const NewCountry = (props) => {
  const { onAdd } = props;
  const handleClick = () => {
    const name = prompt('Enter country name');
    if (name && name.trim().length > 0) {
      onAdd(name);
    }
  }
  return (
    <div className='newCountryButton'>
      <Button onClick={ handleClick }>New Country</Button>
    </div>
  );
}

export default NewCountry;
