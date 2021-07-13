import React, { useState, useEffect } from 'react';
// import './userCenter.css';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const Index = (props) => {
  const { } = props;
  const dispatch = useDispatch();
  const [] = useState([]);
  const history = useHistory();
  useEffect(() => {
    // history.push('/home/showPage');
    if (document.documentElement.clientWidth < 400) {
      history.push('/home');
    } else {
      history.push('/webHome')
    }
  }, [])
  return (
    <div style={{width:'0px',height:'0px'}}></div>
  );
};
Index.defaultProps = {
};
export default Index;