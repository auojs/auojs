export interface ContainerOption {
  marker?: string;
  validate: (params: string) => boolean;
  render: (info: string, content: string) => void;
}

export const defaultContainerOption = {
  marker: ':',
  validate: () => true,
  render: () => null
};

export function containers(source: string, options: ContainerOption) {
  options = Object.assign(defaultContainerOption, options);
  const { marker, validate, render } = options;

  let content = source;
  if (marker) {
    const markers = marker.repeat(3);
    const reg = new RegExp(`${markers}([^\\r\\n]*)([\\s\\S]*?)${markers}`, 'g');

    content = source.replace(reg, (match: any, info: string, content: string) => {
      if (!validate || !validate(info) || !render) return match;

      render(info, content);
      return '';
    });
  }

  return content;
}
