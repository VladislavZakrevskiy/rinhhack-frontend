import React from 'react';
import CardComponent from '@/widgets/Card/ui/CardComponent';

const directories = [
  { name: 'Документы' },
  { name: 'Музыка' },
  { name: 'Картинки' },
  { name: 'Видео' },
];

const WorlspacePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '16px' }}>
      {directories.map((dir, index) => (
        <CardComponent key={index} name={dir.name} />
      ))}
    </div>
  );
};

export default WorlspacePage;
