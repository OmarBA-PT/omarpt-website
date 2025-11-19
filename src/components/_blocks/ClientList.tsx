import React from 'react';
import { stegaClean } from 'next-sanity';
import type { SanityLiveEditingProps } from '../../utils/sectionHelpers';
import type { CLIENTS_QUERYResult } from '@/sanity/types';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';

interface ClientListProps extends Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  className?: string;
  clientsData?: CLIENTS_QUERYResult | null;
}

const ClientList: React.FC<ClientListProps> = ({
  className = '',
  clientsData,
  documentId,
  documentType,
}) => {
  if (!clientsData) {
    return null;
  }

  // Combine all levels into a single array with their level info and array index
  const allClients: Array<{ name: string; level: number; levelKey: string; arrayIndex: number }> =
    [];

  // Add clients from each level
  [1, 2, 3, 4, 5].forEach((level) => {
    const levelKey = `level${level}` as 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
    const levelClients = clientsData[levelKey];
    if (levelClients && Array.isArray(levelClients)) {
      levelClients.forEach((client, arrayIndex) => {
        if (client && typeof client === 'string') {
          allClients.push({ name: stegaClean(client), level, levelKey, arrayIndex });
        }
      });
    }
  });

  if (allClients.length === 0) {
    return null;
  }

  // Font size classes for each level - using custom body text classes
  const getFontSizeClass = (level: number): string => {
    switch (level) {
      case 1:
        return 'text-body-3xl font-bold';
      case 2:
        return 'text-body-2xl font-bold';
      case 3:
        return 'text-body-xl font-semibold';
      case 4:
        return 'text-body-lg font-medium';
      case 5:
        return 'text-body-base font-medium';
      default:
        return 'md:text-body-base';
    }
  };

  return (
    <div
      className={`w-full max-w-4xl ${className} mx-auto`}
      role='region'
      aria-label='Client list in lineup format'>
      <div className='flex flex-wrap items-baseline justify-center gap-x-1 md:gap-x-2'>
        {allClients.map((client, index) => (
          <React.Fragment key={`${client.name}-${index}`}>
            <div
              {...(documentId && documentType
                ? createSanityDataAttribute(
                    documentId,
                    documentType,
                    `${client.levelKey}[${client.arrayIndex}]`
                  )
                : {})}
              className={`${getFontSizeClass(client.level)} uppercase text-justify`}>
              {client.name}
            </div>
            {index < allClients.length - 1 && (
              <span className={`${getFontSizeClass(client.level)}`}>•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
