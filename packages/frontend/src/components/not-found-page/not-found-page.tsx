import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ButtonType } from '../button/button';

export const NotFoundPage: React.FC = () => {
  const history = useHistory();
  return (
    <div className="content-wrapper">
      <h2>Page not found</h2>
      <p>This is not the page you are looking for.</p>
      <Button type={ButtonType.Button} onClick={() => history.push('/')}>
        Back to start
      </Button>
    </div>
  );
};
