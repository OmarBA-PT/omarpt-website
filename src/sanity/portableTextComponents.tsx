import React from 'react';
import Image from 'next/image';
import { PortableTextComponents } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';

// Get text alignment from context (passed down from RichText component)
const getAlignmentClasses = (alignment: string = 'left') => {
  switch (alignment) {
    case 'right':
      return {
        bulletClass:
          'list-disc space-y-2 [&>li::marker]:text-brand-secondary text-right [&>li]:list-inside',
        numberClass:
          'list-decimal space-y-2 [&>li::marker]:text-brand-secondary text-right [&>li]:list-inside',
        listItemClass: 'leading-relaxed',
        standoutClass:
          'border-r-4 border-brand-primary bg-gray-50 pr-4 py-3 my-4 rounded-l-lg italic text-body-xl text-right',
      };
    case 'center':
      return {
        bulletClass:
          'list-disc list-inside space-y-2 [&>li::marker]:text-brand-secondary text-center',
        numberClass:
          'list-decimal list-inside space-y-2 [&>li::marker]:text-brand-secondary text-center',
        listItemClass: 'leading-relaxed text-center',
        standoutClass:
          'border-l-4 border-brand-primary bg-gray-50 pl-4 py-3 my-4 rounded-r-lg italic text-body-xl text-center',
      };
    default: // 'left' or 'inherit'
      return {
        bulletClass: 'list-disc pl-6 space-y-2 [&>li::marker]:text-brand-secondary',
        numberClass: 'list-decimal pl-6 space-y-2 [&>li::marker]:text-brand-secondary',
        listItemClass: 'leading-relaxed',
        standoutClass:
          'border-l-4 border-brand-primary bg-gray-50 pl-4 py-3 my-4 rounded-r-lg italic text-body-xl',
      };
  }
};

// Create components factory that accepts alignment context
export const createComponents = (alignment: string = 'left'): PortableTextComponents => {
  const alignmentClasses = getAlignmentClasses(alignment);

  return {
    block: {
      // Default style (what users get when they just start typing)
      normal: ({ children }) => {
        // Handle empty blocks (empty lines) - render truly empty paragraph for CSS :empty selector
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <p className='text-body-base'></p>;
        }

        // Check if children contains only empty spans or text nodes
        const hasOnlyEmptyContent = React.Children.toArray(children).every((child) => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          // Check if it's a React element with empty content
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <p className='text-body-base'></p>;
        }

        return <p className='text-body-base'>{children}</p>;
      },

      // Body text styles - using appropriate semantic tags with typography utilities
      'body-xs': ({ children }) => {
        // Handle empty blocks (empty lines) - render truly empty for CSS :empty selector
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <span className='block text-body-xs'></span>;
        }

        // Check if children contains only empty spans or text nodes
        const hasOnlyEmptyContent = React.Children.toArray(children).every((child) => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <span className='block text-body-xs'></span>;
        }

        return <span className='block text-body-xs'>{children}</span>;
      },
      'body-sm': ({ children }) => {
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <span className='block text-body-sm'></span>;
        }

        const hasOnlyEmptyContent = React.Children.toArray(children).every((child) => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <span className='block text-body-sm'></span>;
        }

        return <span className='block text-body-sm'>{children}</span>;
      },
      'body-lg': ({ children }) => {
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <span className='block text-body-lg'></span>;
        }

        const hasOnlyEmptyContent = React.Children.toArray(children).every((child) => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <span className='block text-body-lg'></span>;
        }

        return <span className='block text-body-lg'>{children}</span>;
      },
      'body-xl': ({ children }) => {
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <span className='block text-body-xl'></span>;
        }

        const hasOnlyEmptyContent = React.Children.toArray(children).every((child) => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <span className='block text-body-xl'></span>;
        }

        return <span className='block text-body-xl'>{children}</span>;
      },
      'body-2xl': ({ children }) => {
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <span className='block text-body-2xl'></span>;
        }

        const hasOnlyEmptyContent = React.Children.toArray(children).every((child) => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <span className='block text-body-2xl'></span>;
        }

        return <span className='block text-body-2xl'>{children}</span>;
      },
      'body-3xl': ({ children }) => {
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <span className='block text-body-3xl'></span>;
        }

        const hasOnlyEmptyContent = React.Children.toArray(children).every((child) => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <span className='block text-body-3xl'></span>;
        }

        return <span className='block text-body-3xl'>{children}</span>;
      },

      // Special styles
      standout: ({ children }) => {
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <div className={alignmentClasses.standoutClass}>&nbsp;</div>;
        }
        return <div className={alignmentClasses.standoutClass}>{children}</div>;
      },
    },

    list: {
      bullet: ({ children }) => <ul className={alignmentClasses.bulletClass}>{children}</ul>,
      number: ({ children }) => <ol className={alignmentClasses.numberClass}>{children}</ol>,
    },

    listItem: ({ children }) => (
      <li className={`${alignmentClasses.listItemClass} [&>span]:inline [&>span]:leading-[inherit]`}>
        {children}
      </li>
    ),

    marks: {
      strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
      em: ({ children }) => <em className='italic'>{children}</em>,
      chauPhilomeneOne: ({ children }) => <span className='font-chau'>{children}</span>,

      link: ({ value, children }) => {
        // Handle simple external link structure
        const href = value?.href;

        if (!href) {
          return <span>{children}</span>;
        }

        const linkClassName = 'text-subtle hover:text-brand-primary underline transition-colors';

        // All rich text links are treated as external and open in new tab
        return (
          <a href={href} target='_blank' rel='noopener noreferrer' className={linkClassName}>
            {children}
          </a>
        );
      },

      color: (props) => {
        return <span style={{ color: props.value?.hex || '#000000' }}>{props.children}</span>;
      },
    },

    types: {
      image: (props) => {
        // Validate image has proper asset reference before rendering
        if (!props.value || !props.value.asset || !props.value.asset._ref) {
          return null;
        }

        return (
          <Image
            className='rounded-lg not-prose w-full h-auto'
            src={urlFor(props.value).width(600).height(400).quality(80).auto('format').url()}
            alt={props?.value?.alt || ''}
            width='600'
            height='400'
          />
        );
      },
    },
  };
};

// Default components (for backward compatibility)
export const components: PortableTextComponents = createComponents('left');

// Components specifically for hero content
export const heroComponents: PortableTextComponents = {
  ...components,
};
