import { useContext } from 'react';
import AuthContext from './context';

function Authenticator(props) {
  const { children } = props;

  return children({
    ...useContext(AuthContext)
  });
}

export default Authenticator;
