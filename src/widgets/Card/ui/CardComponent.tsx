import React from 'react';
import { Card, CardHeader, CardFooter } from '@fluentui/react-components';
import { FolderRegular } from '@fluentui/react-icons';

interface DirectoryCardProps {
  name: string;
}

const CardComponent: React.FC<DirectoryCardProps> = ({ name }) => {
  return (
    <Card
      style={{
        width: '150px',
        padding: '16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <CardHeader>
        <div style={{ fontSize: '32px' }}>
          <FolderRegular />
        </div>
      </CardHeader>
      <CardFooter>
        <div style={{ fontWeight: 'bold' }}>{name}</div>
      </CardFooter>
    </Card>
  );
};

export default CardComponent;
