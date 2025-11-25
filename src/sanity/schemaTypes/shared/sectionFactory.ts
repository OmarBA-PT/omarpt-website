import { defineType, defineField, type FieldDefinition } from 'sanity';
import { AnchorIdInput } from '../../components/AnchorIdInput';
import { createSectionBlockList } from './blockLists';

interface SectionFactoryConfig {
  name: string;
  title: string;
  description: string;
  icon: string;
  hasSubtitle?: boolean;
  allowedChildSections?: string[];
}

export function createSectionSchema(config: SectionFactoryConfig) {
  const fields: FieldDefinition[] = [
    defineField({
      name: 'hideSection',
      title: 'Hide Section',
      type: 'boolean',
      description:
        'Hide this section and all its content from the frontend. Useful for temporarily disabling sections without deleting them. ⚠️ Warning: Any navigation links that point to this section will not work while it is hidden. Consider hiding those navigation links as well.',
      initialValue: false,
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: `Title for this ${config.title.toLowerCase()} (will render as ${config.name === 'pageSection' ? 'h2' : config.name === 'subSection' ? 'h3' : config.name === 'subSubSection' ? 'h4' : 'heading'})`,
      validation: (Rule) => Rule.required().error(`${config.title} title is required`),
    }),
    defineField({
      name: 'titleTranslation',
      title: 'Title Translation (Te Reo Māori)',
      type: 'string',
      description: 'Optional translation of the section title, typically in Te Reo Māori. This will be displayed below the main title in a complementary style. Can also be used for alternative titles or subtitles in any language.',
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      description:
        'Auto-generated from the section title. This field is read-only to prevent errors. Use the "Regenerate" button to recreate the ID if needed.',
      components: {
        input: AnchorIdInput,
      },
      validation: (Rule) =>
        Rule.required()
          .error('Anchor ID is required for section linking')
          .custom((value, context) => {
            if (!value) return true;

            // Check for valid format
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
              return 'Anchor ID must be lowercase letters, numbers, and hyphens only (e.g., about-our-services)';
            }

            // Get the current document and check for duplicate anchor IDs
            const document = context.document as { content?: unknown[] };
            if (!document?.content) return true;

            // Flatten all content to find sections
            const getAllSections = (
              content: unknown[]
            ): { _type: string; anchorId?: string; _key?: string }[] => {
              const sections: { _type: string; anchorId?: string; _key?: string }[] = [];
              for (const item of content || []) {
                const typedItem = item as {
                  _type: string;
                  content?: unknown[];
                  anchorId?: string;
                  _key?: string;
                };
                if (
                  typedItem._type === 'pageSection' ||
                  typedItem._type === 'subSection' ||
                  typedItem._type === 'subSubSection'
                ) {
                  sections.push(typedItem);
                  if (typedItem.content) {
                    sections.push(...getAllSections(typedItem.content));
                  }
                }
              }
              return sections;
            };

            const allSections = getAllSections(document.content);
            const currentSection = context.parent as { _key?: string };

            // Count occurrences of this anchor ID (excluding current section being edited)
            const duplicates = allSections.filter(
              (section) => section.anchorId === value && section._key !== currentSection?._key
            );

            if (duplicates.length > 0) {
              return `Anchor ID "${value}" already exists on this page. Each section must have a unique anchor ID.`;
            }

            return true;
          }),
    }),
  ];

  // Add subtitle field for PageSection only - insert after anchor ID (position 3 now, since titleTranslation is at position 2)
  if (config.hasSubtitle) {
    fields.splice(
      3,
      0,
      defineField({
        name: 'subtitle',
        title: 'Section Subtitle',
        type: 'text',
        description: 'Optional subtitle for this section',
      })
    );
  }

  // Add topText field for PageSection only - insert after subtitle (or after anchor ID if no subtitle)
  if (config.name === 'pageSection') {
    const insertPosition = config.hasSubtitle ? 4 : 3;
    fields.splice(
      insertPosition,
      0,
      defineField({
        name: 'topText',
        title: 'Top Text',
        type: 'string',
        description:
          'Optional text displayed at the top of the section. Can be used for posting dates, timestamps, or any contextual information.',
      })
    );
  }

  // Add compact gap field for PageSection only - insert after topText or at appropriate position
  if (config.name === 'pageSection') {
    const insertPosition = config.hasSubtitle ? 5 : 4;
    fields.splice(
      insertPosition,
      0,
      defineField({
        name: 'useCompactGap',
        title: 'Use Compact Gap After Section',
        type: 'boolean',
        description:
          'Add a smaller gap after this section instead of the default spacing. Note: Gap size may be overridden by other layout rules depending on content placement. Large gaps work best for long sections with varied content, while compact gaps suit shorter text-focused sections.',
        initialValue: false,
      })
    );
  }

  // Add backgroundStyle field for PageSection only - insert after useCompactGap
  if (config.name === 'pageSection') {
    const insertPosition = config.hasSubtitle ? 6 : 5;
    fields.splice(
      insertPosition,
      0,
      defineField({
        name: 'backgroundStyle',
        title: 'Background Style',
        type: 'string',
        description:
          'Optional background styling for this section. If left blank, no background will be applied. If selected, will apply that background style.',
        options: {
          list: [
            { title: 'None', value: '' },
            { title: 'Smokey 1', value: 'smokey-1' },
            { title: 'Smokey 2', value: 'smokey-2' },
            { title: 'Smokey 3', value: 'smokey-3' },
            { title: 'Smokey 4', value: 'smokey-4' },
            { title: 'Smokey 5', value: 'smokey-5' },
            { title: 'Smokey 6', value: 'smokey-6' },
            { title: 'Smokey 7', value: 'smokey-7' },
            { title: 'Smokey 8', value: 'smokey-8' },
          ],
          layout: 'dropdown',
        },
        initialValue: '',
      })
    );
  }

  // Build content array with allowed child sections and standard blocks
  const contentOf = createSectionBlockList(config.allowedChildSections);

  fields.push(
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: contentOf,
    })
  );

  return defineType({
    name: config.name,
    title: config.title,
    type: 'object',
    description: config.description,
    icon: () => config.icon,
    fields,
    preview: {
      select: {
        title: 'title',
        hideSection: 'hideSection',
        ...(config.hasSubtitle && { subtitle: 'subtitle' }),
        ...(config.name === 'pageSection' && { topText: 'topText' }),
        content: 'content',
      },
      prepare(selection: {
        title?: string;
        hideSection?: boolean;
        subtitle?: string;
        topText?: string;
        content?: unknown[];
      }) {
        const { title, hideSection, subtitle, content } = selection;
        const blockCount = Array.isArray(content) ? content.length : 0;
        const displaySubtitle = subtitle
          ? `${subtitle.slice(0, 50)}${subtitle.length > 50 ? '...' : ''}`
          : `${blockCount} block${blockCount !== 1 ? 's' : ''}`;

        const titlePrefix = hideSection ? '🚫 ' : '';
        const statusSuffix = hideSection ? ' (Hidden)' : '';

        return {
          title: `${titlePrefix}${title || config.title}${statusSuffix}`,
          subtitle: displaySubtitle,
        };
      },
    },
  });
}
